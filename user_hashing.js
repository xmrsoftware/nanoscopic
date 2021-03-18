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

const crypto = require('crypto')

function hash_new_password(password, salt) {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    return hash.digest('hex')
}

function check_password_hash(password, db_salted_password) {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const salted_password = hash.digest('hex')
    return db_salted_password === salted_password;
}

exports.hash_new_password = hash_new_password
exports.check_password_hash = check_password_hash