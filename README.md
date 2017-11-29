# Kopano Web Meetings plugin for Mattermsot

This plugin adds WebRTC functionality to the Mattermost WebApp.

## Template

Description of the plugin specific files.

### plugin.json

Metadata for your plugin that the Mattermost server will read. Feel free to modify the values but do not change the structure.

### Makefile

A pre-built Makefile containing some useful commands:

* `make build` - Build your plugin for distribution
* `make check-style` - Check the style of your plugin's code
* `make clean` - Clean temporary files, old distributables, etc.

## Installing the plugin
After building, either upload the tarball found in dist/ to your Mattermost server through the the System Console of
the Mattermost WebApp (Plugins > Management), or upload the contents of the tarball to the 'plugins' directory of your
Mattermost server.

Don't forget to activate the plugin in the 'System Console' of the Mattermost WebApp.
