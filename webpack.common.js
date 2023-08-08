const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    entry: "./src/index.tsx",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "imgs"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
