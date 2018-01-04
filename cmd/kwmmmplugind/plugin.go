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
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
	"sync/atomic"
	"time"

	"github.com/mattermost/mattermost-server/plugin"
	kwmAPIv1 "stash.kopano.io/kwm/kwmserver/signaling/api-v1"
)

// Plugin defines the Mattermost plugin interface.
type Plugin struct {
	api        plugin.API
	httpClient *http.Client

	configuration atomic.Value
}

// NewPlugin creates a new plugin.
func NewPlugin(httpTransport http.RoundTripper) *Plugin {
	if httpTransport == nil {
		httpTransport = &http.Transport{
			Proxy: http.ProxyFromEnvironment,
			DialContext: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
				DualStack: true,
			}).DialContext,
			MaxIdleConns:          100,
			IdleConnTimeout:       90 * time.Second,
			TLSHandshakeTimeout:   10 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,
		}
	}

	httpClient := &http.Client{
		Timeout:   30 * time.Second,
		Transport: httpTransport,
	}

	return &Plugin{
		httpClient: httpClient,
	}
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

	token, err := p.getWebMeetingsToken(config, "")
	if err != nil {
		return nil, err
	}

	result := &ClientConfiguration{
		KWMServerURL: config.KWMServerURL,
		Token:        token,
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

func (p *Plugin) getWebMeetingsToken(config *Configuration, id string) (*kwmAPIv1.AdminAuthToken, error) {
	data := &kwmAPIv1.AdminAuthToken{
		Type: "Token",
	}
	payload, _ := json.MarshalIndent(data, "", "\t")

	req, _ := http.NewRequest("POST", config.KWMServerInternalURL+"/api/v1/admin/auth/tokens", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	//req.Header.Set("Authorization", "Bearer "+config.AdminSecret)

	if response, err := p.httpClient.Do(req); err != nil {
		return nil, err
	} else if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected HTTP response: %d", response.StatusCode)
	} else {
		var token kwmAPIv1.AdminAuthToken
		if err := json.NewDecoder(response.Body).Decode(&token); err != nil {
			return nil, err
		}

		return &token, nil
	}
}

func (p *Plugin) handleStatic(rw http.ResponseWriter, req *http.Request) {
	// TODO(longsleep): Add caching headers.
	http.StripPrefix("/static/", http.FileServer(http.Dir("./plugins/kopanowebmeetings/webapp/static"))).ServeHTTP(rw, req)
}
