/**
 * WordPress dependencies
 */
import { BaseControl, TimePicker, VisuallyHidden } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlPropsWithBulkEditing } from '../types';

export default function DateTime< Item >( {
	field,
	onChange,
	hideLabelFromVision,
	value,
}: DataFormControlPropsWithBulkEditing< Item, string > ) {
	const { id, label } = field;

	const onChangeControl = useCallback(
		( newValue: string | null ) => onChange( { [ id ]: newValue } ),
		[ id, onChange ]
	);

	return (
		<fieldset className="dataviews-controls__datetime">
			{ ! hideLabelFromVision && (
				<BaseControl.VisualLabel as="legend">
					{ label }
				</BaseControl.VisualLabel>
			) }
			{ hideLabelFromVision && (
				<VisuallyHidden as="legend">{ label }</VisuallyHidden>
			) }
			<TimePicker
				currentTime={ typeof value === 'symbol' ? '' : value }
				onChange={ onChangeControl }
				hideLabelFromVision
			/>
		</fieldset>
	);
}
