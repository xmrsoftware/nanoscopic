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

import { db } from './../../../sql.mjs'

async function create_blog_post(user_id, blog_id, title, content, meta_desc, free_content, header, slug) {
    const url_slug_encoded = encodeURI(slug)
    const sql = 'CALL create_blog_post($1, $2, $3, $4, $5, $6, $7, $8);'
    return await db.none(sql, [user_id, blog_id, title, content, meta_desc, free_content, header,
        url_slug_encoded])
}

async function list_all_blog_posts(user_id) {
    const sql = 'SELECT * FROM get_post_and_blog_detail($1);'
    return await db.manyOrNone(sql, [user_id])
}

export {create_blog_post, list_all_blog_posts}