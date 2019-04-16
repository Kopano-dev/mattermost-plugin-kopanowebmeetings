/*
 * Copyright 2017-2019 Kopano and its licensors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package main

import (
	kwmAPIv1 "stash.kopano.io/kwm/kwmserver/signaling/api-v1"
)

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
