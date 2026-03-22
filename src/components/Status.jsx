import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CheckCheck, LoaderCircle, AlertTriangle, X } from 'lucide-react';

export function Status( {
	isLoading,
	isSuccess,
	error,
	warning,
	resetStatus,
} ) {
	if ( isLoading ) {
		return <LoadingMessage />;
	}

	if ( isSuccess ) {
		return <SuccessMessage onClose={ resetStatus } />;
	}

	if ( error ) {
		return <ErrorMessage error={ error } />;
	}

	if ( warning ) {
		return <WarningMessage warning={ warning } />;
	}

	return null;
}

function ErrorMessage( { error } ) {
	return (
		<div className="text-gray-600 me-2 w-full flex items-center gap-1">
			<span className="block">
				<X size={ 16 } className="text-red-600" />
			</span>
			<span>{ error }</span>
		</div>
	);
}

function WarningMessage( { warning } ) {
	return (
		<div className="text-gray-600 me-2 w-full flex items-center gap-1">
			<span className="block">
				<AlertTriangle size={ 16 } className="text-orange-600" />
			</span>
			<span>{ warning }</span>
		</div>
	);
}

// Progressive loading messages
const LOADING_MESSAGES = [
	__( 'Analyzing your request 🧠', 'coowriter-ai' ),
	__( 'Crafting creative content ❇️', 'coowriter-ai' ),
	__( 'Structuring your ideas 📚', 'coowriter-ai' ),
	__( 'Adding finishing touches 🎨', 'coowriter-ai' ),
	__( 'Almost ready to amaze you 🚀', 'coowriter-ai' ),
];

function LoadingMessage() {
	const [ messageIndex, setMessageIndex ] = useState( 0 );

	useEffect( () => {
		const interval = setInterval( () => {
			setMessageIndex(
				( prev ) => ( prev + 1 ) % LOADING_MESSAGES.length
			);
		}, 3000 );

		return () => clearInterval( interval );
	}, [] );

	return (
		<div className="text-gray-600 me-2 w-full flex items-center gap-1">
			<span className="block">
				<LoaderCircle
					size={ 16 }
					className="text-indigo-500 animate-[spin_800ms_linear_infinite]"
				/>
			</span>
			<span>{ LOADING_MESSAGES[ messageIndex ] }</span>
		</div>
	);
}

function SuccessMessage( { onClose } ) {
	useEffect( () => {
		const timeout = setTimeout( () => {
			onClose?.();
		}, 2000 );

		return () => clearTimeout( timeout );
	}, [ onClose ] );

	return (
		<div className="text-gray-600 me-2 w-full flex items-center gap-1">
			<span className="block">
				<CheckCheck size={ 16 } className="text-green-700" />
			</span>
			<span>
				{ __( 'Content generated successfully!', 'coowriter-ai' ) }
			</span>
		</div>
	);
}
