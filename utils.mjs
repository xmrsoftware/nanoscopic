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

import nodemailer from 'nodemailer'
import { db } from './sql.mjs'

function check_if_logged_in(req, res) {
    if (req.session === null || req.session === undefined || req.session.logged_in !== true) {
        res.status(403).send('<div id="403_status_code">You are not authorised to see this URL</div>')
    }
}

function send_verification_email(email) {
    const sql = 'SELECT * FROM get_email_verification_code_from_email($1);'
    db.oneOrNone(sql, [email]).then(results => {
        if (results === null || results === undefined) {
            return
        }

        let transporter = nodemailer.createTransport({
            host: process.env.NANOSCOPIC_SMTP_SERVER,
            port: process.env.NANOSCOPIC_SMTP_PORT,
            secure: process.env.NANOSCOPIC_SMTP_USE_TLS,
            auth: {
                user: process.env.NANOSCOPIC_SMTP_USER,
                pass: process.env.NANOSCOPIC_SMTP_PASSWORD,
            },
        });

        transporter.sendMail({
            from: '"Nanoscopic Blog" <noreply@nanoscopic.blog>',
            to: email,
            subject: "Please verify your email address on Nanoscopic Blog",
            text: "Please verify your email address by clicking the following link: " +
                "https://www.nanoscopic.blog/user/verify/email/" +
                results.get_email_verification_code_from_email.toString() + "/",
        });
    }).catch(error => {
        console.debug('Unable to get verification code: ' + error.toString())
    })
}

async function check_if_email_verified(user_id) {
    const sql = 'SELECT * FROM check_if_email_verified($1);'
    return await db.oneOrNone(sql, [user_id])
}

async function check_if_username_exists(username) {
    const sql = 'SELECT * FROM check_if_username_exists($1);'
    const returned_username = await db.oneOrNone(sql, [username])
    return returned_username.check_if_username_exists === username
}

export {check_if_logged_in, send_verification_email, check_if_email_verified, check_if_username_exists}