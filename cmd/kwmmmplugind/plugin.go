/*
 * Copyright 2017 Kopano and its licensors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync/atomic"

	"github.com/mattermost/mattermost-server/plugin"
)

// Plugin defines the Mattermost plugin interface.
type Plugin struct {
	api plugin.API

	configuration atomic.Value
}

// OnActivate implements the Mattermost plugin interface.
func (p *Plugin) OnActivate(api plugin.API) error {
	p.api = api
	if err := p.OnConfigurationChange(); err != nil {
		return err
	}

	config := p.config()
	if err := config.IsValid(); err != nil {
		return err
	}

	return nil
}

func (p *Plugin) config() *Configuration {
	return p.configuration.Load().(*Configuration)
}

// OnConfigurationChange implements the Mattermost plugin interface.
func (p *Plugin) OnConfigurationChange() error {
	var configuration Configuration
	err := p.api.LoadPluginConfiguration(&configuration)
	p.configuration.Store(&configuration)
	return err
}

func (p *Plugin) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	config := p.config()
	if err := config.IsValid(); err != nil {
		http.Error(rw, "This plugin is not configured.", http.StatusNotImplemented)
		return
	}

	switch {
	case req.URL.Path == "/api/v1/config":
		p.handleConfig(rw, req)

	case strings.HasPrefix(req.URL.Path, "/static"):
		p.handleStatic(rw, req)

	default:
		http.NotFound(rw, req)
	}
}

func (p *Plugin) handleConfig(rw http.ResponseWriter, req *http.Request) {
	userID := req.Header.Get("Mattermost-User-Id")

	if userID == "" {
		http.Error(rw, "", http.StatusUnauthorized)
		return
	}

	result, err := p.getClientConfiguration(userID)
	if err != nil {
		log.Println("kwm plugin error while getting client configration", err)
		http.Error(rw, "", http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)

	enc := json.NewEncoder(rw)
	enc.SetIndent("", "  ")

	enc.Encode(result)
}

func (p *Plugin) getClientConfiguration(id string) (*ClientConfiguration, error) {
	config := p.config()
	result := &ClientConfiguration{
		KWMServerURL: config.KWMServerURL,
		Token:        "not-implemented",
		StunURI:      config.StunURI,

		ExpiresIn: 3600, // NOTE(longsleep): Add to configuration.
	}

	if config.TurnURI != "" {
		result.TurnURI = config.TurnURI
		if config.TurnSharedKey != "" {
			result.TurnUsername = generateTurnUsername(config.TurnUsername)
			result.TurnPassword = generateTurnPassword(result.TurnUsername, config.TurnSharedKey)
		}
	}

	return result, nil
}

func (p *Plugin) handleStatic(rw http.ResponseWriter, req *http.Request) {
	// TODO(longsleep): Add caching headers.
	http.StripPrefix("/static/", http.FileServer(http.Dir("./plugins/kopanowebmeetings/webapp/static"))).ServeHTTP(rw, req)
}
