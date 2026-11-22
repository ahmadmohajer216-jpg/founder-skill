<?php
/**
 * شناسنامهٔ گیاه — دادهٔ تخصصی هر محصول در جدول اختصاصی، نه به‌جای ووکامرس.
 *
 * @package attar-balad-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * جدول و فیلدهای شناسنامهٔ گیاه.
 */
class AB_Plants {

	/**
	 * فیلدهای قابل ویرایش با برچسب فارسی.
	 *
	 * @var array<string, string>
	 */
	const FIELDS = array(
		'botanical_name'       => 'نام علمی',
		'origin'               => 'خاستگاه',
		'plant_part'           => 'بخش مصرفی',
		'usage_instructions'   => 'روش مصرف',
		'storage_instructions' => 'شرایط نگهداری',
		'warnings'             => 'هشدارها',
		'source_ref'           => 'منبع ادعاهای سلامتی',
	);

	/**
	 * نام جدول با پیشوند نصب.
	 *
	 * @return string
	 */
	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'ab_plants';
	}

	/**
	 * ساخت جدول در فعال‌سازی افزونه.
	 *
	 * @return void
	 */
	public static function activate() {
		global $wpdb;

		$table   = self::table();
		$charset = $wpdb->get_charset_collate();
		$sql     = "CREATE TABLE {$table} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			product_id BIGINT UNSIGNED NOT NULL,
			botanical_name VARCHAR(150) NOT NULL DEFAULT '',
			description TEXT NULL,
			origin VARCHAR(150) NULL,
			plant_part VARCHAR(100) NULL,
			usage_instructions TEXT NULL,
			storage_instructions TEXT NULL,
			warnings TEXT NULL,
			source_ref VARCHAR(255) NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY uniq_product (product_id),
			KEY idx_botanical (botanical_name)
		) {$charset};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * اتصال قلاب‌ها.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'add_meta_boxes_product', array( __CLASS__, 'add_meta_box' ) );
		add_action( 'save_post_product', array( __CLASS__, 'save_from_post' ), 10, 2 );
		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'render_front' ), 25 );
	}

	/**
	 * خواندن شناسنامهٔ یک محصول.
	 *
	 * @param int $product_id شناسهٔ محصول.
	 * @return array<string, string>|null
	 */
	public static function get( $product_id ) {
		global $wpdb;

		$row = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * FROM ' . self::table() . ' WHERE product_id = %d', $product_id ),
			ARRAY_A
		);

		return $row ? $row : null;
	}

	/**
	 * ذخیرهٔ شناسنامه (ایمپورت و فرم مدیر از همین راه می‌نویسند).
	 *
	 * @param int                  $product_id شناسهٔ محصول.
	 * @param array<string, mixed> $data       فیلدها.
	 * @return void
	 */
	public static function save_data( $product_id, array $data ) {
		global $wpdb;

		$row = array( 'product_id' => (int) $product_id );

		foreach ( array_keys( self::FIELDS ) as $field ) {
			$row[ $field ] = isset( $data[ $field ] ) ? (string) $data[ $field ] : '';
		}

		$wpdb->replace( self::table(), $row );
	}

	/**
	 * جعبهٔ ویرایش در صفحهٔ محصول.
	 *
	 * @return void
	 */
	public static function add_meta_box() {
		add_meta_box(
			'ab-plant-facts',
			'شناسنامهٔ گیاه (عطار بلد)',
			array( __CLASS__, 'render_meta_box' ),
			'product',
			'normal',
			'default'
		);
	}

	/**
	 * فرم جعبهٔ ویرایش.
	 *
	 * @param WP_Post $post محصول جاری.
	 * @return void
	 */
	public static function render_meta_box( $post ) {
		$data = self::get( $post->ID );
		wp_nonce_field( 'ab_plants_save', 'ab_plants_nonce' );

		echo '<table class="form-table"><tbody>';

		foreach ( self::FIELDS as $field => $label ) {
			$value = $data && isset( $data[ $field ] ) ? $data[ $field ] : '';
			$long  = in_array( $field, array( 'usage_instructions', 'storage_instructions', 'warnings' ), true );

			echo '<tr><th scope="row"><label for="ab-' . esc_attr( $field ) . '">' . esc_html( $label ) . '</label></th><td>';
			if ( $long ) {
				printf(
					'<textarea id="ab-%1$s" name="ab_plants[%1$s]" rows="3" class="large-text">%2$s</textarea>',
					esc_attr( $field ),
					esc_textarea( $value )
				);
			} else {
				printf(
					'<input type="text" id="ab-%1$s" name="ab_plants[%1$s]" value="%2$s" class="regular-text">',
					esc_attr( $field ),
					esc_attr( $value )
				);
			}
			echo '</td></tr>';
		}

		echo '</tbody></table>';
	}

	/**
	 * ذخیرهٔ فرم مدیر.
	 *
	 * @param int     $post_id شناسهٔ محصول.
	 * @param WP_Post $post    محصول.
	 * @return void
	 */
	public static function save_from_post( $post_id, $post ) {
		if ( ! isset( $_POST['ab_plants_nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( sanitize_key( $_POST['ab_plants_nonce'] ), 'ab_plants_save' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_product', $post_id ) ) {
			return;
		}

		$input = isset( $_POST['ab_plants'] ) && is_array( $_POST['ab_plants'] ) ? wp_unslash( $_POST['ab_plants'] ) : array();
		$data  = array();

		foreach ( array_keys( self::FIELDS ) as $field ) {
			$raw          = isset( $input[ $field ] ) ? $input[ $field ] : '';
			$data[ $field ] = in_array( $field, array( 'usage_instructions', 'storage_instructions', 'warnings' ), true )
				? wp_kses_post( $raw )
				: sanitize_text_field( $raw );
		}

		self::save_data( $post_id, $data );
	}

	/**
	 * نمایش شناسنامه در صفحهٔ محصول.
	 *
	 * @return void
	 */
	public static function render_front() {
		global $product;

		if ( ! $product instanceof WC_Product ) {
			return;
		}

		$data = self::get( $product->get_id() );
		if ( ! $data ) {
			return;
		}

		$rows = '';
		foreach ( self::FIELDS as $field => $label ) {
			if ( empty( $data[ $field ] ) ) {
				continue;
			}
			$rows .= '<div><dt>' . esc_html( $label ) . '</dt><dd>' . esc_html( $data[ $field ] ) . '</dd></div>';
		}

		if ( '' === $rows ) {
			return;
		}

		echo '<div class="ab-plant-facts"><h3 class="ab-plant-facts__title">شناسنامهٔ گیاه</h3><dl>' . $rows . '</dl></div>';
	}
}
