import {type InputOptions, type OutputOptions, rolldown} from 'rolldown';

const serverBuildOptions = {
  platform: 'node',
  tsconfig: true,
  transform: {target: 'node26'},
  resolve: {extensionAlias: {'.js': ['.ts', '.js']}},
  onLog(level, log, defaultHandler) {
    // Runtime images have no node_modules, so unresolved imports must fail.
    defaultHandler(log.code === 'UNRESOLVED_IMPORT' ? 'error' : level, log);
  },
} satisfies Omit<InputOptions, 'input'>;

const serverOutputOptions = {
  dir: './dist',
  entryFileNames: '[name].mjs',
  format: 'esm',
  minify: true,
  keepNames: true,
  sourcemap: true,
  codeSplitting: false,
  polyfillRequire: true,
} satisfies OutputOptions;

export async function buildServer(entryPoints: string[]): Promise<void> {
  const bundle = await rolldown({...serverBuildOptions, input: entryPoints});
  try {
    await bundle.write(serverOutputOptions);
  } finally {
    await bundle.close();
  }
}
