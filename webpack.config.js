const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const prodPrefix = "/mu"
const isNodeModules = /[\\/]node_modules[\\/]/;

const common = {
    entry: path.resolve(__dirname, "./src/index.tsx"),
	module: {
		rules: [
            {
                test: /\.tsx$/,
                use: require.resolve("ts-loader"),
                exclude: isNodeModules,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
        ],
    },
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
    resolve: {
		extensions: [
			".tsx",
			".ts",
			".js",
		],
        plugins: [
            new TsconfigPathsPlugin(),
        ],
    },
};

const prod = {
    stats: "errors-warnings",
    output: {
        clean: true,
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].[contenthash].js",
        publicPath: prodPrefix+"/",
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: isNodeModules,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            PATH_PREFIX: JSON.stringify(prodPrefix),
        }),
    ],
};

const dev = {
    stats: "errors-only",
    devServer: {
        port: 9000,
        compress: true,
        static: {
            directory: path.resolve(__dirname, "./public"),
        },
        client: {
            overlay: false,
            reconnect: false,
            logging: "error",
        },
    },
};

module.exports = (env, args) => {
    switch(args.mode) {
    case "production":
        return merge(common, prod);
    case "development":
        return merge(common, dev);
    default:
        throw new Error("No matching config.");
    }
};