var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");
var path = require("path");

module.exports = {
    entry: {
        web: [
            "react-hot-loader/patch",
            "webpack-dev-server/client?http://localhost:9001",
            "webpack/hot/only-dev-server",
            "./src/js/Web.jsx"
        ],
        admin: [
            "./src/js/Admin.jsx"
        ]
    },
    output: {
        path: path.join(__dirname, "build"),
        publicPath: "http://localhost:9001/mod/pleio_template/build/",
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
    devServer: {
        publicPath: "http://localhost:9001/mod/pleio_template/build/",
        hot: true,
        port: 9001,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    devtool: "cheap-eval-source-map",
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [ autoprefixer({ browsers: ["last 2 versions"] }) ]
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
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
