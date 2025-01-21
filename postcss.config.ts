module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nested"),
    require("autoprefixer"),
    require("postcss-media-minmax"),
    require("postcss-sort-media-queries")({
      sort: "desktop-first",
    }),
    require("postcss-combine-media-query"),
    ...(process.env.NODE_ENV === "production" ? [require("cssnano")] : []),
  ],
};
