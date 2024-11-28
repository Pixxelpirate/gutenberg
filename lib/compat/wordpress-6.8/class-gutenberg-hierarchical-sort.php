<?php

/**
 * A custom REST server for Gutenberg.
 *
 * @package gutenberg
 * @since   6.8.0
 */

class Gutenberg_Hierarchical_Sort {


	private static $post_ids = array();
	private static $levels   = array();
	private static $instance;

	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function run( $args ) {
		$new_args = array_merge(
			$args,
			array(
				'fields'         => 'id=>parent',
				'posts_per_page' => -1,
			)
		);
		$query    = new WP_Query( $new_args );
		$posts    = $query->posts;
		$result   = self::sort( $posts );

		self::$post_ids = $result['post_ids'];
		self::$levels   = $result['levels'];
	}

	/**
	 * Check if the request is eligible for hierarchical sorting.
	 *
	 * @param array $request The request data.
	 *
	 * @return bool Return true if the request is eligible for hierarchical sorting.
	 */
	public static function is_eligible( $request ) {
		if ( ! isset( $request['orderby_hierarchy'] ) || true !== $request['orderby_hierarchy'] ) {
			return false;
		}

		return true;
	}

	public static function get_ancestor( $post_id ) {
		$ancestor = get_post( $post_id );
		if ( null === $ancestor ) {
			return 0;
		}

		return $ancestor->post_parent;
	}

	/**
	 * Sort the post ids by hierarchy.
	 *
	 * Example: $posts is
	 * [
	 *   ['ID' => 4, 'post_parent' => 2],
	 *   ['ID' => 2, 'post_parent' => 0],
	 *   ['ID' => 3, 'post_parent' => 2],
	 * ]
	 *
	 * and we want to return: [2, 3, 4]
	 *
	 * @param array $posts The posts to sort.
	 * @param array $args  The arguments to sort the posts by.
	 *
	 * @return array Return the sorted post_ids and the corresponding levels.
	 */
	public static function sort( $posts ) {
		/*
		 * Arrange pages in two arrays:
		 *
		 * - $top_level: posts whose parent is 0
		 * - $children: post ID as the key and an array of children post IDs as the value.
		 *   Example: $children[10][] contains all sub-pages whose parent is 10.
		 *
		 * Additionally, keep track of the levels of each post in $levels.
		 * Example: $levels[10] = 0 means the post ID is a top-level page.
		 *
		 */
		$top_level = array();
		$children  = array();
		foreach ( $posts as $post ) {
			if ( 0 === $post->post_parent ) {
				$top_level[] = $post->ID;
			} else {
				$children[ $post->post_parent ][] = $post->ID;
			}
		}

		$ids    = array();
		$levels = array();
		self::add_hierarchical_ids( $ids, $levels, 0, $top_level, $children );

		// Process remaining children.
		if ( ! empty( $children ) ) {
			foreach ( $children as $parent_id => $child_ids ) {
				$root_not_found = true;
				$ancestors = 0;
				$ancestor  = $parent_id;
				while( $root_not_found ) {
					$ancestors++;
					$ancestor = self::get_ancestor( $ancestor );
					if ( 0 === $ancestor ) {
						$root_not_found = false;
					}
				}
				self::add_hierarchical_ids( $ids, $levels, $ancestors, $child_ids, $children );
			}
		}

		return array(
			'post_ids' => $ids,
			'levels'   => $levels,
		);
	}

	private static function add_hierarchical_ids( &$ids, &$levels, $level, $to_process, $children ) {
		foreach ( $to_process as $id ) {
			if ( in_array( $id, $ids, true ) ) {
				continue;
			}
			$ids[]         = $id;
			$levels[ $id ] = $level;

			if ( isset( $children[ $id ] ) ) {
				self::add_hierarchical_ids( $ids, $levels, $level + 1, $children[ $id ], $children );
				unset( $children[ $id ] );
			}
		}
	}

	public static function get_post_ids() {
		return self::$post_ids;
	}

	public static function get_levels() {
		return self::$levels;
	}
}

add_filter(
	'rest_page_collection_params',
	function ( $params ) {
		$params['orderby_hierarchy'] = array(
			'description' => 'Sort pages by hierarchy.',
			'type'        => 'boolean',
			'default'     => false,
		);
		return $params;
	}
);

add_filter(
	'rest_page_query',
	function ( $args, $request ) {
		if ( ! Gutenberg_Hierarchical_Sort::is_eligible( $request ) ) {
			return $args;
		}

		$hs = Gutenberg_Hierarchical_Sort::init();
		$hs->run( $args );

		// Reconfigure the args to display only the ids in the list.
		$args['post__in'] = $hs->get_post_ids();
		$args['orderby']  = 'post__in';

		return $args;
	},
	10,
	2
);

add_filter(
	'rest_prepare_page',
	function ( $response, $post, $request ) {
		if ( ! Gutenberg_Hierarchical_Sort::is_eligible( $request ) ) {
			return $response;
		}

		$hs                      = Gutenberg_Hierarchical_Sort::init();
		$response->data['level'] = $hs->get_levels()[ $post->ID ];

		return $response;
	},
	10,
	3
);
