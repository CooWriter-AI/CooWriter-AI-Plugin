<?php

namespace CooWriterAI;

use CooWriterAI\Traits\Singleton;

use const CooWriterAI\API_URL;
use const CooWriterAI\API_KEY_FIELD;

const ACTION_NAME = 'coowriter_ai_api';

const ALLOWED_PATHS = array(
	'/api/v1/app-subscription',
	'/api/v1/generation',
	'/api/v1/generation/image',
);

const ALLOWED_METHODS = array(
	'GET',
	'POST',
);

/**
 * Class APIProxy
 * Handles AJAX requests from the block editor and proxies them to the CooWriter AI API.
 */
class APIProxy {

	use Singleton;

	protected function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_coowriter_ai_api', array( $this, 'api_ajax_handler' ) );
	}

	public function enqueue_scripts() {
		wp_localize_script(
			'coowriter-ai-assistant',
			'cooWriterAIApiConfig',
			array(
				'ajaxURL' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( ACTION_NAME ),
				'action'  => ACTION_NAME,
			)
		);
	}

	public function api_ajax_handler() {
		check_ajax_referer( ACTION_NAME, 'nonce' );

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json(
				array(
					'error' => __( 'You are not authorized to access this API', 'coowriter-ai' ),
				),
				403
			);
			return;
		}

		$path = sanitize_url( wp_unslash( $_POST['path'] ?? '' ) );

		if ( ! in_array( $path, ALLOWED_PATHS ) ) {
			wp_send_json(
				array(
					'error' => __( 'Invalid path', 'coowriter-ai' ),
				),
				400
			);
			return;
		}

		$method = sanitize_text_field( wp_unslash( $_POST['method'] ?? 'GET' ) );

		if ( ! in_array( $method, ALLOWED_METHODS ) ) {
			wp_send_json(
				array(
					'error' => __( 'Invalid method', 'coowriter-ai' ),
				),
				400
			);
			return;
		}

		$body = wp_kses( wp_unslash( $_POST['body'] ?? '' ), array( 'strong', 'em', 'a', 'br', 'sup', 'sub' ) );

		if ( $body ) {
			$body = json_decode( $body, true );
			$body = wp_json_encode( $body );
		}

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			wp_send_json(
				array(
					'error' => __( 'Invalid JSON in response body', 'coowriter-ai' ),
				),
				500
			);
			return;
		}

		$api_key = get_option( API_KEY_FIELD );

		if ( ! $api_key ) {
			wp_send_json(
				array(
					'error' => __( 'API key not configured', 'coowriter-ai' ),
				),
				500
			);
			return;
		}

		$args = array(
			'headers' => array(
				'Content-Type' => 'application/json',
				'x-api-key'    => $api_key,
			),
			'method'  => $method,
			'timeout' => 120, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
		);

		if ( $body ) {
			$args['body'] = $body;
		}

		$response = wp_remote_request(
			API_URL . $path,
			$args
		);

		if ( is_wp_error( $response ) ) {
			wp_send_json(
				array(
					'error' => $response->get_error_message(),
				),
				500
			);
			return;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// Decode the API response.
		$decoded_response = json_decode( $response_body, true );

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			wp_send_json(
				array(
					'error' => __( 'Invalid JSON in response body', 'coowriter-ai' ),
				),
				500
			);
			return;
		}

		wp_send_json( $decoded_response, $response_code );
	}
}
