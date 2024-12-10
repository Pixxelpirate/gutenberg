/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

export default function Text< Item >( {
	field,
	onChange,
	hideLabelFromVision,
	value,
}: DataFormControlProps< Item, string > ) {
	const { id, label, placeholder } = field;

	const onChangeControl = useCallback(
		( newValue: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	return (
		<TextControl
			label={ label }
			placeholder={ placeholder }
			value={ typeof value === 'symbol' ? '' : value ?? '' }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
