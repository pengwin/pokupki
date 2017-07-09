const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/client/index.tsx",
        login: "./src/client/login.ts"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, "/build/client/")
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.tsx?$/, loader: 'ts-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "moment": "moment"
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: 'public',
                from: '**/*',
            },
            {
                from: 'node_modules/react/dist/react.js',
                to: 'lib/react.js'
            },
            {		             
                 from: 'node_modules/react-dom/dist/react-dom.js',
                 to: 'lib/react-dom.js'
            },
            {
                from: 'node_modules/moment/moment.js',
                to: 'lib/moment.js'
            },
            {
                from: 'node_modules/moment/locale/ru.js',
                to: 'lib/moment-ru.js'
            }
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            template: 'public/index.html',
            hash: true
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            chunks: ['login'],
            template: 'public/login.html',
            hash: true
        })
    ]
};