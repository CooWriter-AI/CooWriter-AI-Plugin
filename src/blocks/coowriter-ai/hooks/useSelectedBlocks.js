import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { getSelectedBlocks } from '../../../libs/blocks-utils';

import metadata from '../metadata.json';

export function useSelectedBlocks(isLoading) {
	const selectedBlockRef = useRef( null );

	const selectedBlocks = useSelect( ( select ) => {
		if ( isLoading ) {
			return selectedBlockRef.current ?? [];
		}

		const selectedBlocksFromEditor = getSelectedBlocks( select ).filter(
			( block ) => block.name !== metadata.name
		);

		if ( selectedBlocksFromEditor.length > 0 ) {
			selectedBlockRef.current = selectedBlocksFromEditor;
		}

		return selectedBlockRef.current ?? [];
	}, [ isLoading ] );

	return {
		totalBlocks: selectedBlocks?.length || 0,
		selectedBlocks,
	};
}
