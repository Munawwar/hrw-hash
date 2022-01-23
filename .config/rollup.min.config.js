import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/main.js',
  output: [{
    file: 'dist/main.min.js',
    format: 'esm'
  }, {
    file: 'dist/main.min.cjs',
    format: 'cjs'
  }, {
    file: 'dist/main.umd.min.js',
    format: 'umd',
    name: 'hrwHash'
  }],
  plugins: [terser()]
};
