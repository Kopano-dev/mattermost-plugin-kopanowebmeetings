const defaultConstraints = {
	audio: true,
	video: {
		width: 640,
		height: 480,
		frameRate: {
			ideal: 10
		}
	}
};

export const getUserMedia = constraints => navigator.mediaDevices.getUserMedia(constraints||defaultConstraints);

export const stopUserMedia = localStream => {
	for (let track of localStream.getTracks()) {
		track.stop();
	}
};
