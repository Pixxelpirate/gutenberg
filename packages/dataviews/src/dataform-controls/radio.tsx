/**
 * WordPress dependencies
 */
import { RadioControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlPropsWithBulkEditing } from '../types';

export default function Radio< Item >( {
	field,
	onChange,
	hideLabelFromVision,
	value,
}: DataFormControlPropsWithBulkEditing< Item, string > ) {
	const { id, label } = field;

	const onChangeControl = useCallback(
		( newValue: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	if ( field.elements ) {
		return (
			<RadioControl
				label={ label }
				onChange={ onChangeControl }
				options={ field.elements }
				selected={ typeof value === 'symbol' ? '' : value }
				hideLabelFromVision={ hideLabelFromVision }
			/>
		);
	}

	return null;
}
