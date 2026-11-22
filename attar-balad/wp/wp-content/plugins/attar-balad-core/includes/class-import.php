<?php
/**
 * ایمپورت کاتالوگ فاز ۳ (data.js) به ووکامرس — تکرارپذیر و بدون رکورد تکراری.
 *
 * اجرا:
 *   wp attar import --source=/attar-balad/assets/js/data.js --root=/attar-balad
 *
 * @package attar-balad-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * دستور WP-CLI ایمپورت.
 */
class AB_Import {

	const DEFAULT_SOURCE = '/attar-balad/assets/js/data.js';
	const DEFAULT_ROOT   = '/attar-balad';

	/**
	 * ثبت دستور CLI.
	 *
	 * @return void
	 */
	public static function init() {
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			WP_CLI::add_command( 'attar import', array( __CLASS__, 'cli' ) );
		}
	}

	/**
	 * اجرای ایمپورت.
	 *
	 * @param array $args       آرگومان‌های موضعی.
	 * @param array $assoc_args گزینه‌ها.
	 * @return void
	 */
	public static function cli( $args, $assoc_args ) {
		if ( ! class_exists( 'WC_Product_Simple' ) ) {
			WP_CLI::error( 'ووکامرس فعال نیست.' );
		}

		$source  = isset( $assoc_args['source'] ) ? $assoc_args['source'] : self::DEFAULT_SOURCE;
		$root    = isset( $assoc_args['root'] ) ? rtrim( $assoc_args['root'], '/' ) : self::DEFAULT_ROOT;
		$catalog = self::read_catalog( $source );

		$cat_ids = self::import_categories( $catalog['categories'] );

		$created = 0;
		$updated = 0;
		$images  = 0;

		foreach ( $catalog['products'] as $item ) {
			$sku      = (string) $item['id'];
			$existing = wc_get_product_id_by_sku( $sku );
			$product  = $existing ? wc_get_product( $existing ) : new WC_Product_Simple();

			if ( ! $product instanceof WC_Product ) {
				continue;
			}

			if ( ! $existing ) {
				$product->set_sku( $sku );
				$product->set_slug( $sku );
			}

			$stock = (int) $item['stock'];

			$product->set_name( $item['fa'] );
			$product->set_status( 'publish' );
			$product->set_catalog_visibility( 'visible' );
			$product->set_regular_price( (string) (int) $item['price'] );
			$product->set_description( (string) $item['desc'] );
			$product->set_short_description( (string) $item['short'] );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $stock );
			$product->set_stock_status( $stock > 0 ? 'instock' : 'outofstock' );
			$product->set_featured( in_array( 'ویژه', (array) $item['tags'], true ) );

			$product_id = $product->save();
			if ( ! $product_id ) {
				WP_CLI::warning( 'محصول ذخیره نشد: ' . $sku );
				continue;
			}

			if ( isset( $cat_ids[ $item['cat'] ] ) ) {
				wp_set_object_terms( $product_id, array( $cat_ids[ $item['cat'] ] ), 'product_cat' );
			}

			$tags = array_map( 'strval', (array) $item['tags'] );
			if ( ! empty( $item['soon'] ) ) {
				$tags[] = 'به‌زودی';
			}
			if ( $tags ) {
				wp_set_object_terms( $product_id, $tags, 'product_tag' );
			}

			if ( ! empty( $item['img'] ) && ! has_post_thumbnail( $product_id ) ) {
				$attachment_id = self::attach_image( $product_id, $root . '/' . $item['img'], $item['fa'] );
				if ( $attachment_id ) {
					set_post_thumbnail( $product_id, $attachment_id );
					$images++;
				}
			}

			AB_Plants::save_data(
				$product_id,
				array(
					'botanical_name'       => isset( $item['botanical'] ) ? $item['botanical'] : '',
					'origin'               => isset( $item['origin'] ) ? $item['origin'] : '',
					'plant_part'           => isset( $item['part'] ) ? $item['part'] : '',
					'usage_instructions'   => isset( $item['usage'] ) ? $item['usage'] : '',
					'storage_instructions' => isset( $item['storage'] ) ? $item['storage'] : '',
					'warnings'             => isset( $item['warn'] ) ? $item['warn'] : '',
					'source_ref'           => '',
				)
			);

			if ( $existing ) {
				$updated++;
			} else {
				$created++;
			}
		}

		WP_CLI::success(
			sprintf(
				'ایمپورت کامل شد: %d محصول جدید، %d به‌روزشده، %d تصویر، %d دسته.',
				$created,
				$updated,
				$images,
				count( $cat_ids )
			)
		);
	}

	/**
	 * خواندن کاتالوگ از فایل data.js (شیء AB_DATA).
	 *
	 * @param string $source مسیر فایل.
	 * @return array
	 */
	public static function read_catalog( $source ) {
		if ( ! file_exists( $source ) ) {
			WP_CLI::error( 'فایل کاتالوگ پیدا نشد: ' . $source );
		}

		$raw   = (string) file_get_contents( $source );
		$raw   = preg_replace( '#/\*.*?\*/#s', '', $raw );
		$start = strpos( $raw, '{' );
		$end   = strrpos( $raw, '}' );

		if ( false === $start || false === $end ) {
			WP_CLI::error( 'ساختار فایل کاتالوگ خوانده نشد.' );
		}

		$data = json_decode( substr( $raw, $start, $end - $start + 1 ), true );

		if ( ! is_array( $data ) || empty( $data['products'] ) ) {
			WP_CLI::error( 'JSON کاتالوگ نامعتبر است.' );
		}

		return $data;
	}

	/**
	 * ساخت دسته‌های محصول.
	 *
	 * @param array $categories دسته‌های کاتالوگ.
	 * @return array<string, int> نگاشت شناسهٔ کاتالوگ به term_id.
	 */
	private static function import_categories( $categories ) {
		$map = array();

		foreach ( (array) $categories as $cat ) {
			$term = term_exists( $cat['id'], 'product_cat' );

			if ( ! $term ) {
				$term = wp_insert_term(
					$cat['name'],
					'product_cat',
					array(
						'slug'        => $cat['id'],
						'description' => isset( $cat['blurb'] ) ? $cat['blurb'] : '',
					)
				);
			}

			if ( is_wp_error( $term ) ) {
				WP_CLI::warning( 'دسته ساخته نشد: ' . $cat['id'] );
				continue;
			}

			$map[ $cat['id'] ] = (int) ( is_array( $term ) ? $term['term_id'] : $term );
		}

		return $map;
	}

	/**
	 * افزودن تصویر محصول به کتابخانهٔ رسانه.
	 *
	 * @param int    $product_id محصول.
	 * @param string $path       مسیر فایل در مخزن.
	 * @param string $title      عنوان پیوست.
	 * @return int شناسهٔ پیوست یا صفر.
	 */
	private static function attach_image( $product_id, $path, $title ) {
		if ( ! file_exists( $path ) ) {
			return 0;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$uploads = wp_upload_dir();
		if ( ! empty( $uploads['error'] ) ) {
			return 0;
		}

		$filename = wp_unique_filename( $uploads['path'], basename( $path ) );
		$dest     = $uploads['path'] . '/' . $filename;

		if ( ! copy( $path, $dest ) ) {
			return 0;
		}

		$filetype = wp_check_filetype( $filename );

		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' => $filetype['type'],
				'post_title'     => $title,
				'post_content'   => '',
				'post_status'    => 'inherit',
			),
			$dest,
			$product_id
		);

		if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
			return 0;
		}

		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $dest ) );

		return (int) $attachment_id;
	}
}
