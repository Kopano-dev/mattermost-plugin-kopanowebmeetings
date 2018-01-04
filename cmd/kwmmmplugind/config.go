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
	"fmt"

	kwmAPIv1 "stash.kopano.io/kwm/kwmserver/signaling/api-v1"
)

// A Configuration holds the configuration data.
type Configuration struct {
	KWMServerURL         string
	KWMServerInternalURL string
	StunURI              string
	TurnURI              string
	TurnUsername         string
	TurnSharedKey        string
}

// IsValid returns an error when the accociated configuration is not valid.
func (c *Configuration) IsValid() error {
	var err error

	for {
		if c.KWMServerURL == "" {
			err = fmt.Errorf("KWMServerURL is empty")
			break
		}
		if c.KWMServerInternalURL == "" {
			err = fmt.Errorf("KWMServerInternalURL is empty")
			break
		}

		break
	}

	return err
}

// ClientConfiguration is the struct to hold client configuration data.
type ClientConfiguration struct {
	KWMServerURL string `json:"kwmserver_url"`
	StunURI      string `json:"stun_uri,omitempty"`
	TurnURI      string `json:"turn_uri,omitempty"`
	TurnUsername string `json:"turn_username,omitempty"`
	TurnPassword string `json:"turn_password,omitempty"`
	ExpiresIn    uint64 `json:"expires_in"`

	Token *kwmAPIv1.AdminAuthToken `json:"token,omitempty"`
}
