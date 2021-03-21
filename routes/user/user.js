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

const uuid = require('uuid')
const express = require('express')
const router = express.Router()
const user_sql = require('./user.sql')

router.get('/register/', (req, res) => {
    res.render('register', {
        title: 'Register a Nanoscopic Blog Account',
        meta_desc: 'Register a Nanoscopic account so that you can comment and read all the blog posts contained on ' +
            'this blogging platform.',
        form_css: true
    })
})

router.post('/register/', (req, res) => {
    if (req.body.password !== req.body.password_confirm) {
        console.debug('Passwords do not match in register form')
        res.redirect('/register/fail/')
    }

    user_sql.create_user_object(req.body.username, req.body.email, req.body.password, uuid.v4()).then(result => {
        res.redirect('/register/success/')
    }).catch(error => {
        console.debug('Error creating new user ' + error.toString())
        res.redirect('/register/fail/')
    })
})

router.get('/register/success/', (req, res) => {

})

router.get('/register/fail/', (req, res) => {

})

router.get('/login/', (req, res) => {

})

router.post('/login/', (req, res) => {

})

router.get('/logout/', (req, res) => {

})

module.exports = router