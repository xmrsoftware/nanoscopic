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
import {get_email_from_verification_code} from './user.sql.mjs';
import {check_password_hash} from "./user_hashing.mjs";
import {check_if_logged_in, send_verification_email} from "../../utils.mjs";

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
        logged_in: req.session.logged_in
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
            res.redirect('/cp/')
        }).catch(error => {
            console.debug('Unable to get user_id ' + error.toString())
            res.status(500).send('Unable to get user_id ' + error.toString())
        })
    }).catch(error => {
        console.debug('Error creating new user ' + error.toString())
        res.status(500).send('Error creating new user: ' + error.toString())
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
        logged_in: req.session.logged_in
    })
})

router.post('/login/', (req, res) => {
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
        req.session.username = req.body.username
        req.session.user_id = result.get_user_id_by_username
        req.session.logged_in = true
        res.redirect('/cp/')
    }).catch(error => {
        console.debug('Unable to get user_id: ' + error.toString())
        res.status(500).send('Unable to get user_id: ' + error.toString())
    })
})

router.get('/logout/', (req, res) => {
    req.session = null
    res.render('user/logout', {
        title: 'You have logged out of your Nanoscopic account',
        meta_desc: 'You have logged out of your Nanoscopic account.'
    })
})

router.get('/verify/email/:VerificationCode/', (req, res) => {
    check_if_logged_in(req, res)

    get_email_from_verification_code(req.params.VerificationCode).then(email => {
        verify_email(email.get_email_from_verification_code, req.params.VerificationCode).then(() => {
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
        layout: 'main'
    })
})

export {router}