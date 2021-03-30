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

import express from 'express'
import { check_if_logged_in } from "../../utils.mjs";

const router = express.Router()

router.get('/', function (req, res) {
    check_if_logged_in(req, res)

    res.render('cp/cp_home', {
        title: 'Nanoscopic Control Panel Home',
        meta_desc: 'The Nanoscopic Control Panel Home.',
        layout: 'cp',
        logged_in: req.session.logged_in
    })
})

export {router}