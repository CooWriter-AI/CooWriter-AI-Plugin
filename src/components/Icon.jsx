export function Icon( { size = 24 } ) {
	return (
		<svg
			width={ size }
			height={ size }
			viewBox="0 0 256 256"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Background. */ }
			<rect width="256" height="256" rx="40" ry="40" fill="#6366F1" />

			{ /* Combined C and W as a single path. */ }
			<path
				d="M168 80C160 64 144 56 128 56C100 56 80 76 80 104V152C80 180 100 200 128 200C144 200 160 192 168 176M168 80L178 128L192 96L206 128L216 80"
				stroke="white"
				strokeWidth="16"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}
