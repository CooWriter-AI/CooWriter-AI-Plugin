<?php

namespace CooWriterAI;

use CooWriterAI\Traits\Singleton;

use const CooWriterAI\PLUGIN_DIR;

/**
 * Class Imagen
 * Handles the enqueueing of assets for the AI image generation in the block editor.
 */
class Imagen {
	use Singleton;

	protected function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ) );
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

		$asset_file = include PLUGIN_DIR . '/build/imagen.asset.php';

		wp_enqueue_script(
			'coowriter-ai-imagen',
			plugins_url( 'build/imagen.js', __DIR__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			array(
				'in_footer' => true,
			)
		);

		wp_enqueue_style(
			'coowriter-ai-imagen',
			plugins_url( 'build/imagen.css', __DIR__ ),
			array(),
			$asset_file['version']
		);
	}

	private function should_load_assets() {
		return is_admin() && current_user_can( 'edit_posts' ) && get_current_screen()->is_block_editor();
	}
}
