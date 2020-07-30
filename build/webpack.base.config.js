const PATHS = require('./globals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    login: `${PATHS.pre_js}/login.js`,
    main: `${PATHS.pre_js}/main.js`
  },
  output: {
    path: `${PATHS.dist}/`,
    publicPath: '/',
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: []
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/img`,
          to: `${PATHS.dist}/public/img`
        },
        {
          from: `${PATHS.src}/server/back`,
          to: `${PATHS.serv}/back_js`
        }
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'public/html/about_us.html',
      template: `${PATHS.pre}/about_us.ejs`,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: 'public/html/login.html',
      template: `${PATHS.pre}/login.ejs`,
      chunks: ['main', 'login']
    }),
    new HtmlWebpackPlugin({
      filename: 'public/html/main.html',
      template: `${PATHS.pre}/main.ejs`,
      chunks: ['main']
    }),
    new FaviconsWebpackPlugin(`${PATHS.src}/img/favicon.png`)

  ],

}