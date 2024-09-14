import esbuild from 'esbuild';

esbuild.buildSync({
  entryPoints: ['src/**/*.css'],
  bundle: true,
  minify: true,
  outdir: 'dist',
  target: ['safari16', 'chrome100', 'firefox100'],
});
