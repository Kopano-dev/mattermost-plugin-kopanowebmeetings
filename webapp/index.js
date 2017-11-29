// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import WebrtcSidebar from 'components/webrtc_sidebar.jsx';

class PluginClass {
    initialize(registerComponents, store) {
        registerComponents({WebrtcSidebar});
    }
}

global.window.plugins['kopanowebmeetings'] = new PluginClass();
