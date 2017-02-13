'use strict';
let path = require('path');

module.exports = {
  entry: {
    'test': './src/test.js'
  },

  output: {
    path: './dist',
    filename: '[name].bundle.js'
  },

  module: {
    rules: []
  },

  plugins: [

  ],

  resolve: {
    modules: [
      path.join(process.cwd(), 'app'),
      'node_modules'
    ],
    extensions: ['.js', '.json']
  },

  devtool: false
};
