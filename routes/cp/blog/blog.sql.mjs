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

import markdown from 'markdown-it'
import { db } from './../../../sql.mjs'

const { render } = markdown

async function create_blog(blog_user_id, name, description) {
    const sql = 'CALL create_blog ($1, $2, $3);'
    return await db.none(sql, [blog_user_id, render(name), render(description)])
}

async function get_blog(blog_id, blog_user_id) {
    const sql = 'SELECT get_blog ($1, $2);'
    return await db.oneOrNone(sql, [blog_id, blog_user_id])
}

async function delete_blog(blog_id, blog_user_id) {
    const sql = 'CALL delete_blog ($1, $2);'
    return await db.none(sql, [blog_id, blog_user_id])
}

async function update_blog(blog_id, blog_user_id, name, description) {
    const sql = 'CALL update_blog function ($1, $2, $3, $4);'
    return await db.none(sql, [blog_id, blog_user_id, render(name), render(description)])
}

async function list_blogs(blog_user_id) {
    const sql = 'SELECT get_all_user_blogs ($1);'
    return await db.manyOrNone(sql, [blog_user_id])
}

export {create_blog, get_blog, delete_blog, update_blog, list_blogs}