module.exports = {
  entry: {
    main: "./edit.js", // Entry point of your main script
  },
  output: {
    filename: "bundle.js", // Name of the output bundled script
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
