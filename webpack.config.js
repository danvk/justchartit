const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.tsx',
  },
  devtool: '#cheap-module-source-map',
  output: {
    path: __dirname + '/static',
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  plugins: [
    // The Monaco text editor uses the AMD loader and can't be browserified.
    // Instead, we have to copy its pre-built artifacts into the static directory.
    new CopyWebpackPlugin([{
      from: 'node_modules/monaco-editor/min/vs',
      to: 'vs',
    }, {
      from: 'node_modules/handsontable/dist',
      to: 'handsontable',
    }, {
      from: 'node_modules/dygraphs/dist/*min*',
      to: 'dygraphs',
      flatten: true,
    }, {
      from: 'typings/globals/dygraphs/index.d.ts',
      to: 'dygraphs/dygraphs.d.ts',
    }]),
  ],
};
