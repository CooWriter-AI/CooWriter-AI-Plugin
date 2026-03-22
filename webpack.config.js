import path from 'path';
import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const plugins = defaultConfig.plugins.filter(
	( plugin ) => plugin.constructor.name !== 'RtlCssPlugin'
);

export default {
	...defaultConfig,
	devServer: {
		...defaultConfig.devServer,
		port: 8800,
	},
	entry: {
		assistant: path.resolve(
			import.meta.dirname,
			'src/assistant/index.tsx'
		),
		imagen: path.resolve( import.meta.dirname, 'src/imagen/index.jsx' ),
		settings: path.resolve( import.meta.dirname, 'src/settings/index.tsx' ),
		'block-editor': path.resolve(
			import.meta.dirname,
			'src/block-editor/index.ts'
		),
	},
	watchOptions: {
		ignored: [ '**/build', '**/vendor', '**/node_modules' ],
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.scss$/i,
				include: path.resolve( import.meta.dirname, 'src' ),
				use: [ 'postcss-loader' ],
			},
		],
	},
	plugins: [ ...plugins, new CleanWebpackPlugin() ],
};
