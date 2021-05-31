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
import {create_user_object, get_user_id, check_user_password, get_user_salt, verify_email} from './user.sql.mjs'
import {get_email_from_verification_code, get_all_user_blogs} from './user.sql.mjs';
import {check_password_hash} from "./user_hashing.mjs";
import {check_if_logged_in, send_verification_email, check_if_email_verified} from '../../utils.mjs'
import {check_if_username_exists} from '../../utils.mjs';
import {get_username_from_user_id} from "../public/post/post.sql.mjs";

const router = express.Router()

router.get('/register/', (req, res) => {
    if (req.session.logged_in) {
        console.debug('You are already logged into an account and can\'t create a new one: ' + req.session.username)
        res.redirect('/cp/')
    }

    res.render('user/register', {
        title: 'Register a Nanoscopic Blog Account',
        meta_desc: 'Register a Nanoscopic account so that you can comment and read all the blog posts contained on ' +
            'this blogging platform.',
        form_css: true,
        layout: 'main'
    })
})

router.post('/register/', (req, res) => {
    if (req.body.password !== req.body.password_confirm) {
        console.debug('Passwords do not match in register form')
        res.status(500).send('Password do not match in the register form')
    }

    create_user_object(req.body.username, req.body.email, req.body.password, v4(), v4()).then(() => {
        get_user_id(req.body.username).then(result => {
            send_verification_email(req.body.email)
            req.session.username = req.body.username
            req.session.user_id = result.get_user_id_by_username
            req.session.logged_in = true
            req.session.verified_email = false
            res.redirect('/user/verify/email/needed/')
        }).catch(error => {
            console.debug('Unable to get user_id ' + error.toString())
            res.status(500).send('Unable to get user_id ' + error.toString())
        })
    }).catch(error => {
        console.debug('Error creating new user ' + error.toString())
        res.status(500).send('Error creating new user: ' + error.toString())
    })
})

router.get('/verify/email/needed/', (req, res) => {
    res.render('user/verify', {
        title: 'Please verify your email address',
        meta_desc: 'Please verify your email address on Nanoscopic Blog',
        layout: 'main'
    })
})

router.get('/login/', (req, res) => {
    if (req.session.logged_in) {
        console.debug('You are already logged into a Nanoscopic account: ' + req.session.username)
        res.redirect('/cp/')
    }

    res.render('user/login', {
        title: 'Login to your Nanoscopic blog account',
        meta_desc: 'Login to your Nanoscopic blog account.',
        layout: 'main'
    })
})

router.post('/login/', (req, res) => {
    if (check_if_username_exists(req.body.username) === false) {
        res.status(500).send('Your entered username does not exist')
    }

    check_user_password(req.body.username).then(db_salt_password_result => {
        const db_salted_password = db_salt_password_result.get_salt_password_by_username
        get_user_salt(req.body.username).then(user_salt_result => {
            if (check_password_hash(req.body.password, db_salted_password, user_salt_result.get_user_salt) === false) {
                console.debug('Unable to verify password')
                res.status(500).send('Unable to verify password')
            }
        }).catch(error => {
            console.debug('Unable to retrieve user salt from DB: ' + error.toString())
            res.status(500).send('Unable to retrieve user salt from DB: ' + error.toString())
        })
    }).catch(error => {
        console.debug('Unable to retrieve salted password from DB: ' + error.toString())
        res.status(500).send('Unable to retrieve salted password from DB: ' + error.toString())
    })

    get_user_id(req.body.username).then(result => {
        check_if_email_verified(result.get_user_id_by_username).then(email => {
            req.session.username = req.body.username
            req.session.user_id = result.get_user_id_by_username
            req.session.logged_in = true
            req.session.verified_email = email.check_if_email_verified
            res.redirect('/cp/')
        }).catch(error => {
            console.debug('Unable to find out if email verified: ' + error.toString())
            res.status(500).send('Unable to find out if email verified: ' + error.toString())
        })
    }).catch(error => {
        console.debug('Unable to get user_id: ' + error.toString())
        res.status(500).send('Unable to get user_id: ' + error.toString())
    })
})

router.get('/logout/', (req, res) => {
    req.session = null
    res.render('user/logout', {
        title: 'You have logged out of your Nanoscopic account',
        meta_desc: 'You have logged out of your Nanoscopic account.',
        layout: 'main'
    })
})

router.get('/verify/email/:VerificationCode/', (req, res) => {
    check_if_logged_in(req, res)

    get_email_from_verification_code(req.params.VerificationCode).then(email => {
        verify_email(email.get_email_from_verification_code, req.params.VerificationCode).then(() => {
            req.session.verified_email = true
            res.redirect('/user/verify/complete/')
        }).catch(error => {
            console.debug('Unable to verify email: ' + error.toString())
            res.status(500).send('Unable to verify email: ' + error.toString())
        })
    }).catch(error => {
        console.debug('Unable to get email address: ' + error.toString())
        res.status(500).send('Unable to get email address: ' + error.toString())
    })
})

router.get('/verify/complete/', (req, res) => {
    res.render('verify_complete', {
        title: 'Verified email address on Nanoscopic',
        meta_desc: 'You have successfully verified your email address',
        layout: 'main',
        logged_in: req.session.logged_in
    })
})

router.get('/profile/:UserID/', (req, res) => {
    get_username_from_user_id(req.params.UserID).then(username_obj => {
        get_all_user_blogs(req.params.UserID).then(results => {
            res.render('user/profile', {
                logged_in: req.session.logged_in,
                layout: 'main',
                title: 'List of blogs owned by ' + username_obj.username,
                meta_desc: 'List of blogs owned by ' + username_obj.username,
                author: username_obj.username,
                blogs: results
            })
        }).catch(error => {
            console.debug('Unable to get all user blogs: ' + error.toString())
            res.status(500).send('Unable to get all user blogs: ' + error.toString())
        })
    }).catch(error => {
        console.debug('Unable to get username from user_id: ' + error.toString())
        res.status(500).send('Unable to get username from user_id: ' + error.toString())
    })
})

export {router}