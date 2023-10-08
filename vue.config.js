const path = require("path");
const webpack = require("webpack");

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}

module.exports = {
  // outputDir: "dist",
  publicPath: "",
  lintOnSave: false,

  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        src: resolveSrc("src"),
      },
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 10,
      }),
    ],
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        vendorStyles: {
          name: "vendor",
          test(module) {
            return (
              /node_modules/.test(module.context) &&
              !/\.css$/.test(module.request)
            );
          },
          chunks: "all",
          enforce: true,
        },
      },
    });
  },

  // pwa: {
  //   name: "Vue Light Bootstrap Dashboard",
  //   themeColor: "#344675",
  //   msTileColor: "#344675",
  //   appleMobileWebAppCapable: "yes",
  //   appleMobileWebAppStatusBarStyle: "#344675",
  // },

  css: {
    // sourceMap: process.env.NODE_ENV !== "production",
    // loaderOptions: {
    //   scss: {
    //     additionalData: `
    //       @import "@/assets/sass/light-bootstrap-dashboard.scss";
    //     `,
    //   },
    // },
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};
