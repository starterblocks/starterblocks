<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'StarterBlocks' ) ) {

	class StarterBlocks {

		protected $api_base_url = 'http://starterblocks.io/wp-json/restapi/v2/';
		protected $starterblocks_api_request_body;
		protected $starterblocks_api_request_body_default;

		protected $option_keyword = 'starterblocks_global_options';

		/**
		 * STARTERBLOCKS constructor
		 */
		public function __construct() {
			$this->starterblocks_api_request_body_default = array(
				'request_from'                  => 'starterblocks',
				'request_starterblocks_version' => STARTERBLOCKS_VERSION,
			);
			$this->starterblocks_api_request_body         = apply_filters( 'starterblocks_api_request_body', array() );

			// Editor Load
			add_action( 'enqueue_block_editor_assets', array( $this, 'starterblocks_editor_assets' ) );
			// Admin Load
			add_action( 'admin_enqueue_scripts', array( $this, 'starterblocks_admin_assets' ) );
		}

		/**
		 * Load Editor Styles and Scripts
		 *
		 * @since 1.0.0
		 */
		public function starterblocks_editor_assets() {

			wp_enqueue_script(
				'starterblocks-js',
				plugins_url( 'assets/js/starterblocks.dev.js', STARTERBLOCKS_FILE ),
				array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
				STARTERBLOCKS_VERSION,
				true
			);

			// Backend editor scripts: common vendor files.
			wp_enqueue_script(
				'starterblocks-js-vendor',
				plugins_url( 'assets/js/vendor.dev.js', STARTERBLOCKS_FILE ),
				array(),
				STARTERBLOCKS_VERSION
			);

			wp_localize_script(
				'starterblocks-js',
				'starterblocks',
				array(
					'i18n'              => 'starterblocks',
					'plugin'            => STARTERBLOCKS_DIR_URL,
					'mokama'            => starterblocks_fs()->can_use_premium_code(),
					'icon'              => file_get_contents( STARTERBLOCKS_DIR_URL . 'assets/img/logo.svg' ),
					'version'           => STARTERBLOCKS_VERSION,
					'supported_plugins' => STARTERBLOCKS_Supported_Plugins::get_plugins(),
				)
			);

		}

		/**
		 * Load SvgShapes
		 *
		 * @since 1.0.0
		 */
		public function getSvgDivider() {
			$divider_path = STARTERBLOCKS_DIR_PATH . 'assets/divider';
			$dividers     = glob( $divider_path . '/*.svg' );
			$dividerArray = array();
			if ( count( $dividers ) ) {
				foreach ( $dividers as $divider ) {
					$dividerArray[ str_replace(
						array( '.svg', $divider_path . '/' ), '', $divider
					) ] = file_get_contents(
						$divider
					);
				}
			}

			return $dividerArray;
		}

		/**
		 * Admin Style & Script
		 *
		 * @since 1.0.0
		 */
		public function starterblocks_admin_assets() {

			wp_enqueue_style(
				'starterblocks-bundle', STARTERBLOCKS_DIR_URL . 'assets/css/admin.min.css', false, STARTERBLOCKS_VERSION
			);


		}
	}

	new StarterBlocks();
}
