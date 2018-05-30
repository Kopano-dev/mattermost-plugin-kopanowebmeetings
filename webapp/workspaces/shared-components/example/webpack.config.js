/* eslint-env node */
/* eslint func-names: ["off", "as-needed"] */
/* eslint-disable no-process-env */

const path = require('path');

module.exports = function(env) {
	const isProd = Boolean(process.env && process.env.NODE_ENV === 'production');

	const config = {
		mode: isProd ? 'production' : 'development',
		context: path.resolve(__dirname),
		entry: './index.jsx',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'example-bundle.js',
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)?$/,
					exclude: [
						// Note(Ronald): Because we import the source files from the
						// shared components we must transpile the files of the
						// shared components, hence the strange exclude.
						/node_modules(?!\/mattermost-plugin-kopanowebmeetings\/webapp\/workspaces\/shared-components)/,
					],
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									'react',
									['env', {modules: false}],
									['stage-0'],
								],
								plugins: ['transform-runtime'],
								cacheDirectory: true,
							},
						},
					],
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
						},
					],
				},
				{
					test: /\.(png|eot|tiff|svg|woff2|woff|ttf|gif|mp3|jpg)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'static/[hash].[ext]',
								publicPath: '/plugins/kopanowebmeetings/',
							},
						},
						{
							loader: 'image-webpack-loader',
							options: {},
						},
					],
				},
			],
		},
		resolve: {
			modules: [
				'node_modules',
			],
			extensions: ['.js', '.jsx'],
		},
	};

	return config;
};
