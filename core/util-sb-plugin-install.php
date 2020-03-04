<?php

require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
require_once( ABSPATH . 'wp-admin/includes/file.php' );
require_once( ABSPATH . 'wp-admin/includes/misc.php' );
require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

if ( ! class_exists( 'StarterBlocksPlugin_Installer_Skin' ) ) {
	# Helper class to hide feedback for WP plugin installs.
	class StarterBlocksPlugin_Installer_Skin extends WP_Upgrader_Skin {
		public function feedback( $string, ...$args ) { /* no output */ }
	}
}
if ( ! function_exists( 'starterblocks_plugin_install' ) ) {
	function starterblocks_plugin_install( $slug ) {
		$pluginDir = WP_PLUGIN_DIR . '/' . $slug;
		/*
		 * Don't try installing plugins that already exist (wastes time downloading files that
		 * won't be used
		 */
		$status = array();
		if ( ! is_dir( $pluginDir ) ) {


			$api = plugins_api(
				'plugin_information',
				array(
					'slug'   => $slug,
					'fields' => array(
						'short_description' => false,
						'sections'          => false,
						'requires'          => false,
						'rating'            => false,
						'ratings'           => false,
						'downloaded'        => false,
						'last_updated'      => false,
						'added'             => false,
						'tags'              => false,
						'compatibility'     => false,
						'homepage'          => false,
						'donate_link'       => false,
					),
				)
			);

			ob_start();

			$skin     = new StarterBlocksPlugin_Installer_Skin( array( 'api' => $api ) );
			$upgrader = new Plugin_Upgrader( $skin );
			$install  = $upgrader->install( $api->download_link );

			ob_end_clean();

			if ( $install !== true ) {
				ob_start();
				var_dump( $install );
				$result             = ob_get_clean();
				$status['error']    = 'Install process failed for: ' . $slug . '.';
				$status['var_dump'] = $result;

				return $status;
			}
			$status['install'] = "success";
		}

		/*
		 * The install results don't indicate what the main plugin file is, so we just try to
		 * activate based on the slug. It may fail, in which case the plugin will have to be activated
		 * manually from the admin screen.
		 */
		$pluginPath  = false;
		$pluginCheck = false;
		if ( file_exists( $pluginDir . '/' . $slug . '.php' ) ) {
			$pluginPath  = $pluginDir . '/' . $slug . '.php';
			$pluginCheck = $slug . '/' . $slug . '.php';
		} elseif ( file_exists( $pluginDir . '/plugin.php' ) ) {
			$pluginPath  = $pluginDir . '/' . $slug . '.php';
			$pluginCheck = $slug . '/plugin.php';
		}

		if ( ! empty( $pluginPath ) ) {
			if ( is_plugin_active( $pluginCheck ) && ! isset( $status['install'] ) ) {
				$status['activate'] = "active";
			} else {
				activate_plugin( $pluginCheck );
				$status['activate'] = "success";
			}
		} else {
			$status['error'] = "Error: Plugin file not activated (" . $slug . "). The plugin file could not be found.";
		}

		return $status;
	}
}