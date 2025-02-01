import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/style.css'],
  bundle: false,
  minify: false,
  outfile: 'dist/style.css',
});
