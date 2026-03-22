import { useState } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { CircleCheck } from 'lucide-react';
import { Subscription } from '../components/Subscription';

declare global {
	interface Window {
		cooWriterAISettingsConfig: {
			apiKeyFieldName: string;
			hasApiKey: boolean;
			profileURL: string;
			isSettingsUpdated: boolean;
		};
	}
}

export const Settings = () => {
	const [ apiKey, setApiKey ] = useState( '' );

	return (
		<div className="p-6">
			<h1 className="text-3xl text-gray-700 font-bold mb-4">
				CooWriter AI Settings
			</h1>
			<p className="text-gray-600 mb-6">
				Visit{ ' ' }
				<a
					href="https://coowriter.ai"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 underline"
				>
					CooWriter AI
				</a>{ ' ' }
				to learn more about how our intelligent writing assistant can
				transform your WordPress writing experience by generating,
				enhancing, and refining content directly within the block
				editor.
			</p>

			<div className="max-w-xl">
				<div className="flex items-end gap-3">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="CooWriter AI API Key"
						type="password"
						autoComplete="off"
						value={ apiKey }
						onChange={ ( value ) => setApiKey( value ) }
						placeholder={
							window.cooWriterAISettingsConfig.hasApiKey
								? '•'.repeat( 70 )
								: 'Enter your CooWriter AI API Key'
						}
						className="shrink-0 flex-grow"
						name={
							window.cooWriterAISettingsConfig.apiKeyFieldName
						}
					/>
					<Button
						__next40pxDefaultSize
						variant="primary"
						className="px-4 mt-4 rounded-xs text-sm"
						type="submit"
					>
						Save API Key
					</Button>
					{ window.cooWriterAISettingsConfig.isSettingsUpdated && (
						<span className="flex items-center gap-1.5 text-green-600 h-10">
							<CircleCheck size={ 18 } />
							Settings saved
						</span>
					) }
				</div>
				<p className="text-gray-600 mt-2 mb-6">
					{ "Don't have an API key? " }
					<a
						href={ window.cooWriterAISettingsConfig.profileURL }
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 underline"
					>
						Get your API key here.
					</a>
				</p>

				<hr className="my-6 border-gray-300" />

				<Subscription />
			</div>
		</div>
	);
};
