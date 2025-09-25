import { useState } from '@wordpress/element';
import classNames from 'classnames';
import { CircleX, Info, LoaderCircle } from 'lucide-react';
import { GeneratedImage } from './generated-image';

import '../tw-styles.scss';
import { Button } from './button';
import { request } from '../libs/request';

const generateImages = async ( prompt, aspectRatio ) => {
	const response = await request( '/api/v1/generation/image', {
		method: 'POST',
		body: JSON.stringify( {
			prompt,
			aspectRatio,
		} ),
	} );

	if ( ! response.ok ) {
		throw new Error( 'Failed to generate image' );
	}

	const data = await response.json();

	const imageURLs = data?.images
		?.filter( image => image.bytes )
		.map( image => `data:image/png;base64,${ image.bytes }` );

	if ( !imageURLs?.length ) {
		throw new Error( 'No images generated' );
	}

	return imageURLs
};

export const Imagen = ( { defaultPrompt = '', onUseImage } ) => {
	const [ prompt, setPrompt ] = useState( defaultPrompt );
	const [ aspectRatio, setAspectRatio ] = useState( '4:3' );
	const [ image, setImage ] = useState( {
		alt: 'Generated image',
		src: 'http://localhost:10013/wp-content/uploads/2025/09/architecture-3095716_960_720.jpg',
	} );

	const [ status, setStatus ] = useState( 'idle' );
	const [ statusMessage, setStatusMessage ] = useState( null );

	const handleGenerate = async ( e ) => {
		e.preventDefault();

		if ( ! prompt.trim() ) {
			return;
		}

		setStatus( 'generating' );
		setStatusMessage( 'Generating image...' );

		try {
			const generatedImageURLs = await generateImages( prompt, aspectRatio );

			console.log( generatedImageURLs );

			setImage( {
				alt: prompt.trim(),
				src: generatedImageURLs[0],
			} );

			setStatus( 'success' );
			setStatusMessage( 'Image generated successfully' );
		} catch ( error ) {
			console.error(error);
			setStatus( 'error' );
			setStatusMessage( 'Failed to generate image' );
		} 
	};

	const imageClasses = classNames(
		'w-auto h-[50vh] object-contain bg-white rounded-md shadow-md border border-gray-300',
		{
			'aspect-[1/1]': aspectRatio === '1:1',
			'aspect-[4/3]': aspectRatio === '4:3',
			'aspect-[3/4]': aspectRatio === '3:4',
			'aspect-[16/9]': aspectRatio === '16:9',
			'aspect-[9/16]': aspectRatio === '9:16',
		}
	);

	return (
		<div className="coowriter-ai-tw">
			<div className="mt-4 grid grid-cols-[280px_1fr] gap-2 bg-gray-50 rounded-md border border-gray-300">
				<form
					className="flex flex-col gap-2 items-stretch px-3 py-2 border-r border-gray-300"
					onSubmit={ handleGenerate }
				>
					<div className="flex flex-col gap-2">
						<label htmlFor="prompt">
							Prompt to generate an image
						</label>
						<textarea
							rows={ 4 }
							className="bg-white border border-gray-300 rounded-md py-2 px-3 outline-none shadow-none resize-vertical"
							placeholder="Enter a prompt to generate an image"
							value={ prompt }
							onChange={ ( e ) => setPrompt( e.target.value ) }
							disabled={ status === 'generating' }
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="prompt">Aspect Ratio</label>
						<select
							className="bg-white border border-gray-300 rounded-md py-2 px-3 outline-none"
							value={ aspectRatio }
							onChange={ ( e ) =>
								setAspectRatio( e.target.value )
							}
							disabled={ status === 'generating' }
						>
							<option value="1:1">Square - 1:1</option>
							<option value="4:3">Standard - 4:3</option>
							<option value="3:4">Portrait - 3:4</option>
							<option value="16:9">Wide - 16:9</option>
							<option value="9:16">Tall - 9:16</option>
						</select>
					</div>
					<Button
						type="submit"
						className="mt-2"
						disabled={ status === 'generating' }
					>
						Generate
					</Button>
					<div className="flex items-center gap-2 text-gray-500">
						<Info size={ 16 } />
						<p className="text-xs">
							Image generation requires 10 credits
						</p>
					</div>
				</form>
				<div className="my-8">
					{ status === 'idle' && (
						<StatusIdle
							aspectRatio={ aspectRatio }
							className={ imageClasses }
						/>
					) }
					{ status === 'generating' && (
						<Loading
							className={ imageClasses }
							statusMessage={ statusMessage }
						/>
					) }
					{ status === 'error' && (
						<Error
							error={ statusMessage }
							className={ imageClasses }
						/>
					) }
					{ status === 'success' && (
						<GeneratedImage
							image={ image }
							imageClasses={ imageClasses }
							onUseImage={ ( imageDate ) =>
								onUseImage( {
									...imageDate,
									alt: prompt.trim(),
								} )
							}
						/>
					) }
				</div>
			</div>
		</div>
	);
};

function StatusIdle( { className, aspectRatio } ) {
	return (
		<div
			className={ classNames(
				'mx-auto text-gray-500 grid place-items-center',
				className
			) }
		>
			<p className="text-center text-sm p-2">
				Generated image will have aspect ratio of { aspectRatio }
			</p>
		</div>
	);
}

function Loading( { className, statusMessage } ) {
	return (
		<div
			className={ classNames(
				'mx-auto flex flex-col items-center justify-center gap-2',
				className
			) }
		>
			<LoaderCircle
				size={ 30 }
				className="text-black animate-[spin_800ms_linear_infinite]"
			/>
			<p className="text-center text-sm">{ statusMessage }</p>
		</div>
	);
}

function Error( { error, className } ) {
	return (
		<div
			className={ classNames(
				'mx-auto flex flex-col items-center justify-center gap-2 p-2',
				className
			) }
		>
			<CircleX size={ 30 } className="text-red-500" />
			<p className="text-center text-sm text-red-500">{ error }</p>
		</div>
	);
}
