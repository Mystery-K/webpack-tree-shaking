"use strict";
const path = require("path");
const BabiliPlugin = require("babili-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },

  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: "babel-loader",
      //   options: {
      //     babelrc: false,
      //     presets: [["es2015", { modules: false, loose: true }], "react"]
      //   }
      // }
    ]
  },

  // plugins: [new BabiliPlugin()],
  // plugins: [new UglifyJSPlugin()],

  resolve: {
    modules: [path.join(process.cwd(), "app"), "node_modules"],
    extensions: [".js", ".json"]
  },

  devtool: false
};
