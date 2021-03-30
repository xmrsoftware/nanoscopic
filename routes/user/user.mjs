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

import { v4 } from 'uuid'
import express from 'express'
import { create_user_object, get_user_id, check_user_password, get_user_salt, add_user_permissions } from
        './user.sql.mjs'
import { check_password_hash } from './user_hashing.mjs'

const router = express.Router()

router.get('/register/', (req, res) => {
    res.render('user/register', {
        title: 'Register a Nanoscopic Blog Account',
        meta_desc: 'Register a Nanoscopic account so that you can comment and read all the blog posts contained on ' +
            'this blogging platform.',
        form_css: true,
        logged_in: req.session.logged_in
    })
})

router.post('/register/', (req, res) => {
    if (req.body.password !== req.body.password_confirm) {
        console.debug('Passwords do not match in register form')
        res.redirect('/user/register/fail/')
    }

    create_user_object(req.body.username, req.body.email, req.body.password, v4()).then(result => {
        req.session.username = req.body.username
        req.session.user_id = get_user_id(req.body.username)
        req.session.logged_in = true
        add_user_permissions(req.session.user_id).then(result => {
        }).catch(error => {
            console.debug('Error adding user permissions ' + error.toString())
            res.redirect('/user/register/fail/')
        })
        res.redirect('/user/register/success/')
    }).catch(error => {
        console.debug('Error creating new user ' + error.toString())
        res.redirect('/user/register/fail/')
    })
})

router.get('/register/success/', (req, res) => {
    res.render('user/register_success', {
        title: 'You have successfully registered a Nanoscopic blog account',
        meta_desc: 'You have successfully registered a Nanoscopic blog account.',
        logged_in: req.session.logged_in
    })
})

router.get('/register/fail/', (req, res) => {
    res.render('user/register_fail', {
        title: 'There has been an error while registering your Nanoscopic blog account',
        meta_desc: 'There has been an error while registering your Nanoscopic blog account.',
        logged_in: req.session.logged_in
    })
})

router.get('/login/', (req, res) => {
    res.render('user/login', {
        title: 'Login to your Nanoscopic blog account',
        meta_desc: 'Login to your Nanoscopic blog account.',
        logged_in: req.session.logged_in
    })
})

router.post('/login/', (req, res) => {
    const salted_password = check_user_password(req.body.username).then(result => {
        const user_password_true = check_password_hash(req.body.password, salted_password,
            get_user_salt(req.body.username))
        if (user_password_true) {
            req.session.username = req.body.username
            req.session.user_id = get_user_id(req.body.username)
            req.session.logged_in = true
            res.redirect('/user/login/succeed/')
        }
    }).catch(error => {
        console.debug('Error logging user in: ', error.toString())
        res.redirect('/user/login/fail/')
    })
})

router.get('/login/fail/', (req, res) => {
    res.render('user/login_fail', {
        title: 'You have failed to login to your Nanoscopic account',
        meta_desc: 'You have failed to login to your Nanoscopic account.',
        logged_in: req.session.logged_in
    })
})

router.get('/logout/', (req, res) => {
    req.session = null
    res.render('user/logout', {
        title: 'You have logged out of your Nanoscopic account',
        meta_desc: 'You have logged out of your Nanoscopic account.'
    })
})

export {router}