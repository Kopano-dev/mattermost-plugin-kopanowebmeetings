/* eslint-env node */
/* eslint func-names: ["off", "as-needed"] */
/* eslint-disable no-process-env */

const fs = require('fs');
const path = require('path');
const BannerPlugin = require('webpack').BannerPlugin;
const DefinePlugin = require('webpack').DefinePlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const VisualizerPlugin = require('webpack-visualizer-plugin');
const buildVersion = process.env.BUILD_VERSION || '0.0.0-no-proper-build';
const buildDate = process.env.BUILD_DATE || new Date();

module.exports = function(env) {
	const isProd = Boolean(env && env.prod);

	const config = {
		mode: isProd ? 'production' : 'development',
		context: path.resolve(__dirname),
		entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'kopanowebmeetings_bundle.js',
		},
		externals: {
			react: 'React',
			redux: 'Redux',
			'react-redux': 'ReactRedux',
			'react-bootstrap': 'ReactBootstrap',
			'prop-types': 'PropTypes',
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)?$/,
					exclude: [
						/node_modules/,
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
						{
							loader: 'eslint-loader',
							options: {
								configFile: isProd ? '../../.eslintrc.prod.json' : '../../.eslintrc.json',
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
				path.resolve(__dirname) + '/src',
			],
			extensions: ['.js', '.jsx'],
		},
		plugins: [
			new VisualizerPlugin(),
		],
	};

	if (isProd) {
		config.devtool = 'hidden-source-map';
		config.plugins.push.apply(config.plugins, [
			new UglifyJsPlugin({
				sourceMap: true,
				uglifyOptions: {
					ecma: 6,
				},
			}),
		]);
	} else {
		config.devtool = 'inline-source-map';
	}

	config.plugins.push.apply(config.plugins, [
		new LicenseWebpackPlugin({
			pattern: /^(MIT|ISC|BSD.*)$/,
			unacceptablePattern: /GPL/,
			abortOnUnacceptableLicense: true,
			perChunkOutput: false,
			outputFilename: '3rdparty-licenses.txt',
		}),
		new DefinePlugin({
			__VERSION__: JSON.stringify(buildVersion),
		}),
		new BannerPlugin(
			fs.readFileSync(path.resolve(__dirname, '../../..', 'LICENSE.txt')).toString() +
				'\n\n@version ' + buildVersion + ' (' + buildDate + ')' + (isProd ? '' : ' dev')
		),
	]);

	return config;
};
