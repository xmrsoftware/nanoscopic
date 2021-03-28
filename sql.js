'use strict';

const pgp = require('pg-promise')()

const cn = {
    host: process.env.NANOSCOPIC_POSTGRES_SERVER,
    port: process.env.NANOSCOPIC_POSTGRES_PORT,
    database: process.env.NANOSCOPIC_POSTGRES_DATABASE,
    user: process.env.NANOSCOPIC_POSTGRES_USER,
    password: process.env.NANOSCOPIC_POSTGRES_PASSWORD,
    max: 100
}

const db = pgp(cn)

function get_database_connection() {
    return db
}

exports.get_database_connection = get_database_connection