const externals = require( './externals' )
const rules = require( './rules' )
const plugins = require( './plugins' )
const path = require( 'path' )

module.exports = [ {

	mode: 'development',

	devtool: 'cheap-module-source-map',

	entry: [
		path.join(__dirname, '../src/index.js')
	],

	output: {
		path: path.join(__dirname, '../assets/js'),
		filename: '[name].dev.js',
		library: '[name]', // assigns this module to the global (window) object
	},

	// Permit importing @wordpress/* packages.
	externals,

	optimization: {
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

	resolve: {
		alias: {
			'~starterblocks': path.resolve( __dirname, '../src/' )
		}
	},

	// Clean up build output
	stats: {
		all: false,
		assets: true,
		colors: true,
		errors: true,
		performance: true,
		timings: true,
		warnings: true,
	},

	module: {
		strictExportPresence: true,
		rules,
	},

	plugins,
} ]
