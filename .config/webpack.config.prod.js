const externals = require('./externals')
const rules = require('./rules')
const path = require('path')
const plugins = require('./plugins')

module.exports = [{

	mode: 'production',

	devtool: 'hidden-source-map',

	entry: [
		path.join(__dirname, 'src/assets/js/index.js')
	],

	output: {
		filename: '[name].js',
		library: '[name]',  // it assigns this module to the global (window) object
	},

	// Permit importing @wordpress/* packages.
	externals,

	resolve: {
		alias: {
			'~starterblocks': path.resolve(__dirname, '../src/')
		}
	},

	// Optimize output bundle.
	optimization: {
		minimize: true,
		noEmitOnErrors: true,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "editor_vendor",
					priority: 10,
					enforce: true
				}
			}
		},
	},

	module: {
		strictExportPresence: true,
		rules,
	},

	plugins,
}]
