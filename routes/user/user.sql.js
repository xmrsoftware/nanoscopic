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

const pg = require('./sql')

const db = pg.get_database_connection()

async function create_user_object(username, email, password, salt) {
    const sql = "CALL create_blog_user($1, $2, $3, $4)"
    await db.none(sql, [username, email, password, salt])
}

exports.create_user_object = create_user_object