var webpack = require("webpack");
var autoprefixer = require("autoprefixer");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        all: [
            "./src/js/Web.jsx"
        ],
        vendor: [
            "core-js",
            "react",
            "react-dom",
            "apollo-client",
            "graphql-tag",
            "react-apollo",
            "draft-js",
            "react-router"
        ]
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
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    devtool: "eval",
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new ExtractTextPlugin("[name].css")
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}