export default {
  input: 'src/main.js',
  output: [{
    file: 'dist/main.cjs',
    format: 'cjs'
  }, {
    file: 'dist/main.umd.js',
    format: 'umd',
    name: 'hrwHash'
  }]
};
