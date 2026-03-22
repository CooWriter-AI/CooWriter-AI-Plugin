import { select, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

export function getSelectedBlocks() {
	const blockEditorSelect = select( 'core/block-editor' );
	const hasMultiSelection = blockEditorSelect.hasMultiSelection();

	if ( hasMultiSelection ) {
		return blockEditorSelect.getMultiSelectedBlocks() ?? [];
	}

	const selectedBlock = blockEditorSelect.getSelectedBlock();
	return selectedBlock ? [ selectedBlock ] : [];
}

export function extractBlockData( block ) {
	return {
		name: block.name,
		attributes: {
			...block.attributes,
			content: block?.attributes?.content?.toString(),
		},
		innerBlocks: block.innerBlocks.map( extractBlockData ),
	};
}

export function createBlocks( blocks ) {
	if ( ! blocks?.length ) {
		return [];
	}

	return blocks.map( ( block ) =>
		createBlock(
			block.name,
			block.attributes,
			createBlocks( block.innerBlocks )
		)
	);
}

export function getAllBlocks() {
	return select( 'core/block-editor' ).getBlocks();
}

export function addOrReplaceBlocks( oldBlocks, newBlocks ) {
	if ( oldBlocks?.length ) {
		return dispatch( 'core/block-editor' ).replaceBlocks(
			oldBlocks.map( ( block ) => block.clientId ),
			newBlocks
		);
	}

	return dispatch( 'core/block-editor' ).insertBlocks( newBlocks );
}
