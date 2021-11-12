//Webpack requires this to work with directories
const path = require("path");

// This is main configuration object that tells Webpackw what to do.
module.exports = {
	//path to entry paint
	entry: "",

	entry: {
		partyEditor: "./src/js/partyEditor.js",
	},

	//path and filename of the final output
	output: {
		path: path.resolve(__dirname, "public/js"),
		filename: "[name].js",
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},

	//default mode is production
	mode: "development",

	devtool: "source-map",
};
