
// Modes.
const MODE_DEV = "development";
const MODE_PROD = "production";

// Node.
const path = require("path");
const { execSync } = require("child_process");

// Webpack.
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { merge } = require("webpack-merge");
const webpack = require("webpack");

// Paths.
const prodPrefix = "" // If not empty should start with slash (e.g. "/path").
const isNodeModules = /[\\/]node_modules[\\/]/;
const contentSrc = "src/content";
const contentDst = "public/content";
const contentImport = "../../public/content/";
const contentName = "import.tsx"; // Name of generated .tsx file.
const m2hName = "run.exe";
const m2hDir = path.resolve(__dirname, "tool/md2html");
const m2hExe = path.resolve(__dirname, m2hDir, m2hName);

const common = {
    entry: {
        main: path.resolve(__dirname, "src/index.tsx"),
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: require.resolve("ts-loader"),
                exclude: [
                    isNodeModules,
                ],
            },
            {
                test: /\.html$/,
                type: 'asset/resource',
                include: [
                    path.resolve(__dirname, "public/content"),
                ],
                generator: {
                    filename: 'static/content/[name].[contenthash][ext]',
                },
            },
            {
                test: /\.otf$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/font/[name].[contenthash][ext]',
                },
            },
            {
                test: /\.md/,
                type: 'asset/source',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: "public/favicon.ico",
            template: "public/index.html",
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
        path: path.resolve(__dirname, "dist"),
        filename: "static/js/[name].[contenthash].js",
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
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
        ],
    },
    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.compile.tap("RenderMarkdown", () => {
                    buildAndRunMd2Html(MODE_PROD);
                });
            },
        },
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].css",
        }),
    ],
};

const dev = {
    stats: "errors-only",
    watchOptions: {
        ignored: [
            "**/node_modules",
        ],
    },
    devServer: {
        port: 9000,
        compress: true,
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, "public"),
        },
        client: {
            overlay: false,
            reconnect: false,
            logging: "error",
        },
    },
    module: {
        rules: [
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
        {
            apply: (compiler) => {
                compiler.hooks.compile.tap("RenderMarkdown", () => {
                    buildAndRunMd2Html(MODE_DEV);
                });
            },
        },
    ],
};

function buildAndRunMd2Html(mode) {
    
    // Build executable.
    let c = `(cd ${m2hDir} && go build -o ${m2hName})`;
    let stdout = execSync(c);
    if (stdout) process.stdout.write(stdout);
    
    // Run executable.
    c = `` +
    `${m2hExe} ` +
    `${contentSrc} ` +
    `${contentDst} ` +
    `${contentImport} ` +
    `${contentName} ` +
    `${mode}`;
    stdout = execSync(c);
    if (stdout) process.stdout.write(stdout);
}

module.exports = (env, args) => {
    let prefix = "";
    if (env.prefix && typeof env.prefix === "string") {
        prefix = "/" + env.prefix;
    }
    const prefixConfig = {
        output: {
            publicPath: prefix + "/",
        },
        plugins: [
            new webpack.DefinePlugin({
                PATH_PREFIX: JSON.stringify(prefix),
            }),
        ]
    };
    switch(args.mode) {
        case MODE_PROD:
        return merge(common, prod, prefixConfig);
        case MODE_DEV:
        return merge(common, dev, prefixConfig);
        default:
        throw new Error("No matching config.");
    }
};