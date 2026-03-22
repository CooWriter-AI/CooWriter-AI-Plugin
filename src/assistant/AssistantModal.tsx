import { useState, useLayoutEffect, useRef } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { X, ArrowUp, Sparkles } from 'lucide-react';
import { processTask } from '../libs/task-worker';
import { useSelectedBlocks } from '../hooks/useSelectedBlocks';
import { Tooltip } from '@wordpress/components';
import { addOrReplaceBlocks, getAllBlocks } from '../libs/blocks-utils';
import { Status } from '../components/Status';
import { store } from '../store';

export function AssistantModal( { onClose }: { onClose: () => void } ) {
	const textareaRef = useRef< HTMLTextAreaElement | null >( null );

	const [ message, setMessage ] = useState( '' );

	const isLoading = useSelect(
		( select ) => select( store ).getIsLoading(),
		[]
	);
	const { setIsLoading, setHighlightedBlocks } = useDispatch( store );

	const [ isUseSelectionMode, setIsUseSelectionMode ] = useState( false );
	const [ isSuccess, setIsSuccess ] = useState( false );
	const [ error, setError ] = useState< string | null >( null );
	const [ warning, setWarning ] = useState< string | null >( null );

	const selectedBlocks = useSelectedBlocks( isLoading );

	useLayoutEffect( () => {
		if ( isUseSelectionMode ) {
			setHighlightedBlocks( selectedBlocks );
		}

		return () => {
			setHighlightedBlocks( [] );
		};
	}, [ selectedBlocks, isUseSelectionMode, setHighlightedBlocks ] );

	const handleSubmit = async (
		e: React.FormEvent< HTMLFormElement | HTMLTextAreaElement >
	) => {
		e.preventDefault();

		if ( ! message.trim() ) {
			return;
		}

		// Clear any previous errors/warnings and feedback state
		setError( null );
		setWarning( null );
		setIsSuccess( false );
		setIsLoading( true );

		try {
			await processTask( {
				message: message.trim(),
				allBlocks: getAllBlocks(),
				selectedBlocks: isUseSelectionMode ? selectedBlocks : undefined,
				blocksReplacer: async (
					oldBlocks: any[],
					newBlocks: any[]
				) => {
					await addOrReplaceBlocks( oldBlocks, newBlocks );
				},
			} );

			setMessage( '' );
			setIsSuccess( true );
		} catch ( submissionError: any ) {
			setError(
				submissionError?.message ||
					'Generation failed due to an error. Please try again.'
			);
		} finally {
			setIsLoading( false );
		}
	};

	const handleResetStatus = () => {
		setIsLoading( false );
		setIsSuccess( false );
		setError( null );
		setWarning( null );
	};

	const handleDone = () => {
		onClose();
	};

	const handleModeToggle = () => {
		setIsUseSelectionMode( ! isUseSelectionMode );
	};

	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-100 w-[50%] min-w-[600px] max-w-[800px] fixed rounded-tl rounded-tr px-1.5 pt-1.5 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
			<form
				className="relative pb-2 bg-white text-base font-normal overflow-hidden rounded-tl rounded-tr"
				onSubmit={ handleSubmit }
			>
				<div className="px-2 py-1 mb-1 flex gap-1 items-center justify-between bg-gray-100 border-b border-gray-200">
					<span className="text-sm font-medium text-indigo-500">
						<Sparkles size={ 16 } className="inline-block mr-1" />
						CooWriter AI
					</span>
					<button
						type="button"
						title="Close"
						className="cursor-pointer text-gray-500 hover:text-gray-700"
						disabled={ isLoading }
						onClick={ handleDone }
					>
						<X size={ 16 } stroke="currentColor" />
					</button>
				</div>
				<textarea
					ref={ textareaRef }
					name="message"
					className="!m-0 !p-0 !pt-0.5 !ps-3 !pe-2 !outline-none w-full !border-none shadow-none placeholder-gray-500 !text-black resize-none min-h-[70px] max-h-[180px] field-sizing-content disabled:opacity-50"
					placeholder={ __(
						'Ask AI to generate content, rewrite, or fix the selected blocks.',
						'coowriter-ai'
					) }
					value={ message }
					disabled={ isLoading }
					onChange={ ( event ) => setMessage( event.target.value ) }
					onKeyDown={ (
						event: React.KeyboardEvent< HTMLTextAreaElement >
					) => {
						if ( event.key === 'Enter' && ! event.shiftKey ) {
							event.preventDefault();
							handleSubmit( event );
						}

						if ( event.key === 'Escape' ) {
							event.preventDefault();
							handleDone();
						}
					} }
				/>
				<div className="mx-2 flex gap-2 text-sm justify-between items-center">
					<Status
						isLoading={ isLoading }
						isSuccess={ isSuccess }
						error={ error }
						warning={ warning }
						resetStatus={ handleResetStatus }
					/>

					<Tooltip
						text={
							isUseSelectionMode
								? 'Selected Mode is active. AI will only modify the selected blocks.'
								: 'Normal Mode is active. AI will modify all blocks.'
						}
					>
						<button
							className="whitespace-nowrap text-xs bg-white border border-indigo-500 text-indigo-600 px-1.5 py-0.5 rounded z-10 cursor-pointer"
							type="button"
							disabled={ isLoading }
							onClick={ handleModeToggle }
						>
							{ isUseSelectionMode
								? 'Selection Mode'
								: 'Normal Mode' }
						</button>
					</Tooltip>

					<Tooltip text="Generate" shortcut={ '↵' }>
						<button
							type="submit"
							className="p-1 rounded cursor-pointer border border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white transition-all duration-200"
						>
							<ArrowUp size={ 16 } stroke="currentColor" />
						</button>
					</Tooltip>
				</div>
			</form>
		</div>
	);
}
