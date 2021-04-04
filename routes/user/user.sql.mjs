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

import { hash_new_password } from './user_hashing.mjs';
import { db } from '../../sql.mjs'

async function get_user_salt(username) {
    const sql = 'SELECT get_user_salt ($1);'
    return await db.oneOrNone(sql, [username])
}

async function create_user_object(username, email, password, salt) {
    const salted_password = hash_new_password(password, salt)
    const sql = 'CALL create_blog_user ($1, $2, $3, $4);'
    return await db.none(sql, [username, email, salted_password, salt])
}

async function check_user_password(username) {
    const sql = 'SELECT get_salt_password_by_username ($1);'
    return await db.one(sql, [username])
}

async function get_user_id(username) {
    const sql = 'SELECT get_user_id_by_username ($1);'
    return await db.one(sql, [username])
}

export {get_user_salt, create_user_object, check_user_password, get_user_id}