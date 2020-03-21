<?php

namespace StarterBlocks;


if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
require_once( ABSPATH . 'wp-admin/includes/file.php' );
require_once( ABSPATH . 'wp-admin/includes/misc.php' );
require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

class InstallerMuter extends WP_Upgrader_Skin {
    public function feedback( $string, ...$args ) { /* no output */ }
}
