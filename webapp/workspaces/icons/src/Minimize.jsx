import React from 'react';

const Minimize = color => {
	return (
		<svg className='icon-minimize' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style={{fill: color}}>
			<path d='M16,3.51H12.42V0h-2v4.5a1,1,0,0,0,1,1H16Z' />
			<path d='M3.42,0v3.5H0v2H4.42a1,1,0,0,0,1-1V0Z' />
			<path d='M0,12.51H3.42V16h2v-4.5a1,1,0,0,0-1-1H0Z' />
			<path d='M12.42,16v-3.5H16v-2H11.42a1,1,0,0,0-1,1V16Z' />
		</svg>
	);
};

export default Minimize;