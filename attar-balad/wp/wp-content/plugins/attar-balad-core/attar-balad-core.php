<?php
/**
 * Plugin Name: عطار بلد — هسته
 * Plugin URI: https://attar-balad.example
 * Description: منطق کسب‌وکار عطار بلد، جدا از قالب: شناسنامهٔ گیاه (جدول اختصاصی)، واحد پول تومان و ایمپورت کاتالوگ از دادهٔ فاز ۳.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.0
 * Author: Attar Balad
 * Text Domain: attar-balad
 *
 * @package attar-balad-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AB_CORE_VERSION', '0.1.0' );
define( 'AB_CORE_PATH', plugin_dir_path( __FILE__ ) );

require_once AB_CORE_PATH . 'includes/class-plants.php';
require_once AB_CORE_PATH . 'includes/class-currency.php';
require_once AB_CORE_PATH . 'includes/class-import.php';

register_activation_hook( __FILE__, array( 'AB_Plants', 'activate' ) );

AB_Plants::init();
AB_Currency::init();
AB_Import::init();
