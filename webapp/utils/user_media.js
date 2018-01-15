const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;
const MIN_ASPECT = 1.777;
const MAX_ASPECT = 1.778;

const defaultConstraints = {
	audio: true,
	video: {
		minAspectRatio: MIN_ASPECT,
		maxAspectRatio: MAX_ASPECT,
		width: VIDEO_WIDTH,
		height: VIDEO_HEIGHT,
	},
};

export const getUserMedia = constraints => navigator.mediaDevices.getUserMedia(constraints || defaultConstraints);

export const stopUserMedia = localStream => {
	for (const track of localStream.getTracks()) {
		track.stop();
	}
};
