import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json' assert { type: 'json' };

export default [
  {
    input: '__mocks__/index.ts',
    output: [{ file: 'dist/__mocks__/index.js', format: 'cjs' }],
    plugins: [typescript({ tsconfig: '__mocks__/tsconfig.json' })],
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
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ moduleDirectories: ['.', 'node_modules'] }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json' }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
