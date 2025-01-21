const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NotifierPlugin = require("webpack-notifier");
const StylelintPlugin = require("stylelint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/script.ts",
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      path: path.resolve(__dirname, "build"),
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@modules": path.resolve(__dirname, "src/ts"),
        "@styles": path.resolve(__dirname, "src/css"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
            "resolve-url-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|png|jpg|jpeg|gif|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][hash][ext][query]",
          },
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
            output: { comments: false },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
        ...(isProduction
          ? [
              new ImageMinimizerPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                minimizer: {
                  implementation: ImageMinimizerPlugin.imageminMinify,
                  options: {
                    plugins: [
                      ["optipng", { optimizationLevel: 5 }],
                      ["jpegtran", { progressive: true }],
                      ["svgo", { plugins: [{ removeViewBox: false }] }],
                    ],
                  },
                },
              }),
            ]
          : []),
      ],
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    devServer: {
      static: { directory: path.join(__dirname, "build") },
      historyApiFallback: true,
      hot: true,
      open: true,
      port: 3000,
      client: {
        logging: "info",
        overlay: true,
        progress: true,
      },
      devMiddleware: {
        writeToDisk: isProduction,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(argv.mode),
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        minify: isProduction
          ? { removeComments: true, collapseWhitespace: true }
          : false,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "[name].[contenthash].css" : "[name].css",
      }),
      new CaseSensitivePathsPlugin(),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
      }),
      new Dotenv(),
      new ESLintPlugin({
        extensions: ["js", "jsx", "ts", "tsx"],
        failOnError: false,
        failOnWarning: false,
        fix: true,
      }),
      new NotifierPlugin(),
      new StylelintPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      ...(isProduction
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: false,
            }),
          ]
        : []),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
      },
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
            output: { comments: false },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
  };
};
