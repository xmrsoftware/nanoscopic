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
import {create_blog_post, get_blog_post, list_all_blog_posts, update_blog_post, delete_blog_post} from './post.sql.mjs'
import { get_blog_id_from_user_id } from './../page/page.sql.mjs'
import { check_if_logged_in } from './../../../utils.mjs'

const router = express.Router()

router.get('/', (req, res) => {
    check_if_logged_in(req, res)

    list_all_blog_posts(req.session.user_id).then(result => {
        if (result === null || result === undefined || result.length === 0) {
            res.redirect('/cp/post/create/')
        }

        res.render('cp/post/cp_list_blog_posts', {
            title: 'List of all of your blog posts',
            meta_desc: 'List of all of your blog posts.',
            layout: 'cp',
            blog_posts: result,
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Unable to list all blog posts: ' + error.toString())
        res.status(500).send('Unable to list all blog posts: ' + error.toString())
    })
})

router.get('/create/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog_id_from_user_id(req.session.user_id).then(result => {
        if (result === null || result === undefined || result.length === 0) {
            res.redirect('/cp/blog/create/?return_url=/cp/post/create/')
        }

        res.render('cp/post/cp_new_blog_post', {
            title: 'Create a blog post',
            meta_desc: 'Create a blog post',
            layout: 'cp',
            blog_list: result,
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Unable to create a blog post: ' + error.toString())
        res.status(500).send('Unable to create a blog post: ' + error.toString())
    })
})

router.post('/create/', (req, res) => {
    check_if_logged_in(req, res)

    create_blog_post(req.session.user_id, req.body.blog, req.body.title, req.body.content, req.body.meta_desc,
        req.body.free_content, req.body.header, req.body.slug).then(result => {
            res.redirect('/cp/post/')
    }).catch(error => {
        console.debug('Error creating blog post: ' + error.toString())
        res.status(500).send('Error creating blog post: ' + error.toString())
    })
})

router.get('/show/:BlogID/:PostID/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog_post(req.session.user_id, req.params.PostID).then(results => {
        res.render('cp/post/cp_display_post', {
            title: results.blog_post_title,
            header: results.blog_post_header,
            content: results.blog_post_content,
            slug: results.blog_post_url_slug,
            meta_desc: results.blog_post_meta_description,
            free_content: results.blog_post_free_content,
            blog_id: req.params.BlogID,
            post_id: req.params.PostID,
            layout: 'cp',
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Error showing blog post: ' + error.toString())
        res.status(500).send('Error showing blog post: ' + error.toString())
    })
})

router.get('/update/:BlogID/:PostID/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog_post(req.session.user_id, req.params.PostID).then(results => {
        res.render('cp/post/cp_update_post', {
            title: results.blog_post_title,
            header: results.blog_post_header,
            content: results.blog_post_content,
            free_content: results.blog_post_free_content,
            slug: results.blog_post_url_slug,
            meta_desc: results.blog_post_meta_description,
            blog_id: req.params.BlogID,
            post_id: req.params.PostID,
            layout: 'cp',
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Error updating blog post: ' + error.toString())
        res.status(500).send('Error updating blog post: ' + error.toString())
    })
})

router.post('/update/:BlogID/:PostID/', (req, res) => {
    check_if_logged_in(req, res)

    update_blog_post(req.session.user_id, req.params.PostID, req.body.title, req.body.content, req.body.meta_desc,
        req.body.free_content, req.body.header, req.body.slug).then(results => {
            res.redirect('/cp/post/')
    }).catch(error => {
        console.debug('Error updating blog post: ' + error.toString())
        res.status(500).send('Error updating blog post: ' + error.toString())
    })
})

router.get('/delete/confirm/:BlogID/:PostID/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/post/cp_post_delete_confirm', {
        title: 'Confirm deletion of post',
        meta_desc: 'Confirm deletion of post',
        layout: 'cp',
        blog_id: req.params.BlogID,
        post_id: req.params.PostID,
        logged_in: req.session.logged_in
    })
})

router.post('/delete/:BlogID/:PostID/', (req, res) => {
    check_if_logged_in(req, res)

    delete_blog_post(req.session.user_id, req.params.PostID).then(results => {
        res.redirect('/')
    }).catch(error => {
        console.debug('Error deleting blog post: ' + error.toString())
        res.status(500).send('Error deleting blog post: ' + error.toString())
    })
})

export {router}