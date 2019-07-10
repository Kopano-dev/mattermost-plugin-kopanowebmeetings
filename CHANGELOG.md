# CHANGELOG

## Unreleased

- Deduplicate dependencies
- Bump handlebars from 4.0.11 to 4.1.2 in /webapp


## v0.3.1 (2019-06-06)

- Deduplicate yarn.lock
- Bump axios from 0.17.1 to 0.18.1 in /webapp
- Move Kopano copyright into NOTICE.txt Update license header in doc.go as well
- Merge pull request [#31](https://stash.kopano.io/projects/KWM/repos/meet/issues/31/) in KM/mattermost-plugin-kopanowebmeetings from ~FBARTELS/mattermost-plugin-kopanowebmeetings:license to master


## v0.3.0 (2018-09-19)

- update mattermost statement
- Run lint with Makefile only
- Fixup mattermost-redux dependency
- WIP: Update webapp part of plugin
- Update plugin server side to Mattermost 5.2 changes
- Add auto-reject functionality


## v0.2.0 (2018-07-25)



## v0.2.1 (2018-06-14)

- Add auto-reject functionality
- Revert "Add version hash to bundle URL"
- Add version hash to bundle URL
- add mattermost version hint and annoucement for breaking change
- Add full window functionality
- Serve static files from the correct directory
- Remove left-over file
- Install libpng-dev
- Add example to shared components
- Move CallTimer to shared components and review fixes
- Move to yarn workspaces
- Add tests to shared components
- Move shared components to separate package
- Decouple components from Mattermost


## v0.1.0 (2018-05-25)

- Use the channel name to get the users in a direct message channel
- Add Call Timer component
- Include the users ID as Subject in admin token


## v0.0.3 (2018-03-23)

- Filter current user from profiles in current channel


## v0.0.2 (2018-03-15)

- Update build parameters for Go 1.10 compatibility
- Update to Go 1.9
- Fix version number
- Add Mattermost theme styling to WebMeetings
- Add Jenkinsfile
- Fix Go linter happy
- Add setup instructions


## v0.0.1 (2018-01-19)

- Include version in plugin.json
- Add timeout to internal config request to KWM
- Refresh WebRTC config before it expires
- Clean up code
- Remove unlicensed sound and images
- webapp: Load kwmjs with yarn via package.json
- Mirror own video and use fixed sizes
- Various cleanups and removal of inconsistencies
- Remove ugly white border around own video
- Mute own video always to avoid echo
- Use well defined video resolution
- Implement config retry
- Simplify getConfig call chain
- Add production and development build support
- Add .editorconfig and add a base .eslintrc config
- Implement server side tokens
- Add fetching configuration from server Move kwm functionality to actions Add calling sound and video background image Add eslint configurations Add modal messagebox for errors Add autoplay to fix no sound error
- Switched controller and sidebar. Using KWM for making offer, signalling, and establishing peer connection. Moved everything into the pluggable button. Fixed typo in README.md
- Merge pull request [#4](https://stash.kopano.io/projects/KWM/repos/meet/issues/4/) in KM/mattermost-plugin-kopanowebmeetings from ~SEISENMANN/mattermost-plugin-kopanowebmeetings:longsleep-add-static-folder to master
- Merge pull request [#3](https://stash.kopano.io/projects/KWM/repos/meet/issues/3/) in KM/mattermost-plugin-kopanowebmeetings from ~SEISENMANN/mattermost-plugin-kopanowebmeetings:longsleep-add-client-config to master
- Serve `webapp/static` by the plugin in `/static`
- Add client configuration to server plugin
- Merge pull request [#2](https://stash.kopano.io/projects/KWM/repos/meet/issues/2/) in KM/mattermost-plugin-kopanowebmeetings from ~SEISENMANN/mattermost-plugin-kopanowebmeetings:longsleep-add-server-plugin to master
- Add server side plugin with settings
- Merge pull request [#1](https://stash.kopano.io/projects/KWM/repos/meet/issues/1/) in KM/mattermost-plugin-kopanowebmeetings from ~SEISENMANN/mattermost-plugin-kopanowebmeetings:longsleep-npm-to-yarn-makefile to master
- Reorganize Makefile
- Initial commit

