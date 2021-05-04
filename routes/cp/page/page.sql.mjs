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

async function list_all_blog_pages(user_id) {
    const sql = 'SELECT * FROM get_page_and_blog_detail($1);'
    return await db.manyOrNone(sql, [user_id])
}

async function get_blog_id_from_user_id(user_id) {
    const sql = 'SELECT * FROM get_blog_id_from_user_id($1);'
    return await db.manyOrNone(sql, [user_id])
}

async function create_blog_page(blog_id, blog_user_id, blog_page_title, blog_page_content, blog_page_meta_description) {
    const sql = 'CALL create_blog_page($1, $2, $3, $4, $5);'
    return await db.none(sql, [blog_id, blog_user_id, blog_page_title, blog_page_content,
        blog_page_meta_description])
}

async function delete_blog_page(blog_id, blog_user_id, blog_page_id) {
    const sql = 'CALL delete_blog_page($1, $2, $3);'
    return await db.none(sql, [blog_id, blog_user_id, blog_page_id])
}

async function update_blog_page(blog_id, blog_user_id, blog_page_id, blog_page_title, blog_page_content,
                                blog_page_meta_description) {
    const sql = 'CALL update_blog_page($1, $2, $3, $4, $5, $6);'
    return await db.none(sql, [blog_id, blog_user_id, blog_page_id, blog_page_title, blog_page_content,
        blog_page_meta_description])
}

async function get_blog_page(user_id, page_id) {
    const sql = 'SELECT * FROM get_blog_page($1, $2);'
    return await db.oneOrNone(sql, [user_id, page_id])
}

export {list_all_blog_pages, get_blog_id_from_user_id, create_blog_page, delete_blog_page, update_blog_page,
    get_blog_page}