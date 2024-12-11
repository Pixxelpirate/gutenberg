<?php
/**
 * Temporary compatibility shims for Core Ajax handlers.
 *
 * @package gutenberg
 */

/**
 * Handles renewing the REST API nonce via AJAX.
 *
 * @since 5.3.0
 * @since 6.8.0 Returns error when session token is missing.
 */
function gutenberg_ajax_rest_nonce() {
	$token = wp_get_session_token();
	if ( empty( $token ) ) {
		wp_send_json_error( null, rest_authorization_required_code() );
	}

	exit( wp_create_nonce( 'wp_rest' ) );
}
add_action( 'wp_ajax_rest-nonce', 'gutenberg_ajax_rest_nonce', 0 );
