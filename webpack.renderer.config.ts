import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import autoprefixer from "autoprefixer";

rules.push({
  test: /\.(scss)$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      // Loader for webpack to process CSS with PostCSS
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            autoprefixer
          ]
        }
      }
    },
    {
      // Loads a SASS/SCSS file and compiles it to CSS
      loader: 'sass-loader',
      options: {
        sassOptions: {
          // Optional: Silence Sass deprecation warnings. See note below.
          silenceDeprecations: [
            'color-functions',
            'global-builtin',
            'import',
            'if-function',
          ]
        }
      }
    }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
