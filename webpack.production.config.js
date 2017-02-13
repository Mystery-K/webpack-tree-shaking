'use strict';
let path = require('path');
let BabiliPlugin = require("babili-webpack-plugin");

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
    new BabiliPlugin()
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
