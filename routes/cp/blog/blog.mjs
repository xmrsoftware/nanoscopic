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
import { create_blog, list_blogs, update_blog, delete_blog, get_blog } from './blog.sql.mjs'
import { check_if_logged_in } from './../../../utils.mjs'

const md = new Markdown()

const router = express.Router()

router.get('/create/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog', {
        title: 'Create a new Nanoscopic blog',
        meta_desc: 'Create a new Nanoscopic blog.',
        layout: 'cp',
        form_css: true,
        logged_in: req.session.logged_in,
        return_url: req.query.return_url
    })
})

router.post('/create/', (req, res) => {
    check_if_logged_in(req, res)

    create_blog(req.session.user_id, req.body.description, req.body.url_slug, req.body.title, req.body.header,
        req.body.meta_desc)
        .then(() => {
            if (req.query.return_url) {
                res.redirect(req.query.return_url)
            }
            res.redirect('/cp/blog/')
        }).catch(error => {
            console.debug('Error creating blog ' + error.toString())
            res.status(500).send('Error creating blog: ' + error.toString())
    })
})

router.get('/delete/:BlogID/confirm/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog(req.params.BlogID, req.session.user_id).then(result => {
        res.render('cp/blog/cp_delete_blog_confirm', {
            title: 'Are you sure you wish to delete the blog called ' + result.blog_title + '?',
            meta_desc: 'Are you sure you wish to delete the blog called ' + result.blog_title + '?',
            layout: 'cp',
            form_css: true,
            logged_in: req.session.logged_in,
            blog_id: result.blog_id,
            blog_title: result.blog_title,
            blog_header: result.blog_header
        })
    }).catch(error => {
        console.debug('Unable to confirm delete of blog: ' + error.toString())
        res.status(500).send('Unable to confirm delete of blog: ' + error.toString())
    })
})

router.post('/delete/:BlogID/', (req, res) => {
    check_if_logged_in(req, res)

    delete_blog(req.params.BlogID, req.session.user_id)
        .then(result => {
            res.redirect('/cp/blog/')
        }).catch(error => {
            console.debug('Unable to delete blog: ' + error.toString())
            res.status(500).send('Unable to delete blog: ' + error.toString())
        })
})

router.get('/update/:BlogID/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog(req.params.BlogID, req.session.user_id).then(result => {
        res.render('cp/blog/cp_update_blog', {
            title: result.blog_title,
            meta_desc: result.blog_meta_description,
            layout: 'cp',
            form_css: true,
            logged_in: req.session.logged_in,
            blog_id: result.blog_id,
            blog_title: result.blog_title,
            blog_header: result.blog_header,
            blog_url_slug: result.blog_url_slug,
            blog_meta_desc: result.blog_meta_description,
            blog_description: result.blog_description
        })
    }).catch(error => {
        console.debug('Error updating blog: ' + error.toString())
        res.status(500).send('Error updating blog: ' + error.toString())
    })
})

router.post('/update/:BlogID/', (req, res) => {
    check_if_logged_in(req, res)

    update_blog(req.params.BlogID, req.session.user_id, req.body.title, req.body.header, req.body.description,
        req.body.url_slug, req.body.meta_desc)
        .then(result => {
            res.redirect('/cp/blog/')
        }).catch(error => {
            console.debug('Error updating blog ' + error.toString())
            res.status(500).send('Error updating blog: ' + error.toString())
    })
})

router.get('/', (req, res) => {
    check_if_logged_in(req, res)

    list_blogs(req.session.user_id).then(result => {
        if (result.length === 0) {
            result = false
        }
        res.render('cp/blog/cp_list_all_blog', {
            title: 'List of all of your blogs',
            meta_desc: 'List of all of your blogs.',
            layout: 'cp',
            logged_in: req.session.logged_in,
            blog_list: result
        })
        }).catch(error => {
            console.debug('Unable to retrieve list of blogs for user: ' + req.session.username + ' ' + error.toString())
            res.status(500).send('Unable to retrieve list of blogs for user ' +
                req.session.username + ' ' + error.toString())
    })
})

router.get('/show/:BlogID/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog(req.params.BlogID, req.session.user_id).then(result => {
        res.render('cp/blog/cp_display_blog', {
            title: result.blog_title,
            meta_desc: result.blog_meta_description,
            layout: 'cp',
            logged_in: req.session.logged_in,
            blog_id: result.blog_id,
            blog_header: result.blog_header,
            blog_description: md.render(result.blog_description)
        })
    }).catch(error => {
        console.debug('Unable to show blog with ID: ' + req.params.BlogID.toString() + ' ' + error.toString())
        res.status(500).send('Unable to show blog with ID ' + req.params.BlogID.toString() + ' ' + error.toString())
    })
})

export {router}