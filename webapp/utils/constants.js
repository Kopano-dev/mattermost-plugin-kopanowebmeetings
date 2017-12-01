import keyMirror from 'key-mirror';

export const Actions = keyMirror({
    KWM_MMREDUX_STATE_CHANGE: null,
    KWM_RELAY_ACTION: null,

    KWM_CONN_STATUS_CHANGE: null,
    KWM_ERROR: null,

    KWM_OPEN_SIDEBAR: null,
    KWM_CLOSE_SIDEBAR: null,

    KWM_SHOW_CALL_NOTIFICATION: null,
    KWM_HIDE_CALL_NOTIFICATION: null,

    KWM_ADD_CALLER: null,
    KWM_UPDATE_CALLER: null,
    KWM_REMOVE_CALLER: null,
    KWM_REMOVE_ALL_CALLERS: null,
});

export const UserStatuses = {
    OFFLINE: 'offline',
    AWAY: 'away',
    ONLINE: 'online',
    DND: 'dnd'
};

const Constants = {
    Actions,
    UserStatuses,
    ...keyMirror({
        KWM_SIDEBAR_SIZE_NONE: null,
        KWM_SIDEBAR_SIZE_NORMAL: null,
        KWM_SIDEBAR_SIZE_EXPANDED: null,

        KWM_CONN_STATUS_NOT_CONNECTED: null,
        KWM_CONN_STATUS_CONNECTING: null,
        KWM_CONN_STATUS_CONNECTED: null,
        KWM_CONN_STATUS_RECONNECTING: null,
    }),

    OVERLAY_TIME_DELAY: 400,
};

export default Constants;
