const path = require("path");
const common = require("./webpack.common");
const { merge } = require('webpack-merge');
var HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = merge(common,{
    mode: "development",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"dist"),
        assetModuleFilename: "images/[name].[hash][ext]",
        chunkFilename: '[id].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                use: 'json-loader',
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules|\.d\.ts$/, // this line as well
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            noEmit: false, // this option will solve the issue
                        },
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset/resource",
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        template: './src/template.html.ejs',
        hash: true,
    })],
});
