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

const md = require('markdown-it')()
const pg = require('./../../../sql')

const db = pg.get_database_connection()

async function create_blog(blog_user_id, name, description) {
    const sql = 'CALL create_blog ($1, $2, $3);'
    return await db.none(sql, [blog_user_id, md.render(name), md.render(description)])
}

async function get_blog(blog_id, blog_user_id) {
    const sql = 'CALL get_blog ($1, $2);'
    return await db.oneOrNone(sql, [blog_id, blog_user_id])
}

async function delete_blog(blog_id, blog_user_id) {
    const sql = 'CALL delete_blog ($1, $2);'
    return await db.none(sql, [blog_id, blog_user_id])
}

async function update_blog(blog_id, blog_user_id, name, description) {
    const sql = 'CALL update_blog function ($1, $2, $3, $4);'
    return await db.none(sql, [blog_id, blog_user_id, md.render(name), md.render(description)])
}

async function list_blogs(blog_user_id) {
    const sql = 'CALL get_all_user_blogs ($1);'
    return await db.manyOrNone(sql, [blog_user_id])
}

exports.create_blog = create_blog
exports.get_blog = get_blog
exports.delete_blog = delete_blog
exports.update_blog = update_blog
exports.list_blogs = list_blogs