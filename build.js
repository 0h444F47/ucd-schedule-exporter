const esbuild = require('esbuild');
const fs = require('fs');

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  outfile: 'bookmarklet.js',
  format: 'iife',
  banner: {
    js: '(() => {',
  },
  footer: {
    js: '})();',
  },
}).then(() => {
  console.log('Build complete!');
}).catch(() => process.exit(1));