var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");
var path = require("path");

module.exports = {
    entry: {
        web: [
            "./src/js/Web.jsx"
        ],
        admin: [
            "./src/js/Admin.jsx"
        ]
    },
    output: {
        path: path.join(__dirname, "build"),
        publicPath: "/mod/pleio_template/build/",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: ["css-loader", "postcss-loader"]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: ["css-loader", "postcss-loader", "less-loader"]
                })
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: "file-loader"
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [ autoprefixer({ browsers: ["last 2 versions"] }) ]
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ],
    resolve: {
        extensions: [".js", ".jsx"]
    }
}
