# Kopano Web Meetings plugin for Mattermost

This plugin adds WebRTC functionality to the Mattermost WebApp with the help
of Kopano Web Meetings.

## Mattermost compatibility

This plugin is using the plugin framework originally introduced in Mattermost 4.5.0. We recommend keeping up to date with Mattermost, since we are only performing tests against the latest Mattermost release. Please see the Kopano [Mattermost manual](https://documentation.kopano.io/kopano_mattermost_manual/) on how to use our deb and rpm packages to easily stay up to date with your Mattermost installation.

**Important notice:** Mattermost has announced breaking changes to their plugin framework with version 5.2.0. As of writing this our plugin is not yet compatible with the new plugin framework. Once the plugin has been updated it will only be compatible with Mattermost 5.2.0 and upwards. Please check the [download archive](https://download.kopano.io/community/mattermost-plugin-kopanowebmeetings:/) for older releases.

Please see https://pre-release.mattermost.com/core/pl/9f8o1sz9o78jxrehfc7yyf6qhe and https://pre-release.mattermost.com/core/pl/1pzkz16bftb4xpn75xc75b33ch for more details.

## Quick start

Make sure you have Go 1.8 or later installed. This assumes your GOPATH is `~/go` and
you have `~/go/bin` in your $PATH and you have [Glide](https://github.com/Masterminds/glide)
installed as well.

This Mattermost plugin also includes a web part which requires [Yarn](https://yarnpkg.com).
Thus it furthermore assumed that you have `yarn` in your $PATH.

## Building from source

```
mkdir -p ~/go/src/stash.kopano.io/km
cd ~/go/src/stash.kopano.io/km
git clone <THIS-PROJECT> mattermost-plugin-kopanowebmeetings
cd mattermost-plugin-kopanowebmeetings
make dist
```

This will create a tarball inside the `./dist` folder which can be installed as
a Mattermost plugin.

## Runtime requirements

- Mattermost server 4.5 or later running on Linux
- Kopano Webmeetings Server 0.3 or later

### Mattermost server configuration

No special requirements for Mattermost. Just install and enable the plugin and
use the following configuration settings:

#### Kopano Web Meetings Server URL

Point to a https base URL where the Kopano Webmeeting server API is available.
This URL is used by Mattermost Web clients (== the users) to connect with KWM.

Example: https://kopanowebmeetings.local

#### Kopano Web Meetings Server secure internal URL

Point to a URL where the Kopano Webmeeting server API is available. This URL is
used internally by Mattermost server to connect to KWM. If this is a https URL,
then the certificate and hostname must validate, otherwise the connection will
fail.

Example: http://127.0.0.1:8778 (assuming KWM is running on the same host as Mattermost)

#### STUN and TURN

While optional, it is recommended to configure a STUN server. A list of free to
use public STUN servers can be found at https://www.voip-info.org/wiki/view/STUN.

Example: stun:stun.l.google.com:19302

The TURN server configuration, TURN username and its shared secret require a
properly configured TURN server running with the same shared secret. An opensource
TURN server which supportes WebRTC can be found at https://github.com/coturn/coturn.

### Kopano Webmeetings server configuration

Kopano Webmeetings server needs to be available via a HTTPS URL so the Mattermost
Web client can access the KWM API via KWMJS through the Kopano Web Meetings Server URL
as configured in the Mattermost plugin settings.

In addition, the Mattermost plugin also accesses the admin API of KWM through the
Kopano Web Meetings Server secure internal URL as configured in the Mattermost
plugin settings. Make sure to make the KWM admin API only accessible from Mattermost
and start the Kopano Webmeetings `kwmserverd` with the `--admin-tokens-key`
parameter.

```
./bin/kwmserverd serve \
    --listen 127.0.0.1:8778 \
    --admin-tokens-key /path/to/admin-tokens.key
```

## License

See `LICENSE.txt` for licensing information of this project.
