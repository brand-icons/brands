const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// Export a function instead of an object so
// we can access the `mode` argument.
// https://webpack.js.org/configuration/mode/
module.exports = (env, argv) => {
	const DEV = argv.mode === 'development';

	return {
		target: 'web',
		performance: {
			hints: false
		},
		entry: {
			brands: path.resolve(__dirname, 'src/index.js'),
			icons: path.resolve(__dirname, 'src/icons.js')
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: DEV ? '[name].js' : '[name].min.js',
			libraryTarget: 'umd',
			library: 'brands',
			// Prevents webpack from referencing `window` in the UMD build
			// Source: https://git.io/vppgU
			globalObject: 'typeof self !== \'undefined\' ? self : this'
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}
			]
		},
		optimization: {
			minimize: !DEV,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							warnings: false
						},
						output: {
							comments: false
						}
					},
					extractComments: false
				})
			]
		},
		plugins: [
			!DEV &&
				new webpack.HashedModuleIdsPlugin()
		].filter(Boolean)
	};
};
