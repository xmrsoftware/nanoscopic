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

import express from 'express'
import Markdown from 'markdown-it'
import {get_user_blog} from './blog.sql.mjs'
import {get_username_from_user_id} from "../post/post.sql.mjs";

const router = express.Router()
const md = new Markdown()

router.get('/show/:UserID/:BlogID/:URLSlug/', (req, res) => {
    get_username_from_user_id(req.params.UserID).then(username_obj => {
        get_user_blog(req.params.BlogID, req.params.UserID).then(results => {
            res.render('public/blog/show_blog', {
                logged_in: req.session.logged_in,
                layout: 'main',
                title: results.blog_title,
                blog_id: req.params.BlogID,
                blog_user_id: results.blog_user_id,
                blog_header: results.blog_header,
                blog_created: results.blog_created,
                blog_description: results.blog_description,
                author: username_obj.username
            })
        })
    })
})

export {router}