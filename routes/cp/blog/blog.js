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
const express = require('express')
const router = express.Router()
const blog_sql = require('./blog.sql')

router.get('/blog/create/', (req, res) => {
    res.render('cp/blog/cp_new_blog', {
        title: 'Create a new Nanoscopic blog',
        meta_desc: 'Create a new Nanoscopic blog.',
        layout: 'cp',
        form_css: true
    })
})

router.post('/blog/create/', (req, res) => {
    blog_sql.create_blog(req.session.username, md.render(req.body.title), md.render(req.body.description))
        .then(result => {
            res.redirect('/cp/blog/list/all/')
        }).catch(error => {
            console.debug('Error creating blog ' + error.toString())
            res.redirect('/cp/blog/create/fail/')
        })
})

router.get('/blog/create/fail/', (req, res) => {
    res.render('cp/blog/cp_new_blog_fail', {
        title: 'Your attempt to create a new blog failed',
        meta_desc: 'Your attempt to create a new blog failed',
        layout: 'cp'
    })
})

router.get('/blog/list/all/', (req, res) => {
    // TODO: List all blogs owned by logged in username
})

module.exports = router