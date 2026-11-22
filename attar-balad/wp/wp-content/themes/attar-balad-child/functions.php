<?php
/**
 * عطار بلد — قالب فرزند
 *
 * دیزاین سیستم فاز ۲ (tokens.css / components.css) را به وردپرس و ووکامرس وصل می‌کند.
 * هیچ مقدار رنگی اینجا نوشته نمی‌شود؛ همه از توکن‌های CSS می‌آید.
 *
 * @package attar-balad
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * صف‌بندی توکن‌ها، اجزا و نگاشت قالب به ترتیب.
 */
function ab_child_enqueue_assets() {
	$dir  = get_stylesheet_directory();
	$uri  = get_stylesheet_directory_uri();
	$list = array( 'tokens', 'components', 'theme' );

	foreach ( $list as $handle ) {
		$path = $dir . '/assets/css/' . $handle . '.css';
		if ( ! file_exists( $path ) ) {
			continue;
		}
		wp_enqueue_style(
			'ab-' . $handle,
			$uri . '/assets/css/' . $handle . '.css',
			array(),
			(string) filemtime( $path )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'ab_child_enqueue_assets', 20 );

/**
 * پیش‌بارگذاری فونت‌های self-host (بدون CDN).
 */
function ab_child_preload_fonts() {
	$uri   = get_stylesheet_directory_uri();
	$fonts = array(
		'Vazirmatn-Regular.woff2',
		'Vazirmatn-Bold.woff2',
		'Estedad-Bold.woff2',
	);

	foreach ( $fonts as $font ) {
		printf(
			'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
			esc_url( $uri . '/assets/fonts/' . $font )
		);
	}
}
add_action( 'wp_head', 'ab_child_preload_fonts', 1 );

/**
 * جزیرهٔ سه‌بعدی (فاز ۵): وب‌کامپوننت <attar-3d-viewer>، بدون وابستگی خارجی.
 */
function ab_child_enqueue_viewer3d() {
	$path = get_stylesheet_directory() . '/assets/js/viewer3d.js';
	if ( ! file_exists( $path ) ) {
		return;
	}
	wp_enqueue_script(
		'ab-viewer3d',
		get_stylesheet_directory_uri() . '/assets/js/viewer3d.js',
		array(),
		(string) filemtime( $path ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'ab_child_enqueue_viewer3d', 21 );

/**
 * فاوآیکن برند.
 */
function ab_child_favicon() {
	$path = get_stylesheet_directory() . '/assets/brand/favicon.svg';
	if ( ! file_exists( $path ) ) {
		return;
	}
	printf(
		'<link rel="icon" href="%s" type="image/svg+xml">' . "\n",
		esc_url( get_stylesheet_directory_uri() . '/assets/brand/favicon.svg' )
	);
}
add_action( 'wp_head', 'ab_child_favicon', 2 );

/**
 * پشتیبانی ووکامرس و گالری محصول.
 */
function ab_child_setup() {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'ab_child_setup' );

/**
 * کلاس بدنهٔ دیزاین سیستم.
 */
function ab_child_body_class( $classes ) {
	$classes[] = 'ab-body';
	return $classes;
}
add_filter( 'body_class', 'ab_child_body_class' );

/**
 * تعداد ستون‌های شبکهٔ محصول در فروشگاه.
 */
add_filter(
	'loop_shop_columns',
	function () {
		return 4;
	}
);

/**
 * تعداد محصول در هر صفحهٔ فروشگاه.
 */
add_filter(
	'loop_shop_per_page',
	function () {
		return 12;
	}
);
