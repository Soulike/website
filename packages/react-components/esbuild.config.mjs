import esbuild from 'esbuild';

esbuild.buildSync({
  entryPoints: ['src/**/*.css'],
  bundle: true,
  outdir: 'dist',
});
