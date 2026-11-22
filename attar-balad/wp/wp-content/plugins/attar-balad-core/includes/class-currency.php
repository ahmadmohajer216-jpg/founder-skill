<?php
/**
 * واحد پول: تومان (IRT) روی ووکامرس.
 *
 * @package attar-balad-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ثبت تومان در فهرست ارزهای ووکامرس.
 */
class AB_Currency {

	/**
	 * اتصال قلاب‌ها.
	 *
	 * @return void
	 */
	public static function init() {
		add_filter( 'woocommerce_currencies', array( __CLASS__, 'add_toman' ) );
		add_filter( 'woocommerce_currency_symbol', array( __CLASS__, 'symbol' ), 10, 2 );
	}

	/**
	 * افزودن IRT اگر ووکامرس آن را ندارد.
	 *
	 * @param array<string, string> $currencies ارزها.
	 * @return array<string, string>
	 */
	public static function add_toman( $currencies ) {
		if ( ! isset( $currencies['IRT'] ) ) {
			$currencies['IRT'] = 'تومان ایران (IRT)';
		}
		return $currencies;
	}

	/**
	 * نماد فارسی تومان.
	 *
	 * @param string $symbol   نماد پیش‌فرض.
	 * @param string $currency کد ارز.
	 * @return string
	 */
	public static function symbol( $symbol, $currency ) {
		if ( 'IRT' === $currency ) {
			return 'تومان';
		}
		return $symbol;
	}
}
