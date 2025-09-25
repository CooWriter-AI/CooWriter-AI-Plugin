import classNames from 'classnames';

export function Button( { className, children, onClick, ...rest } ) {
	return (
		<button
			{ ...rest }
			className={ classNames(
				'px-4 py-2 rounded-md shadow-none cursor-pointer flex items-center justify-center gap-2 bg-black text-white border hover:bg-white hover:text-black transition-all duration-200',
				className
			) }
			onClick={ onClick }
		>
			{ children }
		</button>
	);
}
