import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/i,
  use: [
    { loader: 'style-loader' }, 
    { loader: 'css-loader' },
    { loader: 'postcss-loader' }
  ],
});

const isDev = process.env.NODE_ENV !== 'production';

console.log("Renderer process config ", isDev);

export const rendererConfig: Configuration = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false, // ou 'source-map' se quiser em prod
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
