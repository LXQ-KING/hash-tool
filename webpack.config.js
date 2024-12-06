const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
module.exports = {
  name: 'default',
  mode: 'production',
  entry: './src/main.js',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [new CopyWebpackPlugin({
    patterns: [{
      from: path.resolve(__dirname, 'src'),
      to: path.resolve(__dirname, 'dist')
    }]
  }), new CssMinimizerPlugin(), new HtmlMinimizerPlugin(), new TerserWebpackPlugin({
    extractComments: false
  })]
}