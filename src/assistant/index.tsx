import { createRoot, useState } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import { Icon } from '../components/Icon';
import { AssistantModal } from './AssistantModal';

import '../tw-styles.scss';
import './styles.scss';

domReady( () => {
	const root = document.getElementById( 'coowriter-ai-assistant-root' );

	if ( ! root ) {
		return;
	}

	createRoot( root ).render( <App /> );
} );

export function App() {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			{ ! isModalOpen && (
				<button
					className="absolute bottom-4 start-4 z-100 size-10 rounded-md cursor-pointer block fixed"
					onClick={ () => {
						setIsModalOpen( ! isModalOpen );
					} }
				>
					<Icon size={ 40 } />
				</button>
			) }
			{ isModalOpen && (
				<AssistantModal
					onClose={ () => {
						setIsModalOpen( false );
					} }
				/>
			) }
		</>
	);
}
