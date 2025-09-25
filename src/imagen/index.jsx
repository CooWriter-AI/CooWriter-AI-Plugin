import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Modal } from '@wordpress/components';
import { BlockIcon } from '../blocks/coowriter-ai/components/BlockIcon';
import { Imagen } from './imagen';

const CustomImageButton = ( BlockEdit ) => ( props ) => {
	if ( props.name !== 'core/image' ) {
		return <BlockEdit { ...props } />;
	}

	return (
		<>
			<BlockEdit { ...props } />
			<ImagenControls { ...props } />
		</>
	);
};

const ImagenControls = ( props ) => {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleCustomClick = () => {
		setIsModalOpen( true );
	};

	return (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={ <BlockIcon /> }
					label="Generate Image using CooWriter AI"
					onClick={ handleCustomClick }
				/>
				{ isModalOpen && (
					<Modal
						title="Generate Image using CooWriter AI"
						onRequestClose={ () => setIsModalOpen( false ) }
						style={ {
							width: '90%',
							height: '90%',
							maxHeight: '90%',
						} }
					>
						<Imagen
							defaultPrompt={ props.attributes.alt }
							onUseImage={ ( image ) => {
								props.setAttributes( {
									url: image.url,
									alt: image.alt,
									id: image.id,
								} );
								setIsModalOpen( false );
							} }
						/>
					</Modal>
				) }
			</ToolbarGroup>
		</BlockControls>
	);
};

addFilter( 'editor.BlockEdit', 'coowriter-ai/imagen', CustomImageButton );
