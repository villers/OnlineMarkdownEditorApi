var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    'server': './src/server.ts',
    'render': './src/render.ts'
  },
  target: 'node',
  node: {
    __filename: false,
    __dirname: false
  },
  output: {
    path: path.join(__dirname, 'server'),
    filename: '[name].js'
  },
  externals: nodeModules,
  resolve: {
    extensions: ['', '.ts', '.js', '.json']
  },
  module: {
    preLoaders: [
      { test: /\.ts$/, loader: "tslint-loader", exclude: [/node_modules/] }
    ],
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.(ttf|eot|svg|woff(2)?).*$/, loader: "file-loader?name=fonts/[name].[ext]" }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/package.json' }
    ])
  ]
};
