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

import process from 'node:process'
import pgPromise from 'pg-promise'
import dotenv from "dotenv";

const pgp = pgPromise({})
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const cn = {
    host: process.env.NANOSCOPIC_POSTGRES_SERVER,
    port: process.env.NANOSCOPIC_POSTGRES_PORT,
    database: process.env.NANOSCOPIC_POSTGRES_DATABASE,
    user: process.env.NANOSCOPIC_POSTGRES_USER,
    password: process.env.NANOSCOPIC_POSTGRES_PASSWORD,
    max: 30
}

export const db = pgp(cn)