import {execFileSync} from 'node:child_process';
import {readFileSync, realpathSync} from 'node:fs';
import {join, relative} from 'node:path';

export interface WorkspaceCheckIssue {
  workspacePath: string;
  packageName: string;
  missing: string[];
}

export interface WorkspaceCheckResult {
  checkedCount: number;
  issues: WorkspaceCheckIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function listWorkspaceDirectories(projectRoot: string): string[] {
  const output = execFileSync(
    'pnpm',
    ['--recursive', 'list', '--depth', '-1', '--json'],
    {cwd: projectRoot, encoding: 'utf8'},
  );
  const parsed: unknown = JSON.parse(output);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected pnpm recursive list JSON output to be an array.');
  }

  const resolvedRoot = realpathSync(projectRoot);
  const directories: string[] = [];
  for (const entry of parsed) {
    if (!isRecord(entry) || !isNonEmptyString(entry.path)) {
      throw new Error('Expected each workspace entry to include a path.');
    }
    const resolvedEntry = realpathSync(entry.path);
    if (resolvedEntry === resolvedRoot) {
      continue;
    }
    directories.push(resolvedEntry);
  }
  return directories;
}

export function checkWorkspaces(projectRoot: string): WorkspaceCheckResult {
  const resolvedRoot = realpathSync(projectRoot);
  const directories = listWorkspaceDirectories(resolvedRoot);
  if (directories.length === 0) {
    throw new Error('No workspace packages discovered.');
  }

  const issues: WorkspaceCheckIssue[] = [];
  for (const directory of directories) {
    const manifestPath = join(directory, 'package.json');
    const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!isRecord(manifest)) {
      throw new Error(`Expected ${manifestPath} to contain a JSON object.`);
    }

    const missing: string[] = [];
    if (manifest.type !== 'module') {
      missing.push('type: "module"');
    }
    const scripts = isRecord(manifest.scripts) ? manifest.scripts : undefined;
    if (!isNonEmptyString(scripts?.typecheck)) {
      missing.push('scripts.typecheck');
    }
    if (!isNonEmptyString(scripts?.lint)) {
      missing.push('scripts.lint');
    }

    if (missing.length > 0) {
      const workspacePath = relative(resolvedRoot, directory);
      const packageName = isNonEmptyString(manifest.name)
        ? manifest.name
        : workspacePath;
      issues.push({
        workspacePath,
        packageName,
        missing,
      });
    }
  }

  return {
    checkedCount: directories.length,
    issues,
  };
}
