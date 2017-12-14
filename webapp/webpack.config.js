/* eslint-disable */
const path = require('path');

module.exports = function(env) {
	const isProd = !!(env && env.prod);

	return {
		context: path.resolve(__dirname),
		entry: './index.js',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'kopanowebmeetings_bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)?$/,
					exclude: /(node_modules|non_npm_dependencies)/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									'react',
									['es2015', {modules: false}],
									'stage-0'
								],
								plugins: ['transform-runtime'],
								cacheDirectory: true
							}
						},
						{
							loader: 'eslint-loader',
							options: {
								configFile: isProd ? '.eslintrc.prod.json' : '.eslintrc.json'
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: "style-loader"
						},
						{
							loader: "css-loader"
						}
					]
				},
				{
					test: /\.(png|eot|tiff|svg|woff2|woff|ttf|gif|mp3|jpg)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'static/[hash].[ext]',
								publicPath: '/plugins/kopanowebmeetings/'
							}
						},
						{
							loader: 'image-webpack-loader',
							options: {}
						}
					]
				}
			]
		},
		resolve: {
			modules: [
				'node_modules',
				'non_npm_dependencies',
				path.resolve(__dirname)
			],
			extensions: ['.js', '.jsx']
		}
	}
};
/* eslint-enable */
