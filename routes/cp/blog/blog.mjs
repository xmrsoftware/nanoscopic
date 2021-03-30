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

router.get('/blog/create/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog', {
        title: 'Create a new Nanoscopic blog',
        meta_desc: 'Create a new Nanoscopic blog.',
        layout: 'cp',
        form_css: true,
        logged_in: req.session.logged_in
    })
})

router.post('/blog/create/', (req, res) => {
    check_if_logged_in(req, res)

    create_blog(req.session.user_id, req.body.title, req.body.description)
        .then(() => {
            res.redirect('/cp/blog/list/all/')
        }).catch(error => {
        console.debug('Error creating blog ' + error.toString())
        res.redirect('/cp/blog/create/fail/')
    })
})

router.get('/blog/create/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog_fail', {
        title: 'Your attempt to create a new blog failed',
        meta_desc: 'Your attempt to create a new blog failed',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/blog/delete/:blogID/confirm/', (req, res) => {
    check_if_logged_in(req, res)

    const blog = get_blog(req.params.blogID, req.session.user_id)

    res.render('cp/blog/cp_delete_blog_confirm', {
        title: 'Are you sure you wish to delete the blog called ' + blog.name + '?',
        meta_desc: 'Are you sure you want to delete the blog called ' + blog.name + '?',
        layout: 'cp',
        form_css: true,
        logged_in: req.session.logged_in,
        blog_id: blog.blog_id
    })
})

router.post('/blog/delete/:blogID/confirm/', (req, res) => {
    check_if_logged_in(req, res)

    const blog = get_blog(req.params.blogID, req.session.user_id)

    res.redirect('/cp/blog/delete/' + blog.blog_id + '/')
})

router.post('/blog/delete/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    delete_blog(req.params.blogID, req.session.user_id)
        .then(result => {
            res.redirect('/')
        }).catch(error => {
            console.debug('Unable to delete blog ' + error.toString())
            res.redirect('/cp/blog/delete/fail/')
        })
})

router.get('/blog/delete/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_delete_blog_fail', {
        title: 'There has been an error when deleting your blog',
        meta_desc: 'There has been an error when deleting your blog',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/blog/update/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_update_blog', {
        title: 'Update your blog',
        meta_desc: 'Update your blog,',
        layout: 'cp',
        form_css: true,
        logged_in: req.session.logged_in
    })
})

router.post('/blog/update/:blogID/', (req, res) => {
    check_if_logged_in(req, res)

    update_blog(req.params.blogID, req.session.user_id, req.body.name, req.body.description)
        .then(result => {
            console.log(result)
        }).catch(error => {
            console.debug('Error updating blog ' + error.toString())
            res.redirect('/cp/blog/update/error/')
    })
})

router.get('/blog/update/fail/', (req, res) => {
    check_if_logged_in(req, res)

    res.render('cp/blog/cp_update_blog_fail', {
        title: 'There was an error updating your blog',
        meta_desc: 'There was an error updating your blog',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

router.get('/blog/list/all/', (req, res) => {
    check_if_logged_in(req, res)

    list_blogs(req.session.user_id)
        .then(result => {
            console.log(result)
        }).catch(error => {
            console.debug('Unable to retrieve list of blogs for user: ' + req.session.username + ' ' + error)
    })
    // TODO: Render template
})

export {router}