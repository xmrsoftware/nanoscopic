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

const express = require('express')
const router = express.Router()
const blog_sql = require('./blog.sql')
const permission_status = require('./../../../utils')

router.get('/blog/create/', (req, res) => {
    permission_status.check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog', {
        title: 'Create a new Nanoscopic blog',
        meta_desc: 'Create a new Nanoscopic blog.',
        layout: 'cp',
        form_css: true
    })
})

router.post('/blog/create/', (req, res) => {
    permission_status.check_if_logged_in(req, res)

    blog_sql.create_blog(req.session.username, req.body.title, req.body.description)
        .then(() => {
            res.redirect('/cp/blog/list/all/')
        }).catch(error => {
            console.debug('Error creating blog ' + error.toString())
            res.redirect('/cp/blog/create/fail/')
        })
})

router.post('/blog/delete/:blogID/', (req, res) => {
    permission_status.check_if_logged_in(req, res)
})

router.get('/blog/create/fail/', (req, res) => {
    permission_status.check_if_logged_in(req, res)

    res.render('cp/blog/cp_new_blog_fail', {
        title: 'Your attempt to create a new blog failed',
        meta_desc: 'Your attempt to create a new blog failed',
        layout: 'cp'
    })
})

router.get('/blog/list/all/', (req, res) => {
    permission_status.check_if_logged_in(req, res)

    blog_sql.list_blogs(req.session.user_id)
        .then(result => {
            console.log(result)
        }).catch(error => {
            console.debug('Unable to retrieve list of blogs for user: ' + req.session.username + ' ' + error)
    })
})

module.exports = router