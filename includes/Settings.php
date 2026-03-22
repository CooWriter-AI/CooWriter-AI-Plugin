<?php

namespace CooWriterAI;

use CooWriterAI\Traits\Singleton;

use const CooWriterAI\PLUGIN_FILE;

const SETTINGS_KEY = 'coowriter-ai';

const API_SECTION   = 'coowriter-ai-api-section';
const API_KEY_FIELD = 'coowriter-ai-api-key';

/**
 * Class Settings
 * Handles the plugin settings page and related functionality.
 */
class Settings {

	use Singleton;

	protected function __construct() {
		add_action( 'admin_menu', array( $this, 'register_settings_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		add_filter( 'plugin_action_links_' . plugin_basename( PLUGIN_FILE ), array( $this, 'add_settings_link' ) );
	}

	public function register_settings_menu() {
		add_menu_page(
			esc_html__( 'CooWriter AI Settings', 'coowriter-ai' ),
			esc_html__( 'CooWriter AI', 'coowriter-ai' ),
			'manage_options',
			SETTINGS_KEY,
			array( $this, 'settings_page' ),
			plugins_url( '/assets/icon.svg', PLUGIN_FILE ),
		);
	}

	public function settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		?>
		<form method="post" action="options.php" >
			<?php settings_fields( SETTINGS_KEY ); ?>
			<div id="coowriter-ai-settings-root" class="coowriter-ai-tw"></div>
		</form>
		<?php
	}

	public function register_settings() {
		register_setting(
			SETTINGS_KEY,
			API_KEY_FIELD,
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		add_settings_section(
			API_SECTION,
			'',
			'__return_empty_string',
			SETTINGS_KEY
		);

		add_settings_field(
			API_KEY_FIELD,
			'CooWriter AI API Key',
			'__return_empty_string',
			SETTINGS_KEY,
			API_SECTION
		);
	}

	public function add_settings_link( $links ) {
		$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=coowriter-ai' ) ) . '">' . esc_html__( 'Settings', 'coowriter-ai' ) . '</a>';
		array_unshift( $links, $settings_link );
		return $links;
	}

	public function enqueue_assets() {
		if ( ! $this->should_load_assets() ) {
			return;
		}

		$is_runtime_file_exists = file_exists( PLUGIN_DIR . '/build/runtime.asset.php' );

		if ( $is_runtime_file_exists ) {
			$runtime_asset_file = include PLUGIN_DIR . '/build/runtime.asset.php';

			if ( empty( $runtime_asset_file ) ) {
				return;
			}

			wp_enqueue_script(
				'coowriter-ai-runtime',
				plugins_url( 'build/runtime.js', __DIR__ ),
				$runtime_asset_file['dependencies'],
				$runtime_asset_file['version'],
				true
			);
		}

		$asset_file = include PLUGIN_DIR . '/build/settings.asset.php';

		wp_enqueue_script(
			'coowriter-ai-settings',
			plugins_url( 'build/settings.js', __DIR__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			array(
				'in_footer' => true,
			)
		);

		$api_key = get_option( API_KEY_FIELD, '' );

		wp_localize_script(
			'coowriter-ai-settings',
			'cooWriterAISettingsConfig',
			array(
				'apiKeyFieldName'   => API_KEY_FIELD,
				'hasApiKey'         => ! empty( $api_key ),
				'isSettingsUpdated' => filter_input( INPUT_GET, 'settings-updated', FILTER_VALIDATE_BOOLEAN ),
				'profileURL'        => API_URL . '/profile',
			)
		);

		wp_localize_script(
			'coowriter-ai-settings',
			'cooWriterAIApiConfig',
			array(
				'ajaxURL' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( ACTION_NAME ),
				'action'  => ACTION_NAME,
			)
		);

		wp_enqueue_style(
			'coowriter-ai-settings-styles',
			plugins_url( 'build/settings.css', __DIR__ ),
			array(),
			$asset_file['version']
		);
	}

	private function should_load_assets() {
		return is_admin() && current_user_can( 'edit_posts' ) && get_current_screen()->id === 'toplevel_page_coowriter-ai';
	}
}
