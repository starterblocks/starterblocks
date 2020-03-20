<?php

namespace StarterBlocks;
use StarterBlocks;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class API {

    protected $api_base_url = 'https://us-east4-starterblocks.cloudfunctions.net/';
    protected $default_request_headers = array();

    /**
     * Constructor
     */
    public function __construct() {

        $this->starterblocks_api_request_body_default = array(
            'request_from'    => 'starterblocks',
            'request_version' => STARTERBLOCKS_VERSION,
            'mokama'          => starterblocks_fs()->can_use_premium_code(),
        );
        $this->starterblocks_api_request_body         = apply_filters( 'starterblocks_api_request_body', array() );


        add_action( 'starterblocks_api_request_headers', array( $this, 'request_verify' ) );
        add_action( 'rest_api_init', array( $this, 'register_api_hooks' ), 0 );
    }

    /**
     * @since 1.0.0
     * Get library index. Support for library, collections, pages, sections all in a single request.
     *
     * @param     WP_REST_Request     $request
     */
    public function get_index( \WP_REST_Request $request ) {

        $parameters = $request->get_params();

        if ( isset( $request->get_attributes()['args']['route'] ) && ! empty(
            $request->get_attributes()['args']['route']
            ) ) {
            $type = str_replace( '/', '', $request->get_attributes()['args']['route'] );
        }

        if ( empty( $type ) ) {
            wp_send_json_error( 'No type specified.' );
        }
        $data = array();
        if ( ! isset( $parameters['no_cache'] ) ) {
            $data = get_transient( 'starterblocks_get_library_' . $type );
        }
//			$data = array();

        if ( empty( $data ) ) {

            $config = array(
                'path'    => 'library/' . (string) sanitize_text_field( $type ),
                'headers' => array(
                    'SB-User-Agent' => (string) sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] )
                ),
            );

            $data = $this->api_request( $config );
            if ( empty( $data ) ) {
                wp_send_json_error( array( 'error' => $data ) );
            }

//				$data = json_decode(
//					file_get_contents(
//						$path
//					), true
//				);
            $blocks = array(
                'sections' => array(),
                'pages'    => array()
            );
            foreach ( $data['sections'] as $k => $section ) {

//                    $section['blocks']['kioken'] =$section['blocks']['qubely'];
//                    $section['source'] = 'kioken';
//                    unset($section['blocks']['qubely']);

//                    $data['sections'][$k] = $section;

//                    print_r($section);
//                    exit();

                foreach ( array_keys( $section['blocks'] ) as $key ) {
                    if ( ! isset( $blocks['sections'][ $key ] ) ) {
                        $blocks['sections'][ $key ] = 0;
                    }
                    $blocks['sections'][ $key ] ++;
                }
            }
            foreach ( $data['pages'] as $section ) {
                foreach ( array_keys( $section['blocks'] ) as $key ) {
                    if ( ! isset( $blocks['pages'][ $key ] ) ) {
                        $blocks['pages'][ $key ] = 0;
                    }
                    $blocks['pages'][ $key ] ++;
                }
            }
            $data['dependencies'] = $blocks;
            set_transient( 'starterblocks_get_library_' . $type, $data, DAY_IN_SECONDS );
        }

        if ( isset( $parameters['no_cache'] ) ) {
            $data['cache'] = "cleared";
        }

        wp_send_json_success( $data );
    }

    /**
     * @since 1.0.0
     * Method for transmitting a template the user is sharing remotely.
     *
     * @param     WP_REST_Request     $request
     */
    public function share_template( \WP_REST_Request $request ) {
        $parameters = $request->get_params();

        if ( empty( $parameters ) ) {
            wp_send_json_error( 'No template data found.' );
        }

        $data = array(
            'url'    => get_site_url(),
            'params' => $parameters
        );

        $key = md5( get_site_url() ) . md5( $parameters['postID'] );

        $url = "https://share.starterblocks.io/share/" . $key;

        wp_send_json_success( array( $url ) );
    }

    public function api_request( $data ) {
        $apiUrl = $this->api_base_url . $data['path'];

        if ( isset( $data['_locale'] ) ) {
            unset( $data['_locale'] );
        }
        $headers = array();
        if ( isset( $data['headers'] ) ) {
            $headers = $data['headers'];
            unset( $data['headers'] );
        }
        if ( isset( $data['p'] ) ) {
            $headers['SB-P'] = $data['p'];
            unset( $data['p'] );
        }
        if ( isset( $data['path'] ) ) {
            $headers['SB-Path'] = $data['path'];
            unset( $data['path'] );
        }

        $headers = wp_parse_args( $headers, $this->default_request_headers );

        $headers['Content-Type'] = 'application/json; charset=utf-8';

        $post_args = array(
            'timeout'     => 120,
            'body'        => json_encode( $data ),
            'method'      => 'POST',
            'data_format' => 'body',
            'redirection' => 5,
            'headers'     => $headers
        );

        $request = wp_remote_post(
            $apiUrl,
            $post_args
        );
        if ( is_wp_error( $request ) ) {
            wp_send_json_error( array( 'messages' => $request->get_error_messages() ) );
        }

        $blockData = json_decode( $request['body'], true );

        if ( $blockData['status'] == "error" ) {
            wp_send_json_error( array( 'message' => $blockData['message'] ) );
        }

        unset( $blockData['status'] );

        return $blockData;
    }

    /**
     * @since 1.0.0
     * Fetch a single template.
     *
     * @param     WP_REST_Request     $request
     */
    public function get_template( \WP_REST_Request $request ) {

        $data = $request->get_params();

        $config = array(
            'path'      => 'template',
            'id'        => (int) sanitize_text_field( $data['id'] ),
            'type'      => (string) sanitize_text_field( $data['type'] ),
            'source_id' => sanitize_text_field( $data['sid'] ),
            'source'    => isset( $_REQUEST['source'] ) ? (int) $_REQUEST['source'] : '',
            'headers'   => array(
                'SB-User-Agent' => (string) sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] )
            ),
        );

        $response = get_transient( 'starterblocks_get_template_' . $config['id'] );

