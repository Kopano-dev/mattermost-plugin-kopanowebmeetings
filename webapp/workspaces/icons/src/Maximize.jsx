import React from 'react';

const Maximize = color => {
	return (
		<svg className='icon-maximize' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style={{fill: color}}>
			<path d='M10.5,2H14v3.5h2V1a1,1,0,0,0-1-1H10.5Z' />
			<path d='M2,5.49V2H5.5V0H1A1,1,0,0,0,0,1v4.5Z' />
			<path d='M5.5,14H2v-3.5H0V15a1,1,0,0,0,1,1H5.5Z' />
			<path d='M14,10.49V14H10.5v2H15a1,1,0,0,0,1-1v-4.5Z' />
		</svg>
	);
};

export default Maximize;