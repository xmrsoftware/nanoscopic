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
import { create_blog, list_blogs, update_blog, delete_blog, get_blog } from './blog.sql.mjs';
import { check_if_logged_in } from './../../../utils.mjs'

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

    create_blog(req.session.user_id, req.body.title, req.body.description, req.body.meta_desc)
        .then(() => {
            if (req.query.return_url) {
                res.redirect(req.query.return_url)
            }
            res.redirect('/cp/blog/')
        }).catch(error => {
            console.debug('Error creating blog ' + error.toString())
            res.redirect('/cp/blog/create/fail/')
    })
})

router.get('/create/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog_fail', {
        title: 'Your attempt to create a new blog failed',
        meta_desc: 'Your attempt to create a new blog failed',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/delete/:blogID/confirm/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog(req.params.blogID, req.session.user_id).then(result => {
        res.render('cp/blog/cp_delete_blog_confirm', {
            title: 'Are you sure you wish to delete the blog called ' + result.blog_name + '?',
            meta_desc: result.blog_meta_description,
            layout: 'cp',
            form_css: true,
            logged_in: req.session.logged_in,
            blog_id: result.blog_id
        })
    }).catch(error => {
        console.debug('Unable to confirm delete of blog: ' + error.toString())
        res.redirect('/cp/blog/delete/fail/')
    })
})

router.post('/delete/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    delete_blog(req.params.blogID, req.session.user_id)
        .then(result => {
            res.redirect('/cp/blog/')
        }).catch(error => {
            console.debug('Unable to delete blog ' + error.toString())
            res.redirect('/cp/blog/delete/fail/')
        })
})

router.get('/delete/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_delete_blog_fail', {
        title: 'There has been an error when deleting your blog',
        meta_desc: 'There has been an error when deleting your blog',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/update/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_update_blog', {
        title: 'Update your blog',
        meta_desc: 'Update your blog,',
        layout: 'cp',
        form_css: true,
        logged_in: req.session.logged_in,
        blog_id: req.params.BlogID
    })
})

router.post('/update/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    update_blog(req.params.blogID, req.session.user_id, req.body.title, req.body.description, req.body.meta_desc)
        .then(result => {
            res.redirect('/')
        }).catch(error => {
            console.debug('Error updating blog ' + error.toString())
            res.redirect('/cp/blog/update/error/')
    })
})

router.get('/update/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_update_blog_fail', {
        title: 'There was an error updating your blog',
        meta_desc: 'There was an error updating your blog',
        layout: 'cp',
        logged_in: req.session.logged_in
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
            res.redirect('/cp/blog/list/fail/')
    })
})

router.get('/list/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_list_all_blog_fail', {
        title: 'There was an error trying to list your blogs',
        meta_desc: 'There was an error trying to list your blogs',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/show/:BlogID/', (req, res) => {
    check_if_logged_in(req, res)

    get_blog(req.params.BlogID, req.session.user_id).then(result => {
        res.render('cp/blog/cp_display_blog', {
            title: result.blog_name,
            meta_desc: result.blog_meta_description,
            layout: 'cp',
            logged_in: req.session.logged_in,
            blog_id: result.blog_id,
            blog_name: result.blog_name,
            blog_description: result.blog_description
        })
    }).catch(error => {
        console.debug('Unable to show blog with ID: ' + req.params.BlogID.toString() + ' ' + error.toString())
        res.redirect('/cp/blog/show/fail/')
    })
})

router.get('/show/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_display_blog_fail', {
        title: 'Unable to view blog',
        meta_desc: 'Unable to display blog',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

export {router}