import React from 'react';

export const cameraOutlined = color => {
	return (
		<svg className='icon-camera-outline' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12' style={{fill: color}}>
			<path d='M15.1,1.45,12,3V1a1,1,0,0,0-1-1H1A1,1,0,0,0,0,1V11a1,1,0,0,0,1,1H11a1,1,0,0,0,1-1V9l3.1,1.55A.57.57,0,0,0,16,10V2A.57.57,0,0,0,15.1,1.45ZM12.9,7.21A2,2,0,0,0,12,7H10.5a.5.5,0,0,0-.5.5V10H2V2h8V4.5a.5.5,0,0,0,.5.5H12a2,2,0,0,0,.9-.21L14,4.24V7.76Z' />
		</svg>
	);
};

export const cameraFilled = () => (
	<svg className='icon-camera' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'>
		<path d='M15.1,1.45,12,3V1a1,1,0,0,0-1-1H1A1,1,0,0,0,0,1V11a1,1,0,0,0,1,1H11a1,1,0,0,0,1-1V9l3.1,1.55A.57.57,0,0,0,16,10V2A.57.57,0,0,0,15.1,1.45Z' />
	</svg>
);

export const pickupPhone = () => (
	<svg className='icon-pickup' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
		<path d='M20.69,26.56a17.09,17.09,0,0,0,4.09,3.31l2.6-2.36a1.14,1.14,0,0,1,1.18-.21,13.34,13.34,0,0,0,3.57.83,1.15,1.15,0,0,1,.77.37,1.09,1.09,0,0,1,.29.81L33,33.26a1.11,1.11,0,0,1-.37.79,1.14,1.14,0,0,1-.82.29,19.2,19.2,0,0,1-17.74-19.6,1.11,1.11,0,0,1,.37-.79,1.09,1.09,0,0,1,.81-.29l4,.2a1.09,1.09,0,0,1,.78.37,1.11,1.11,0,0,1,.3.8,12.79,12.79,0,0,0,.47,3.63,1.14,1.14,0,0,1-.33,1.15l-2.6,2.36A17.15,17.15,0,0,0,20.69,26.56Z' />
	</svg>
);

export const hangupPhone = () => (
	<svg className='icon-hangup' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
		<path d='M24.35,20.89a14.53,14.53,0,0,0-4.54.72v3.06a1,1,0,0,1-.56.89,12,12,0,0,0-2.63,1.83,1,1,0,0,1-.69.28,1,1,0,0,1-.7-.29l-2.44-2.44a1,1,0,0,1,0-1.41,16.81,16.81,0,0,1,23.13,0,1,1,0,0,1,.29.7,1,1,0,0,1-.29.7l-2.45,2.45a1,1,0,0,1-1.38,0,11.22,11.22,0,0,0-2.64-1.83,1,1,0,0,1-.55-.89V21.6A14.84,14.84,0,0,0,24.35,20.89Z' />
	</svg>
);

export const openFullScreen = () => (
	<svg className='icon-openfullscreen' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
		<path d='M10.5,2H14v3.5h2V1a1,1,0,0,0-1-1H10.5Z' />
		<path d='M2,5.49V2H5.5V0H1A1,1,0,0,0,0,1v4.5Z' />
		<path d='M5.5,14H2v-3.5H0V15a1,1,0,0,0,1,1H5.5Z' />
		<path d='M14,10.49V14H10.5v2H15a1,1,0,0,0,1-1v-4.5Z' />
	</svg>
);

export const closeFullScreen = () => (
	<svg className='icon-closefullscreen' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
		<path d='M16,3.51H12.42V0h-2v4.5a1,1,0,0,0,1,1H16Z' />
		<path d='M3.42,0v3.5H0v2H4.42a1,1,0,0,0,1-1V0Z' />
		<path d='M0,12.51H3.42V16h2v-4.5a1,1,0,0,0-1-1H0Z' />
		<path d='M12.42,16v-3.5H16v-2H11.42a1,1,0,0,0-1,1V16Z' />
	</svg>
);

export default {
	cameraOutlined,
	cameraFilled,
	pickupPhone,
	hangupPhone,
	openFullScreen,
	closeFullScreen,
};
