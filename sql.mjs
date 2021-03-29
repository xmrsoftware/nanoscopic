'use strict';

import pgPromise from 'pg-promise'
const pgp = pgPromise({})

const cn = {
    host: process.env.NANOSCOPIC_POSTGRES_SERVER,
    port: process.env.NANOSCOPIC_POSTGRES_PORT,
    database: process.env.NANOSCOPIC_POSTGRES_DATABASE,
    user: process.env.NANOSCOPIC_POSTGRES_USER,
    password: process.env.NANOSCOPIC_POSTGRES_PASSWORD,
    max: 30
}

export const db = pgp(cn)