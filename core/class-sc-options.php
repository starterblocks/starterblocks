<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'StarterBlock_Options' ) ) {

	class StarterBlock_Options {
		// Constructor
		public function __construct() {
			add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
			//			add_action( "network_admin_menu", array( $this, 'add_admin_menu' ) );
			add_action( 'admin_init', array( $this, 'register_settings' ) );
//			add_action('admin_print_scripts', array($this,'remove_admin_notices'));
		}

		function remove_admin_notices() {
			global $wp_filter;
			unset($wp_filter['admin_notices']);
		}

		/**
		 * Add Menu Page Callback
		 *
		 * @since 1.0.0
		 */
		public function add_admin_menu() {
			add_menu_page(
				esc_html__( 'StarterBlocks', 'starterblocks' ),
				esc_html__( 'StarterBlocks', 'starterblocks' ),
				'manage_options',
				'starterblocks',
				array( $this, 'create_admin_page' ),
				'data:image/svg+xml;base64,' . base64_encode(
					file_get_contents( STARTERBLOCKS_DIR_PATH . 'assets/img/logo.svg' )
				)
			);
		}

		/**
		 * Register a setting and its sanitization callback.
		 *
		 * @since 1.0.0
		 */
		public function register_settings() {
			register_setting( 'starterblocks_options', 'starterblocks_options', array( $this, 'sanitize' ) );
		}

		/**
		 * Sanitization callback
		 *
		 * @since 1.0.0
		 */
		public function sanitize( $options ) {
			if ( $options ) {
				if ( ! empty( $options['css_save_as'] ) ) {
					$options['css_save_as'] = sanitize_text_field( $options['css_save_as'] );
				}
			}

			return $options;
		}

		/**
		 * Settings page output
		 *
		 * @since 1.0.0
		 */
		public function create_admin_page() { ?>
            <div class="wrap">
                <div style="overflow: hidden;height:1px;"><h3></h3></div>

                <div class="starterblocks-options-section starterblocks-mt-20 starterblocks-mb-30"
                     style="background-image: url(<?php echo STARTERBLOCKS_DIR_URL . 'assets/img/logo.svg' ?>)">
                    <div class="starterblocks-options-section-header">
                        <div class="starterblocks-header-left">
                            <h3 class="starterblocks-options-section-title"><?php esc_attr_e(
									'Welcome to StarterBlocks! - Version ', 'starterblocks'
								);
								echo STARTERBLOCKS_VERSION; ?></h3>
                        </div>
                    </div>
                </div>
            </div>
		<?php }
	}

	new StarterBlock_Options();
}
