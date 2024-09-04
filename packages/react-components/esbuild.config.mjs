import esbuild from 'esbuild';

esbuild.buildSync({
  entryPoints: ['src/**/*.css'],
  bundle: true,
  minify: true,
  outdir: 'dist',
});
