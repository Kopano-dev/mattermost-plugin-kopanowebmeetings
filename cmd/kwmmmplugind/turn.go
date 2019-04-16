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
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"time"
)

const turnTTL = 3600 // XXX(longsleep): Do not hardcode this.

func generateTurnUsername(username string) string {
	timestamp := int32(time.Now().Unix()) + turnTTL
	return fmt.Sprintf("%d:%s", timestamp, username)
}

func generateTurnPassword(username string, secret string) string {
	key := []byte(secret)
	h := hmac.New(sha1.New, key)
	h.Write([]byte(username))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}
