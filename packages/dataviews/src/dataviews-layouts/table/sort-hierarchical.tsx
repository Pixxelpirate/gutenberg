/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataViewsContext from '../../components/dataviews-context';
import type { ViewTable } from '../../types';

function SortHierarchicalControl() {
	const context = useContext( DataViewsContext );
	const view = context.view as ViewTable;
	const onChangeView = context.onChangeView;

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Show hierarchy' ) }
			checked={ !! view.layout?.hierarchicalSort }
			onChange={ ( checked: boolean ) => {
				onChangeView( {
					...view,
					layout: {
						...view.layout,
						hierarchicalSort: checked,
					},
				} );
			} }
		/>
	);
}

export default SortHierarchicalControl;
