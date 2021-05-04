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

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import express from 'express'
import hbs from 'express-handlebars'
import cookie_session from 'cookie-session'
import dotenv from 'dotenv'
import { router as user_routes } from './routes/user/user.mjs'
import { router as cp_home } from './routes/cp/home.mjs'
import { router as cp_blog_routes } from './routes/cp/blog/blog.mjs'
import { router as cp_page_routes } from './routes/cp/page/page.mjs'
import { router as cp_post_routes } from "./routes/cp/post/post.mjs"

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const app = express()
const port = process.env.NANOSCOPIC_EXPRESS_JS_APP_PORT
const cookie_secure = process.env.NODE_ENV === 'production';

app.use(cookie_session({
    name: 'nanoscopic_session',
    secret: process.env.SESSION_COOKIE_SHARED_SECRET,
    maxAge: 168 * 60 * 60 * 1000, // 7 days
    secure: cookie_secure,
    // if it turns out that the session cookie is required in client (browser) side JavaScript then set httpOnly to
    // false
    httpOnly: true,
    sameSite: true,
    signed: true
}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/static', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')
// the view cache is only used when Node is in production mode
app.enable('view cache')

// load route modules
app.use('/user/', user_routes)
app.use('/cp/', cp_home)
app.use('/cp/blog/', cp_blog_routes)
app.use('/cp/page/', cp_page_routes)
app.use('/cp/post/', cp_post_routes)

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Nanoscopic - The small, efficient and ultra flexible open source blogging platform.',
        meta_desc: 'Nanoscopic is a small and efficient blogging platform that is designed to allow bloggers to ' +
            'charge what they want for their content so they do not have to rely on advertising or other forms of ' +
            'revenue generation.',
        logged_in: req.session.logged_in
    })
})

app.listen(port, () => {
    console.log(`nanoscopic_main_website listening on ${port}`)
})