import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/style.css'],
  bundle: true,
  minify: false,
  outfile: 'dist/style.css',
});
