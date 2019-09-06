const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => ({
  devtool: env.dev ? 'inline-source-map' : 'source-map',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Reactive Space Game',
      template: './src/index.html'
    })
  ],
  watch: env.dev
});