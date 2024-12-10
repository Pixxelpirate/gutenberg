/**
 * WordPress dependencies
 */
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps, WithBulkEditing } from '../types';

export default function Integer< Item >( {
	field,
	onChange,
	hideLabelFromVision,
	value,
}: DataFormControlProps< Item > & WithBulkEditing< Item > ) {
	const { id, label, description } = field;
	const onChangeControl = useCallback(
		( newValue: string | undefined ) =>
			onChange( {
				[ id ]: Number( newValue ),
			} ),
		[ id, onChange ]
	);

	return (
		<NumberControl
			label={ label }
			help={ description }
			value={ value ?? '' }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
