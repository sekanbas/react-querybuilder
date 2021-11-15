import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { resolve } from 'path';
import { defineConfig } from 'rollup';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

const extensions = ['.ts', '.tsx'];

const noDeclarationFiles = { compilerOptions: { declaration: false } };

const scssImporter = (url, _prev, done) => {
  if (url[0] !== '~') {
    return null;
  }
  const info = { file: resolve(`node_modules/${url.substr(1)}`) };
  if (done) {
    done(info);
  }
  return info;
};

export default defineConfig([
  {
    input: 'demo/main.tsx',
    output: {
      file: 'dist_demo/index.js',
      format: 'es'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      scss({ importer: scssImporter, output: 'dist_demo/index.css' }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        babelHelpers: 'runtime',
        plugins: [['@babel/plugin-transform-runtime']]
      }),
      html({
        title: 'React Query Builder Demo',
        meta: {},
        template: ({ title }) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="index.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
</html>`
      }),
      serve({ contentBase: 'dist_demo', port: 8080 })
    ]
  }
]);
