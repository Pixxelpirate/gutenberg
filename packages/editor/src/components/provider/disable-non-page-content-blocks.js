/**
 * WordPress dependencies
 */
import { useSelect, useRegistry } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import usePostContentBlocks from './use-post-content-blocks';

/**
 * Component that when rendered, makes it so that the site editor allows only
 * page content to be edited.
 */
export default function DisableNonPageContentBlocks() {
	const contentOnlyIds = usePostContentBlocks();
	const { templateParts, isNavigationMode } = useSelect( ( select ) => {
		const { getBlocksByName, isNavigationMode: _isNavigationMode } =
			select( blockEditorStore );
		return {
			templateParts: getBlocksByName( 'core/template-part' ),
			isNavigationMode: _isNavigationMode(),
		};
	}, [] );
	const disabledIds = useSelect(
		( select ) => {
			const { getBlockOrder } = select( blockEditorStore );
			return templateParts.flatMap( ( clientId ) =>
				getBlockOrder( clientId )
			);
		},
		[ templateParts ]
	);

	const registry = useRegistry();

	useEffect( () => {
		const { setBlockEditingMode, unsetBlockEditingMode } =
			registry.dispatch( blockEditorStore );

		registry.batch( () => {
			setBlockEditingMode( '', 'disabled' );
			for ( const clientId of contentOnlyIds ) {
				setBlockEditingMode( clientId, 'contentOnly' );
			}
			if ( ! isNavigationMode ) {
				for ( const clientId of templateParts ) {
					setBlockEditingMode( clientId, 'contentOnly' );
				}
			}
			for ( const clientId of disabledIds ) {
				setBlockEditingMode( clientId, 'disabled' );
			}
		} );

		return () => {
			registry.batch( () => {
				unsetBlockEditingMode( '' );
				for ( const clientId of contentOnlyIds ) {
					unsetBlockEditingMode( clientId );
				}
				if ( ! isNavigationMode ) {
					for ( const clientId of templateParts ) {
						unsetBlockEditingMode( clientId );
					}
				}
				for ( const clientId of disabledIds ) {
					unsetBlockEditingMode( clientId );
				}
			} );
		};
	}, [
		templateParts,
		contentOnlyIds,
		disabledIds,
		isNavigationMode,
		registry,
	] );

	return null;
}
