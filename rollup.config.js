import commonjs from '@rollup/plugin-commonjs'
import buble from '@rollup/plugin-buble'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import pkg from './package.json'

export default [
  {
    input: './src/index.ts',
    output: {
      file: `./dist/cjs/${pkg.name.split('/')[1]}.js`,
      sourceMap: 'inline',
      format: 'cjs',
    },
    plugins: [
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
    ],
  },
  {
    input: './src/plugin.ts',
    output: {
      file: `./dist/cjs/plugin.js`,
      sourceMap: 'inline',
      format: 'cjs',
    },
    plugins: [
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue({
        compileTemplate: true,
      }),
      buble(),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: `./dist/esm/${pkg.name.split('/')[1]}.js`,
      sourceMap: 'inline',
      format: 'esm',
    },
    plugins: [
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
    ],
  },
  {
    input: './src/plugin.ts',
    output: {
      file: `./dist/esm/plugin.js`,
      sourceMap: 'inline',
      format: 'esm',
    },
    plugins: [
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue({
        compileTemplate: true,
      }),
      buble(),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: `./dist/umd/${pkg.name.split('/')[1]}.js`,
      name: 'nuxtSpearlyCmsModule',
      format: 'umd',
    },
    plugins: [
      nodeResolve({
        rootDir: 'src',
        declaration: true,
      }),
      commonjs(),
      typescript(),
    ],
  },
  {
    input: './src/plugin.ts',
    output: {
      file: `./dist/umd/plugin.js`,
      name: 'nuxtSpearlyCmsModulePlugin',
      format: 'umd',
    },
    plugins: [
      vue({
        compileTemplate: true,
      }),
      nodeResolve({
        rootDir: 'src',
        declaration: true,
      }),
      commonjs(),
      typescript(),
      buble(),
    ],
  },
]
