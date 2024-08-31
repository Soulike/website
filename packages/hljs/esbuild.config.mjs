import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/style.css'],
  bundle: true,
  minify: true,
  outfile: 'dist/style.css',
});
