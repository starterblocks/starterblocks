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

        add_filter( 'starterblocks_api_headers', array( $this, 'request_verify' ) );
        $this->default_request_headers = apply_filters( 'starterblocks_api_headers', $this->default_request_headers );

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
        $attributes = $request->get_attributes();

        if ( isset( $attributes['args']['route'] ) && ! empty( $attributes['args']['route'] ) ) {
            $type = str_replace( '/', '', $attributes['args']['route'] );
        }

        if ( empty( $type ) ) {
            wp_send_json_error( 'No type specified.' );
        }
        $data = array();
        if ( ! isset( $parameters['no_cache'] ) ) {
            $data = get_transient( 'starterblocks_get_library_' . $type );
        }

//        $data = array();
        if ( empty( $data ) ) {
            $config = array(
                'path'    => 'library/',
                'headers' => array(
                    'SB-User-Agent' => (string) sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] )
                ),
            );
            if ( isset( $parameters['registered_blocks'] ) ) {
                $config['headers']['SB-Registered-Blocks'] = implode( ",", $parameters['registered_blocks'] );
            }

            $data = $this->api_request( $config );
            $data = json_decode( $data, true );

            if ( $data['status'] == "error" ) {
                wp_send_json_error( array( 'message' => $data['message'] ) );
            }

            unset( $data['status'] );

            if ( empty( $data ) ) {
                wp_send_json_error( array( 'error' => $data ) );
            }
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
            'timeout'     => 90,
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
//        print_r($request);

        # Handle redirects
        if (
            ! is_wp_error( $request )
            && isset( $request['http_response'] )
            && $request['http_response'] instanceof \WP_HTTP_Requests_Response
            && method_exists( $request['http_response'], 'get_response_object' )
            && strpos( $request['http_response']->get_response_object()->url, 'files.starterblocks.io' ) !== false
        ) {
            $request = wp_remote_get(
                $request['http_response']->get_response_object()->url,
                array( 'timeout' => 90 )
            );
        }

        if ( is_wp_error( $request ) ) {
            wp_send_json_error( array( 'messages' => $request->get_error_messages() ) );
        }


        return $request['body'];
    }

    /**
     * @since 1.0.0
     * Fetch a single template.
     *
     * @param     WP_REST_Request     $request
     */
    public function get_template( \WP_REST_Request $request ) {

        $parameters = $request->get_params();
        $attributes = $request->get_attributes();

        if ( in_array( $parameters['type'], [ 'sections', 'pages' ] ) ) {
            $parameters['type'] = substr_replace( $parameters['type'], "", - 1 );
        }

        $config = array(
            'path'    => 'template',
            'id'      => sanitize_text_field( $parameters['id'] ),
            'type'    => (string) sanitize_text_field( $parameters['type'] ),
            'source'  => isset( $parameters['source'] ) ? $parameters['source'] : '',
            'headers' => array(
                'SB-User-Agent' => (string) sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] )
            ),
        );
        if ( isset( $parameters['registered_blocks'] ) ) {
            $config['headers']['SB-Registered-Blocks'] = implode( ",", $parameters['registered_blocks'] );
        }
//        print_r($parameters);

        $response = get_transient( 'starterblocks_get_template_' . $config['id'] );
//        $response = array();  // TODO - Remove me
        if ( empty( $response ) ) {

            // TODO - Put cached copy timestamp in headers
            $config = wp_parse_args( $parameters, $config );

            $response = $this->api_request( $config );
//            print_r( $response );
            if ( empty( $response ) ) {
                wp_send_json_error( array( 'error' => $response ) );
            }
            $test = ltrim( $response );
            if ( ! empty( $test ) and $test[0] == "{" ) {
                $response = json_decode( $response, true );
            } else {
                $response = array( 'template' => $response );
            }

            set_transient( 'starterblocks_get_template_' . $config['id'], $response, DAY_IN_SECONDS );
        }

        wp_send_json_success( $response );
    }

    public function request_verify( $data ) {
        $config = array(
            'SB-Version'   => STARTERBLOCKS_VERSION,
            'SB-Multisite' => is_multisite(),
        );
        if ( starterblocks_fs()->can_use_premium_code() ) {
            $config['SB-Pro'] = starterblocks_fs()->can_use_premium_code();
        }
        $data = wp_parse_args( $data, $config );

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
            $methods = [ 'GET', 'POST' ];
            if ( isset( $data['method'] ) ) {
                $methods = explode( ',', $data['method'] );
            }

            foreach ( $methods as $method ) {
                register_rest_route(
                    'starterblocks/v1',
                    $route,
                    array(
                        array(
                            'methods'  => $method,
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

        $slug   = (string) sanitize_text_field( $data['slug'] );
        $status = StarterBlocks\Installer::run( $slug );
        if ( isset( $status['error'] ) ) {
            wp_send_json_error( $status );
        }
        wp_send_json_success( $status );
    }

}
