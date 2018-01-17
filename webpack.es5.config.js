"use strict";
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    index: "./dist/index.bundle.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].es5.bundle.js"
  },

  plugins: [new UglifyJSPlugin()],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [["es2015", { modules: false, loose: true }], "react"]
        }
      }
    ]
  },

  resolve: {
    modules: [path.join(process.cwd(), "app"), "node_modules"],
    extensions: [".js", ".json"]
  },

  devtool: false
};
