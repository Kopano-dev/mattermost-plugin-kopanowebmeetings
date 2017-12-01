const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'build/kopanowebmeetings_bundle.js'
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
                            name: 'files/[hash].[ext]'
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
};
