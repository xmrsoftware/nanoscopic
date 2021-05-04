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
import { list_all_blog_pages, get_blog_id_from_user_id, create_blog_page, delete_blog_page } from './page.sql.mjs';
import { update_blog_page, get_blog_page } from './page.sql.mjs';
import { check_if_logged_in } from './../../../utils.mjs'

const router = express.Router()
const md = new Markdown()

router.get('/', (req, res) => {
    check_if_logged_in(req, res)

    list_all_blog_pages(req.session.user_id).then(result => {
        if (result === undefined || result === null || result.length === 0) {
            res.redirect('/cp/page/create/')
        }

        res.render('cp/page/cp_list_blog_pages', {
            title: 'List of all of your pages on Nanoscopic',
            meta_desc: 'List of all of your pages on Nanoscopic',
            layout: 'cp',
            blog_pages: result,
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Unable to list all blog pages: ' + error.toString())
        res.status(500).send('Unable to list all blog pages ' + error.toString())
    })
})

router.get('/create/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog_id_from_user_id(req.session.user_id).then(result => {
        if (result === undefined || result === null || result.length === 0) {
            res.redirect('/cp/blog/create/?return_url=/cp/page/create/')
        }

        res.render('cp/page/cp_new_page', {
            title: 'Create a blog page',
            meta_desc: 'Create a blog page',
            layout: 'cp',
            blogs: result,
            logged_in: req.session.logged_in
        })
    }).catch(error => {
        console.debug('Unable to get blog ID from user ID: ' + error.toString())
        res.status(500).send('Unable to get blog ID from user ID: ' + error.toString())
    })
})

router.post('/create/', (req, res) => {
    check_if_logged_in(req, res)

    create_blog_page(req.body.blog, req.session.user_id, req.body.title, req.body.content, req.body.meta_desc)
        .then(result => {
            res.redirect('/')
        }).catch(error => {
            console.debug('Unable to create blog page: ' + error.toString())
            res.status(500).send('Unable to create blog page: ' + error.toString())
        })
})

router.get('/delete/confirm/:BlogID/:PageID/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp_page_delete_confirm', {
        title: 'Confirm deletion of page',
        meta_desc: 'Confirm deletion of page',
        layout: 'cp',
        blog_id: req.params.BlogID,
        page_id: req.params.PageID,
        logged_in: req.session.logged_in
    })
})

router.post('/delete/:BlogID/:PageID/', (req, res) => {
    check_if_logged_in(req, res)

    delete_blog_page(req.session.user_id, req.params.BlogID, req.params.PageID).then(result => {
        res.redirect('/')
    }).catch(error => {
        console.debug('Error deleting blog page: ' + error.toString())
        res.status(500).send('Error deleting blog page: ' + error.toString())
    })
})

router.get('/update/:BlogID/:PageID/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/page/cp_update_page', {
        title: 'Update your page',
        meta_desc: 'Update your page',
        layout: 'cp',
        blog_id: req.params.BlogID,
        page_id: req.params.PageID,
        logged_in: req.session.logged_in
    })
})

router.post('/update/:BlogID/:PageID/', (req, res) => {
    check_if_logged_in(req, res)

    update_blog_page(req.params.BlogID, req.session.id, req.params.PageID, req.body.title, req.body.content,
        req.body.meta_desc)
        .then(result => {
            res.redirect('/')
        }).catch(error => {
            console.debug('Unable to update blog page: ' + error.toString())
            res.status(500).send('Unable to update blog page: ' + error.toString())
    })
})

router.get('/show/:BlogID/:PageID/', (req, res) => {
    get_blog_page(req.session.user_id, req.params.PageID).then(result => {
        res.render('cp/page/cp_display_page', {
            title: result._blog_page_title,
            meta_desc: result._blog_page_meta_description,
            layout: 'cp',
            logged_in: req.session.logged_in,
            page_content: md.render(result._blog_page_content)
        })
    }).catch(error => {
        console.debug('Unable to get blog page: ' + error.toString())
        res.status(500).send('Unable to get blog page: ' + error.toString())
    })
})

export {router}