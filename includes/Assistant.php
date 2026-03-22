<?php

namespace CooWriterAI;

use CooWriterAI\Traits\Singleton;

use const CooWriterAI\PLUGIN_DIR;

/**
 * Class Assistant
 * Handles the enqueueing of assets for the AI assistant in the block editor.
 */
class Assistant {
	use Singleton;

	protected function __construct() {
		// Add react root in the footer for block edtior admin screen only.
		add_action( 'admin_footer', array( $this, 'add_react_root' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function add_react_root() {
		if ( ! $this->should_load_assets() ) {
			return;
		}

		echo '<div id="coowriter-ai-assistant-root" class="coowriter-ai-tw"></div>';
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

		$asset_file = include PLUGIN_DIR . '/build/assistant.asset.php';

		wp_enqueue_script(
			'coowriter-ai-assistant',
			plugins_url( 'build/assistant.js', __DIR__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			array(
				'in_footer' => true,
			)
		);

		wp_enqueue_style(
			'coowriter-ai-styles',
			plugins_url( 'build/assistant.css', __DIR__ ),
			array(),
			$asset_file['version']
		);
	}

	private function should_load_assets() {
		return is_admin() && current_user_can( 'edit_posts' ) && get_current_screen()->is_block_editor();
	}
}
