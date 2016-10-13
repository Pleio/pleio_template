module.exports = {
    entry: {
        all: ["./src/js/Web.jsx"]
    },
    output: {
        path: "./build",
        pathInfo: true,
        publicPath: "/mod/pleio_template/build",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react'
            }
        ]
    },
    devtool: "eval",
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
