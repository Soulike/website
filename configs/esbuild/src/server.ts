import {build, type BuildOptions} from 'esbuild';

const serverBuildOptions = {
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  minify: true,
  sourcemap: 'linked',
  outdir: './dist',
  outExtension: {'.js': '.mjs'},
  banner: {
    // Some bundled CommonJS dependencies call require dynamically at runtime.
    js: "import {createRequire as __websiteCreateRequire} from 'node:module'; const require = __websiteCreateRequire(import.meta.url);",
  },
} satisfies Omit<BuildOptions, 'entryPoints'>;

export async function buildServer(entryPoints: string[]): Promise<void> {
  await build({...serverBuildOptions, entryPoints});
}
