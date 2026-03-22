import { createReduxStore, register } from '@wordpress/data';

const STORE_NAME = 'coowriter-ai';

type State = {
	isLoading: boolean;
	highlightedBlocks: unknown[];
};

type Action = {
	type: string;
	isLoading: boolean;
	highlightedBlocks: unknown[];
};

const DEFAULT_STATE: State = {
	isLoading: false,
	highlightedBlocks: [],
};

const actions = {
	setIsLoading( isLoading: boolean ) {
		return { type: 'SET_IS_LOADING', isLoading } as const;
	},
	setHighlightedBlocks( highlightedBlocks: unknown[] ) {
		return { type: 'SET_HIGHLIGHTED_BLOCKS', highlightedBlocks } as const;
	},
};

const reducer = ( state: State = DEFAULT_STATE, action: Action ): State => {
	switch ( action.type ) {
		case 'SET_IS_LOADING':
			return { ...state, isLoading: action.isLoading };
		case 'SET_HIGHLIGHTED_BLOCKS':
			return {
				...state,
				highlightedBlocks: action.highlightedBlocks ?? [],
			};
		default:
			return state;
	}
};

const selectors = {
	getHighlightedBlocks( state: State ) {
		return state.highlightedBlocks;
	},
	getIsLoading( state: State ) {
		return state.isLoading;
	},
};

export const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );
