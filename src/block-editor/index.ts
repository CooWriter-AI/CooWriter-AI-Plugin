import { select, subscribe } from '@wordpress/data';
import { store } from '../store';

import './styles.scss';

const removeBlockHighlighting = () => {
	(
		( document as Document )?.querySelector(
			'iframe[name="editor-canvas"]'
		) as HTMLIFrameElement
	 )?.contentDocument
		?.querySelectorAll( '[data-coowriter-ai-highlighted]' )
		.forEach( ( block ) => {
			block.removeAttribute( 'data-coowriter-ai-highlighted' );
		} );
};

const addBlockHighlighting = ( selectedBlocks: any[], isLoading: boolean ) => {
	selectedBlocks
		.map(
			( block ) =>
				(
					( document as Document )?.querySelector(
						'iframe[name="editor-canvas"]'
					) as HTMLIFrameElement
				 ).contentDocument?.querySelector(
					`#block-${ block.clientId }`
				)
		)
		.filter( Boolean )
		.forEach( ( element ) => {
			element?.setAttribute(
				'data-coowriter-ai-highlighted',
				String( isLoading )
			);
		} );
};

subscribe( () => {
	const { getHighlightedBlocks, getIsLoading } = select( store );

	const selectedBlocks = getHighlightedBlocks();
	const isLoading = getIsLoading();

	removeBlockHighlighting();
	addBlockHighlighting( selectedBlocks, isLoading );
}, store );
