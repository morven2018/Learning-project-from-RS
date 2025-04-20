const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 4200,
    hot: true,
    open: true,
    client: { overlay: false },
  },
  stats: {
    children: true,
    errorDetails: true,
  },
};
