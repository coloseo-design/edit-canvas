/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
// webpackage.config.js
const { resolve } = require;
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  new CleanWebpackPlugin(),
];

if (process.env.NODE_ENV !== 'production') {
  plugins.unshift(
    new HtmlWebPackPlugin({
    template: 'public/index.html',
    filename: 'index.html',
    inject: true,
  }));
}

const output = process.env.NODE_ENV !== 'production' ? {
  path: path.join(__dirname, './dist'),
  publicPath: './',
  filename: '[name]-[hash].js',
} : {
  path: path.join(__dirname, './dist'),
  publicPath: './src/',
  filename: 'index.js',
  // library: { // webpack5的写法
  //   name: 'canvas',
  //   type: 'umd',
  // }
  library: 'canvas',
  libraryTarget: 'umd',
}

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, './index.js'),
    publicPath: '/',
    host: '127.0.0.1',
    port: 3005,
  },
  entry: process.env.NODE_ENV !== 'production' ? './index.js' : './src/index.ts',
  output,
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|mp4)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
              name: 'static/[name].[hash:8].[ext]',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  resolve('@babel/plugin-transform-typescript'),
                  {
                    isTSX: true,
                  },
                ],
                resolve('babel-plugin-inline-import-data-uri'),
                resolve('@babel/plugin-transform-member-expression-literals'),
                resolve('@babel/plugin-transform-object-assign'),
                resolve('@babel/plugin-transform-property-literals'),
                [
                  resolve('@babel/plugin-transform-runtime'),
                  {
                    helpers: false,
                  },
                ],
                resolve('@babel/plugin-transform-spread'),
                resolve('@babel/plugin-transform-template-literals'),
                resolve('@babel/plugin-proposal-export-default-from'),
                resolve('@babel/plugin-proposal-export-namespace-from'),
                resolve('@babel/plugin-proposal-object-rest-spread'),
                [
                  resolve('@babel/plugin-proposal-decorators'),
                  {
                    legacy: true,
                  },
                ],
                resolve('@babel/plugin-proposal-class-properties'),
              ],
              presets: [
                '@babel/preset-env',
                [
                  '@babel/preset-react',
                  {
                    // modules,
                    targets: {
                      browsers: [
                        'last 2 versions',
                        'Firefox ESR',
                        '> 1%',
                        'ie >= 9',
                        'iOS >= 8',
                        'Android >= 4',
                      ],
                    },
                  },
                ],
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
    ],
  },
  plugins,
};
