/* eslint-disable no-magic-numbers */
const defaultConstraints = {
	audio: true,
	video: {
		width: 640,
		height: 480,
		frameRate: {
			ideal: 60,
		},
	},
};
defaultConstraints.video = true;
/* eslint-enable no-magic-numbers */

export const getUserMedia = constraints => navigator.mediaDevices.getUserMedia(constraints || defaultConstraints);

export const stopUserMedia = localStream => {
	for (const track of localStream.getTracks()) {
		track.stop();
	}
};
