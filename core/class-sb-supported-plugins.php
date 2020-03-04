<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'StarterBlocks_Supported_Plugins' ) ) {

	class StarterBlocks_Supported_Plugins {

		protected static $plugins = array();

		/**
		 * STARTERBLOCKS_plugins constructor
		 */
		public function __construct() {

			self::set_plugins();
			self::detect_versions();

			self::detect_stackable();
			self::detect_qubely();
			self::detect_coblocks();
			self::detect_kioken();
		}

		private static function detect_versions() {
			$all_plugins    = get_plugins();
			$active_plugins = get_option( 'active_plugins' );

			$data = array();
			foreach ( $active_plugins as $plugin ) {
				$slug          = explode( '/', $plugin )[0];
				$data[ $slug ] = $all_plugins[ $plugin ];
			}

			foreach ( self::$plugins as $key => $plugin ) {
				$selector = false;
				if ( isset( $data[ $key ] ) ) {
					$selector = $key;
				} else {
					if ( isset( $plugin['slug'] ) && isset( $data[ $plugin['slug'] ] ) ) {
						$selector = $plugin['slug'];
					}
				}
				if ( $selector ) {
					self::$plugins[ $key ]['version'] = $data[ $selector ]['Version'];
				}

			}


//		print_r(self::$plugins);
//		exit();


		}

		private static function set_plugins() {
			self::$plugins = array(
				'advgb'                      => array(
					'name' => 'Advanced Gutenberg',
					'url'  => 'https://www.joomunited.com/wordpress-products/advanced-gutenberg',
				),
				'advanced-gutenberg-blocks'  => array(
					'name' => 'Advanced Gutenberg Blocks',
					'url'  => 'https://advanced-gutenberg-blocks.com/',
				),
				'atomic-blocks'              => array(
					'name' => 'Atomic Blocks',
					'url'  => 'https://atomicblocks.com/',
				),
				'coblocks'                   => array(
					'name' => 'CoBlocks',
					'url'  => 'https://coblocks.com/',
				),
				'cpblocks'                   => array(
					'name'    => 'CP Blocks',
					'url'     => 'https://services.dwbooster.com/pricing',
					'has_pro' => true
				),
				'essential-blocks'           => array(
					'name' => 'Essential Blocks',
					'url'  => 'https://essential-blocks.com/',
				),
				'essential-gutenberg-blocks' => array(
					'name' => 'Easy Blocks',
					'url'  => 'https://jeweltheme.com/shop/easy-gutenberg-blocks/',
					'slug' => 'easy-gutenberg-blocks'
				),
				'getwid'                     => array(
					'name' => 'Getwid',
					'url'  => 'https://motopress.com/products/getwid/',
				),
				'guteblock'                  => array(
					'name' => 'Guteblock',
				),
				'gutenbee'                   => array(
					'name' => 'Gutenbee',
					'url'  => 'https://www.cssigniter.com/plugins/gutenbee/',
				),
				'kadence'                    => array(
					'name'    => 'Kadence Blocks',
					'url'     => 'https://www.kadencewp.com/product/kadence-gutenberg-blocks/',
					'has_pro' => true,
				),
				'kioken'                     => array(
					'name'    => 'Kioken Blocks',
					'url'     => 'https://kiokengutenberg.com/',
					'has_pro' => true,
					'slug'    => 'kioken-blocks'
				),
				'premium'                    => array(
					'name' => 'Premium Blocks',
					'url'  => 'https://premiumblocks.io/',
				),
				'qubely'                     => array(
					'name'         => 'Qubely',
					'url'          => 'https://www.themeum.com/qubely-pricing/',
					'has_pro'      => true,
					'premium_slug' => 'qubely-pro',
				),
				'qubely-pro'                 => array(
					'name'   => 'Qubely Pro',
					'url'    => 'https://www.themeum.com/qubely-pricing/',
					'is_pro' => true,
				),
				'qodeblock'                  => array(
					'name'    => 'Quodeblocks',
					'url'     => 'https://qodeblock.com/',
					'has_pro' => true,
				),
				'snow-monkey-blocks'         => array(
					'name' => 'Snow Monkey Blocks',
				),
				'ugb'                        => array(
					'name'         => 'Stackable',
					'url'          => 'https://wpstackable.com/premium/#pricing-table',
					'has_pro'      => true,
					'slug'         => 'stackable-ultimate-gutenberg-blocks',
					'premium_slug' => 'stackable-ultimate-gutenberg-blocks-premium',
				),
				'uagb'                       => array(
					'name' => 'Ultimate Addons Blocks',
					'url'  => 'https://github.com/brainstormforce/ultimate-addons-for-gutenberg',
				),
				'ub'                         => array(
					'name' => 'Ultimate Blocks',
					'url'  => 'https://ultimateblocks.com/',
				),
				'themeisle-blocks'           => array(
					'name' => 'Gutenberg Blocks and Template Library by Otter',
					'url'  => 'https://themeisle.com/plugins/otter-blocks'
				),

			);
		}

		public static function get_plugins() {
			return self::$plugins;
		}

		private static function detect_stackable() {
			if ( defined( 'STACKABLE_VERSION' ) ) {
				$slug                              = "ugb";
				self::$plugins[ $slug ]['version'] = STACKABLE_VERSION;
				self::$plugins[ $slug ]['is_pro']  = function_exists( 'sugb_fs' ) && sugb_fs()->can_use_premium_code(
				) ? true : false;
			}
		}

		private static function detect_qubely() {
			if ( defined( 'QUBELY_VERSION' ) || defined( 'QUBELY_PRO_VERSION' ) ) {
				$slug                              = "qubely";
				self::$plugins[ $slug ]['version'] = defined(
					'QUBELY_PRO_VERSION'
				) ? QUBELY_PRO_VERSION : QUBELY_VERSION;
				if ( defined( 'QUBELY_PRO_VERSION' ) ) {
					self::$plugins[ $slug ]['is_pro'] = true;
				}

			}
		}

		private static function detect_coblocks() {
			if ( defined( 'COBLOCKS_VERSION' ) ) {
				$slug                              = "coblocks";
				self::$plugins[ $slug ]['version'] = COBLOCKS_VERSION;
			}
		}

		private static function detect_kioken() {
			if ( defined( 'KK_BLOCKS_VERSION' ) ) {
				$slug                              = "kioken";
				self::$plugins[ $slug ]['version'] = KK_BLOCKS_VERSION;
				self::$plugins[ $slug ]['is_pro']  = function_exists( 'kkb_fs' ) && kkb_fs()->can_use_premium_code(
				) ? true : false;
			}
		}
	}

	function starterblocks_companion_plugins_detect() {
		new StarterBlocks_Supported_Plugins();
	}

	add_action( 'plugins_loaded', 'starterblocks_companion_plugins_detect', 999 );
}