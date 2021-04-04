'use strict';

/*
   Copyright 2021 XMR VPS Ltd

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

function check_if_logged_in(req, res) {
    if (req.session === null || req.session === undefined || req.session.logged_in !== true) {
        res.status(403).send('<div id="403_status_code">You are not authorised to see this URL</div>')
    }
}

export {check_if_logged_in}