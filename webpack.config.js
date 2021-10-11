const path = require('path');
const WebpackAutoInject = require('webpack-auto-inject-version');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    entry:{
		main: "./src/MainApp.ts",
	},
	output:{
		path: __dirname + "/public/",
		filename: '[name].js'
	},

	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", '.css'],
		alias: {
		},
	},
	

	module:{
		// Test file extension to run loader
		rules: [
			{
				test: /\.(glsl|vs|fs)$/, 
				loader: "ts-shader-loader"
			},
			{
				test: /\.tsx?$/, 
				exclude: [/node_modules/, /tsOld/],
				loader: "ts-loader"
			},
			{
				test: /\.css$/,
      			loader: 'style-loader!css-loader'
			  },
			  {
				test: /\.(png|svg|jpg|gif)$/,
				use: [
				  'url-loader',
				],
			  },
			  {
                test: /\.(glb|gltf)$/,
                use:
                [
                    {
                        loader: 'url-loader',
                        
                    }
                ]
            },
			  
		]
	},

	devServer: {
		host: 'localhost',
		port: 8000,
		contentBase: "./public/",
		disableHostCheck: true,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
    },
	devtool: 'eval-source-map',
	plugins: [
		// new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			title: 'test',
		  }),
		new WebpackAutoInject(),
    ]
}