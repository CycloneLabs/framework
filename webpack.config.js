var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var oakwood = require('./index.js');

var nsbuilder = oakwood.nsbuilder;

var IS_PRODUCTION = ~process.argv.indexOf('-p'); // production mode started with -p argument
var assetName = IS_PRODUCTION ? 'oakwood.min.css' : 'oakwood.css';
var oakwoodModulesConfig = IS_PRODUCTION ? '' : '$models: (all: true, debug: true);';


module.exports = {
  entry: './oakwood.scss',

  output: {
    filename: "oakwood.js",
    path: './compiled',
  },

  resolve: {
    modulesDirectories: ['node_modules'],
  },

  plugins: [
    new ExtractTextPlugin(assetName, { allChunks: true }),
  ],

  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.scss|sass$/,
        loader: ExtractTextPlugin.extract(['css?sourceMap!postcss!sass?sourceMap']),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?limit=10000&minetype=application/font-woff&name=fonts/[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?name=images/[name].[ext]',
        ],
      },
    ],
  },

  postcss:  [ autoprefixer, nsbuilder ],
  sassLoader: {
    includePaths: [__dirname + '/node_modules'],
    data: oakwoodModulesConfig,
  },
};
