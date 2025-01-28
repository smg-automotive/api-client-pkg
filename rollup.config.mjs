import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { dirname } from 'path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json' with { type: 'json' };

const jsPlugins = [
  peerDepsExternal(),
  resolve({ moduleDirectories: ['.', 'node_modules'] }),
];

export default [
  {
    input: '__mocks__/index.ts',
    output: [{ file: 'dist/__mocks__/index.js', format: 'cjs' }],
    plugins: [
      typescript({
        tsconfig: '__mocks__/tsconfig.json',
        outDir: 'dist/__mocks__',
      }),
    ],
  },
  {
    input: '__mocks__/index.ts',
    output: [{ file: 'dist/__mocks__/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: '__mocks__/tsconfig.json' })],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      ...jsPlugins,
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: dirname(packageJson.main),
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      ...jsPlugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: dirname(packageJson.module),
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts()],
  },
];
