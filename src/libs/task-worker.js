import {
	createBlocks,
	extractBlockData,
	getSelectedBlocks,
} from './blocks-utils';
import { generateBlocks } from './gen';

export async function processTask( {
	message,
	allBlocks = getSelectedBlocks(),
	selectedBlocks,
	blocksReplacer,
} ) {
	try {
		const allBlocksData = allBlocks.map( extractBlockData );
		const selectedBlocksData = selectedBlocks?.map( extractBlockData );

		const { blocks: generatedBlocksData = [] } = await generateBlocks(
			message,
			allBlocksData,
			selectedBlocksData
		);

		const generatedBlocks = createBlocks( generatedBlocksData );
		await blocksReplacer( selectedBlocks || allBlocks, generatedBlocks );

		return { success: true };
	} catch ( error ) {
		throw new Error( error.message || 'Generation failed' );
	}
}
