import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';

import pkg from './package.json';

const noDeclarationFiles = { compilerOptions: { declaration: false } };

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

export default defineConfig([
  // CommonJS, TypeScript types, and CSS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      copy({
        targets: [{ src: 'src/query-builder.scss', dest: 'dist' }]
      }),
      scss({ output: 'dist/query-builder.css' }),
      typescript({ useTsconfigDeclarationDir: true }),
      commonjs()
    ]
  },
  // ES modules
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      scss({ output: false }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      commonjs()
    ]
  }
]);
