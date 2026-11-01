import {randomUUID} from 'node:crypto';
import {readdir, readFile, rename, rm, stat, writeFile} from 'node:fs/promises';
import {dirname, join, relative} from 'node:path';

import ts from 'typescript';
import {isMap, isSeq, parseDocument, Scalar} from 'yaml';

import {nodeTarget, readNodeMajor} from './runtime.ts';

interface Change {
  path: string;
  original: string;
  contents: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function quoted(value: string): Scalar<string> {
  const scalar = new Scalar(value);
  scalar.type = Scalar.QUOTE_SINGLE;
  return scalar;
}

function yamlDocument(contents: string, path: string) {
  const document = parseDocument(contents);
  if (document.errors.length > 0) {
    throw new Error(`Invalid YAML in ${path}: ${document.errors[0]?.message}`);
  }
  return document;
}

async function dockerfiles(directory: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (['node_modules', 'dist', 'coverage', '.git'].includes(entry.name)) {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await dockerfiles(path)));
      continue;
    }
    if (entry.isFile() && entry.name === 'Dockerfile') {
      result.push(path);
    }
  }
  return result;
}

function updateTarget(contents: string, major: string): string {
  const source = ts.createSourceFile(
    'server.ts',
    contents,
    ts.ScriptTarget.Latest,
    true,
  );
  let target: ts.StringLiteral | undefined;
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== 'serverBuildOptions'
      ) {
        continue;
      }
      let options = declaration.initializer;
      if (options && ts.isSatisfiesExpression(options)) {
        options = options.expression;
      }
      if (!options || !ts.isObjectLiteralExpression(options)) {
        continue;
      }
      for (const property of options.properties) {
        if (
          !ts.isPropertyAssignment(property) ||
          property.name.getText(source) !== 'transform' ||
          !ts.isObjectLiteralExpression(property.initializer)
        ) {
          continue;
        }
        for (const option of property.initializer.properties) {
          if (
            ts.isPropertyAssignment(option) &&
            option.name.getText(source) === 'target' &&
            ts.isStringLiteral(option.initializer)
          ) {
            target = option.initializer;
          }
        }
      }
    }
  }
  if (!target) {
    throw new Error(
      'Rolldown serverBuildOptions.transform.target must be a generated string literal.',
    );
  }
  if (target.text === nodeTarget(major)) {
    return contents;
  }
  const start = target.getStart(source);
  const quote = contents[start];
  return `${contents.slice(0, start)}${quote}${nodeTarget(major)}${quote}${contents.slice(target.end)}`;
}

export async function synchronizeNodeVersion(
  projectRoot: string,
  write: boolean,
): Promise<string[]> {
  const major = readNodeMajor(projectRoot);
  const changes: Change[] = [];
  async function update(path: string, transform: (contents: string) => string) {
    const original = await readFile(path, 'utf8');
    const contents = transform(original);
    if (contents !== original) {
      changes.push({path, original, contents});
    }
  }

  await update(join(projectRoot, 'package.json'), (contents) => {
    const packageJson: unknown = JSON.parse(contents);
    if (!isRecord(packageJson)) {
      throw new Error('package.json must be an object.');
    }
    const engines = packageJson.engines ?? {};
    if (!isRecord(engines)) {
      throw new Error('package.json engines must be an object.');
    }
    if (engines.node === `>=${major}`) {
      return contents;
    }
    packageJson.engines = {...engines, node: `>=${major}`};
    return `${JSON.stringify(packageJson, null, 2)}\n`;
  });

  await update(join(projectRoot, 'pnpm-workspace.yaml'), (contents) => {
    const document = yamlDocument(contents, 'pnpm-workspace.yaml');
    const range = `^${major}.0.0`;
    if (document.getIn(['catalog', '@types/node']) === range) {
      return contents;
    }
    document.setIn(['catalog', '@types/node'], quoted(range));
    return document.toString({lineWidth: 0, flowCollectionPadding: false});
  });

  const workflows = join(projectRoot, '.github/workflows');
  for (const file of await readdir(workflows)) {
    if (!/\.ya?ml$/.test(file)) {
      continue;
    }
    await update(join(workflows, file), (contents) => {
      const document = yamlDocument(contents, file);
      const jobs = document.get('jobs', true);
      if (!isMap(jobs)) {
        return contents;
      }
      let changed = false;
      for (const pair of jobs.items) {
        if (!isMap(pair.value)) {
          continue;
        }
        const steps = pair.value.get('steps', true);
        if (!isSeq(steps)) {
          continue;
        }
        for (const step of steps.items) {
          if (!isMap(step)) {
            continue;
          }
          const uses = step.get('uses');
          if (
            typeof uses !== 'string' ||
            !uses.startsWith('actions/setup-node@')
          ) {
            continue;
          }
          let inputs: unknown = step.get('with', true);
          if (inputs === undefined) {
            inputs = document.createNode({});
            step.set('with', inputs);
          }
          if (!isMap(inputs)) {
            throw new Error(`${file}: setup-node must have a with mapping.`);
          }
          if (
            inputs.get('node-version') === major &&
            !inputs.has('node-version-file')
          ) {
            continue;
          }
          inputs.set('node-version', quoted(major));
          inputs.delete('node-version-file');
          changed = true;
        }
      }
      return changed
        ? document.toString({lineWidth: 0, flowCollectionPadding: false})
        : contents;
    });
  }

  for (const path of await dockerfiles(join(projectRoot, 'apps'))) {
    await update(path, (contents) =>
      contents.replace(
        /^(\s*FROM\s+(?:--platform=\S+\s+)?node:)(\S+)(.*)$/gm,
        (_match: string, prefix: string, tag: string, suffix: string) => {
          const version = /^(?:lts|latest|\d+(?:\.\d+){0,2})(-.*)?$/.exec(tag);
          if (!version || tag.includes('@')) {
            throw new Error(
              `${relative(projectRoot, path)}: Node image tag cannot be generated: ${tag}`,
            );
          }
          const variantStart = tag.indexOf('-');
          const variant = variantStart === -1 ? '' : tag.slice(variantStart);
          return `${prefix}${major}${variant}${suffix}`;
        },
      ),
    );
  }

  await update(
    join(projectRoot, 'configs/rolldown/src/server.ts'),
    (contents) => updateTarget(contents, major),
  );

  // Compute every projection before writing so invalid inputs leave files unchanged.
  if (write) {
    for (const change of changes) {
      if ((await readFile(change.path, 'utf8')) !== change.original) {
        throw new Error(
          `${change.path} changed during generation; retry without concurrent edits.`,
        );
      }
      const temporary = join(
        dirname(change.path),
        `.node-version-${randomUUID()}.tmp`,
      );
      try {
        const {mode} = await stat(change.path);
        await writeFile(temporary, change.contents, {mode});
        await rename(temporary, change.path);
      } finally {
        await rm(temporary, {force: true});
      }
    }
  }
  return changes.map((change) => relative(projectRoot, change.path));
}
