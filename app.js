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
const hbs = require('express-handlebars')
const cookie_session = require('cookie-session')
const nano_user = require('./routes/user/user')
const cp_blog = require('./routes/cp/blog/blog')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
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
app.use('/user/', nano_user)
app.use('/cp/blog/', cp_blog)

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Nanoscopic - The small, efficient and ultra flexible open source blogging platform.',
        meta_desc: 'Nanoscopic is a small and efficient blogging platform that is designed to allow bloggers to ' +
            'charge what they want for their content so they do not have to rely on advertising or other forms of ' +
            'revenue generation.'
    })
})

app.listen(port, () => {
    console.log(`nanoscopic_main_website listening on ${port}`)
})