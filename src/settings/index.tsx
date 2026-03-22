import { createRoot, StrictMode } from '@wordpress/element';

import { Settings } from './Settings';

import '../tw-styles.scss';
import './styles.scss';

const rootElement = document.querySelector( '#coowriter-ai-settings-root' );

if ( rootElement ) {
	createRoot( rootElement ).render(
		<StrictMode>
			<Settings />
		</StrictMode>
	);
}
