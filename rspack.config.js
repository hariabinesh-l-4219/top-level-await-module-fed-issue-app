import HtmlWebpackPlugin from 'html-webpack-plugin';
import mfConfig from './module-federation.config.js';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

/**
 * @type {import('@rspack/cli').Configuration}
 **/
const webpackConfig = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: 'dist',
    },
    hot: true,
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin(mfConfig),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      app2RemoteEntry: getRemoteEntryUrl(3002),
    }),
  ],
};

export default webpackConfig;

function getRemoteEntryUrl(port) {
  const { CODESANDBOX_SSE, HOSTNAME = '' } = process.env;

  // Check if the example is running on codesandbox
  // https://codesandbox.io/docs/environment
  if (!CODESANDBOX_SSE) {
    return `//localhost:${port}/remoteEntry.js`;
  }

  const parts = HOSTNAME.split('-');
  const codesandboxId = parts[parts.length - 1];

  return `//${codesandboxId}-${port}.sse.codesandbox.io/remoteEntry.js`;
}
