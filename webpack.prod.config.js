var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");

module.exports = {
    entry: {
        web: ["./src/js/Web.jsx"],
        vendor: ["core-js", "react", "react-dom", "draft-js", "apollo-client", "react-apollo", "graphql-tag", "redux", "validatorjs"]
    },
    output: {
        path: "./build",
        publicPath: "/mod/pleio_template/build/",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }
        ]

    },
    devtool: "source-map",
    postcss: [ autoprefixer({ browsers: ["last 2 versions"] }) ],
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ],
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}
