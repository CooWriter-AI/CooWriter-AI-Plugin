import { useState, useEffect } from '@wordpress/element';
import { uploadMedia } from '@wordpress/media-utils';
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import { Button } from './button';

export function GeneratedImage( { image, imageClasses, onUseImage } ) {
	const [ status, setStatus ] = useState( 'idle' );
	const [ statusMessage, setStatusMessage ] = useState( null );
	const [ file, setFile ] = useState( {
		url: 'http://localhost:10013/wp-content/uploads/2025/09/architecture-3095716_960_720.jpg',
		id: 668,
	} );

	useEffect( () => {
		if ( status === 'success' && file.id ) {
			const timeout = setTimeout( () => {
				onUseImage( file );
			}, 500 );

			return () => clearTimeout( timeout );
		}
	}, [ status, onUseImage, file ] );

	const { src, alt } = image;

	const handleAddToMediaLibrary = async () => {
		setStatus( 'pending' );

		try {
			// Fetch the image data from the URL
			const response = await fetch( src );

			if ( ! response.ok ) {
				throw new Error( 'Failed to fetch image' );
			}

			// Convert to blob
			const blob = await response.blob();

			// Create file with proper binary data and MIME type
			const imageFile = new File( [ blob ], `${ alt }.png`, {
				type: 'image/png',
			} );

			uploadMedia( {
				filesList: [ imageFile ],
				additionalData: {
					alt_text: alt,
				},
				onFileChange: ( changedFile ) => {
					if ( changedFile?.[ 0 ]?.id ) {
						setStatus( 'success' );
						setStatusMessage( 'Image added to Media Library' );
						setFile( changedFile?.[ 0 ] );
					}
				},
				onError: () => {
					setStatus( 'error' );
					setStatusMessage( 'Failed to add image to Media Library' );
				},
				multiple: false,
			} );
		} catch ( error ) {
			setStatus( 'error' );
			setStatusMessage( 'Failed to add image to Media Library' );
		}
	};

	return (
		<div className="mx-auto w-fit flex flex-col gap-6 items-center">
			<img src={ src } alt="AI Generated" className={ imageClasses } />
			{ status === 'idle' && (
				<StatusIdle onClick={ handleAddToMediaLibrary } />
			) }
			{ status === 'pending' && <StatusPending /> }
			{ status === 'success' && (
				<StatusSuccess statusMessage={ statusMessage } file={ file } />
			) }
			{ status === 'error' && (
				<StatusError
					statusMessage={ statusMessage }
					onClick={ handleAddToMediaLibrary }
				/>
			) }
		</div>
	);
}

function StatusIdle( { onClick } ) {
	return <Button onClick={ onClick }>Use this image</Button>;
}

function StatusPending() {
	return (
		<div className="flex items-center gap-2 text-black">
			<LoaderCircle
				size={ 16 }
				className="text-black animate-[spin_800ms_linear_infinite]"
			/>
			<span>Adding to Media Library...</span>
		</div>
	);
}

function StatusSuccess( { statusMessage } ) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex items-center gap-2">
				<CircleCheck size={ 16 } className="text-green-500" />
				<span>{ statusMessage }</span>
			</div>
		</div>
	);
}

function StatusError( { statusMessage, onClick } ) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex items-center gap-2">
				<CircleX size={ 16 } className="text-red-500" />
				<span>{ statusMessage }</span>
			</div>
			<Button onClick={ onClick }>Retry</Button>
		</div>
	);
}
