import {Client4} from 'mattermost-redux/client';

export const initWebrtc = (userId, isCalling) => (AppDispatcher, actionType) => {
    AppDispatcher.handleServerAction({
        type: actionType,
        user_id: userId,
        is_calling: isCalling
    });
}

export const handle = message => (AppDispatcher) => {
    AppDispatcher.handleServerAction({
        type: message.action,
        message
    });
}

export function webrtcToken(success, error) {
    Client4.webrtcToken().then(
        (data) => {
            if (success) {
                success(data);
            }
        }
    ).catch(
        () => {
            if (error) {
                error();
            }
        }
    );
}
