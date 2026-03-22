<?php
/**
 * Plugin Name: CooWriter AI
 * Description: AI-powered writing assistant for WordPress Block Editor.
 * Author:      CooWriter AI
 * Author URI:  https://profiles.wordpress.org/coowriterai
 * License:     GPL-3.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Version:     1.0.0
 * Text Domain: coowriter-ai
 *
 * @package     CooWriterAI
 */

namespace CooWriterAI;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/vendor/autoload.php';

if ( ! defined( 'COOWRITER_AI_API_URL' ) ) {
	define( 'COOWRITER_AI_API_URL', 'https://coowriterai.com' );
}

const API_URL     = COOWRITER_AI_API_URL;
const PLUGIN_DIR  = __DIR__;
const PLUGIN_FILE = __FILE__;

Settings::get_instance();
Assistant::get_instance();
APIProxy::get_instance();
BlockEditor::get_instance();
Imagen::get_instance();
