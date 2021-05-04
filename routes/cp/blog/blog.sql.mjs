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

async function create_blog(blog_user_id, description, url_slug, title, header, meta_desc) {
    const url_slug_encoded = encodeURI(url_slug)
    const sql = 'CALL create_blog ($1, $2, $3, $4, $5, $6);'
    return await db.none(sql, [blog_user_id, description, url_slug_encoded, title, header, meta_desc])
}

async function get_blog(blog_id, blog_user_id) {
    const sql = 'SELECT get_blog ($1, $2);'
    return await db.oneOrNone(sql, [blog_id.toString(), blog_user_id.toString()])
}

async function delete_blog(blog_id, blog_user_id) {
    const sql = 'CALL delete_blog ($1, $2);'
    return await db.none(sql, [blog_id, blog_user_id])
}

async function update_blog(blog_id, blog_user_id, title, header, description, url_slug, meta_desc) {
    const url_slug_encoded = encodeURI(url_slug)
    const sql = 'CALL update_blog ($1, $2, $3, $4, $5, $6, $7);'
    return await db.none(sql, [blog_id, blog_user_id, title, header, description, url_slug_encoded, meta_desc])
}

async function list_blogs(blog_user_id) {
    const sql = 'SELECT * FROM get_all_user_blogs ($1);'
    return await db.manyOrNone(sql, [blog_user_id])
}

export {create_blog, get_blog, delete_blog, update_blog, list_blogs}