//			print_r($response);
//			echo PHP_EOL;


//            $path = trailingslashit(
//                        dirname( __FILE__ )
//                    )  . 'kioken.json';
//            $response = json_decode(file_get_contents($path), true);

        if ( empty( $response ) ) {

            // TODO - Put cached copy timestamp in headers

            $config = wp_parse_args( $data, $config );

            $response = $this->api_request( $config );
            if ( empty( $response ) ) {
                wp_send_json_error( array( 'error' => $response ) );
            }

            set_transient( 'starterblocks_get_template_' . $config['id'], $response, DAY_IN_SECONDS );
        }

        wp_send_json_success( $response );

    }

    public function request_verify( $data ) {
        $config = array(
            'SB-Version'   => STARTERBLOCKS_VERSION,
            'SB-Pro'       => starterblocks_fs()->can_use_premium_code(),
            'SB-Multisite' => is_multisite(),
        );
        $data   = wp_parse_args( $data, $config );

        return $data;
    }


    /**
     * @since 1.0.0
     * Get all saved blocks (reusable blocks).
     */
    public function get_saved_blocks( \WP_REST_Request $request ) {
        $args      = array(
            'post_type'   => 'wp_block',
            'post_status' => 'publish'
        );
        $r         = wp_parse_args( null, $args );
        $get_posts = new WP_Query;
        $wp_blocks = $get_posts->query( $r );
        wp_send_json_success( $wp_blocks );
    }

    /**
     * @since 1.0.0
     * Delete a single saved (reusable) block
     */
    public function delete_saved_block( \WP_REST_Request $request ) {
        $block_id      = (int) sanitize_text_field( $_REQUEST['block_id'] );
        $deleted_block = wp_delete_post( $block_id );

        wp_send_json_success( $deleted_block );
    }

    /**
     * @since 1.0.0
     * Method used to register all rest endpoint hooks.
     * starterblocks api routes
     */
    public function register_api_hooks() {

        $hooks = array(
            '/library/'            => array(
                'callback' => 'get_index'
            ),
            '/pages/'              => array(
                'callback' => 'get_index'
            ),
            '/sections/'           => array(
                'callback' => 'get_index'
            ),
            '/collections/'        => array(
                'callback' => 'get_index'
            ),
            '/template/'           => array(
                'callback' => 'get_template'
            ),
            '/share/'              => array(
                'method'   => 'POST',
                'callback' => 'share_template'
            ),
            '/get_saved_blocks/'   => array(
                'callback' => 'get_saved_blocks'
            ),
            '/delete_saved_block/' => array(
                'method'   => 'POST',
                'callback' => 'delete_saved_block'
            ),

            '/plugin-install/' => array(
                'method'   => 'GET',
                'callback' => 'plugin_install'
            ),
        );

        foreach ( $hooks as $route => $data ) {
            $data['method'] = isset( $data['method'] ) ? $data['method'] : 'GET';

            register_rest_route(
                'starterblocks/v1',
                $route,
                array(
                    array(
                        'methods'  => $data['method'],
                        'callback' => array( $this, $data['callback'] ),
// 							 TODO - Re-enable permission requirements for safety
//							'permission_callback' => function () {
//								return current_user_can( 'edit_posts' );
//							},
                        'args'     => array(
                            'route' => $route
                        )
                    )
                )
            );
        }

    }

    public function plugin_install( \WP_REST_Request $request ) {
        $data = $request->get_params();
        if ( empty( $data['slug'] ) ) {
            wp_send_json_error(
                array(
                    'error' => 'Slug not specified.'
                )
            );
        }

        $slug = (string) sanitize_text_field( $data['slug'] );
        $status = StarterBlocks\Installer::run( $slug );
        if ( isset( $status['error'] ) ) {
            wp_send_json_error( $status );
        }
        wp_send_json_success( $status );
    }

}
