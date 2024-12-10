/**
 * WordPress dependencies
 */
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

export default function Integer< Item >( {
	field,
	onChange,
	hideLabelFromVision,
	value,
}: DataFormControlProps< Item, number > ) {
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
			value={ typeof value === 'symbol' ? '' : value }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
