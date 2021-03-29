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
const router = express().router

router.get('/blog/post/new/', function (req, res) {
    res.render('cp/post/cp_new_blog_post', {
        title: 'Create a new blog post',
        meta_desc: 'Create a new blog post',
        form: true,
        layout: 'cp'
    })
})

router.post('/blog/post/new/', function (req, res) {
    // TODO: Do we need to put /cp/ for the redirect URL to work properly?
    res.redirect('/blog/post/new/success/')
})

router.get('/blog/post/new/success/', function (req, res) {
    res.render('cp/post/cp_new_blog_post_published', {
        title: 'You have successfully published your blog post',
        meta_desc: 'You have successfully published your blog post.',
        layout: 'cp'
    })
})

module.exports = router