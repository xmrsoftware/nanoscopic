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
import {show_blog_post, get_username_from_user_id, get_latest_ten_blog_posts} from './post.sql.mjs'

const router = express.Router()
const md = new Markdown()

router.get('/show/:UserID/:PostID/:URLSlug/', (req, res) => {
    show_blog_post(req.params.UserID, req.params.PostID).then(result => {
        get_username_from_user_id(req.params.UserID).then(username_obj => {
            res.render('public/post/show_blog_post', {
                logged_in: req.session.logged_in,
                author: username_obj.username,
                title: result.blog_post_title,
                header: md.render(result.blog_post_header),
                content: md.render(result.blog_post_content),
                date_published: result.blog_post_published,
                date_updated: result.blog_post_updated,
                free_content: md.render(result.blog_post_free_content),
                meta_desc: result.blog_post_meta_description,
                user_id: req.session.user_id,
                author_user_id: req.params.UserID,
                layout: 'main'
            })
        })
    })
})

router.get('/:UserID/:BlogID/latest/', (req, res) => {
    get_latest_ten_blog_posts(req.params.BlogID, req.params.UserID).then(results => {
        res.render('public/post/show_blog_post_list', {
            logged_in: req.session.logged_in,
            layout: 'main',
            blog_post_header: results.blog_post_header,
            blog_post_published: results.blog_post_published,
            blog_post_id: results.blog_post_id,
            blog_posts: results
        })
    })
})

export {router}