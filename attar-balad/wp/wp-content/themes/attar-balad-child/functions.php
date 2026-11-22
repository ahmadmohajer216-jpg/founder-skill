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
