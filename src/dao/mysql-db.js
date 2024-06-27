const mysql = require('mysql2')
require('dotenv').config() // Load environment variables from .env file
const logger = require('../util/logger')

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true
}

const pool = mysql.createPool(dbConfig)

// Log MySQL pool events
pool.on('connection', () => {
    logger.info('MySQL pool connected')
})

pool.on('acquire', (connection) => {
    logger.trace('Connection acquired from MySQL pool:', connection.threadId)
})

pool.on('release', (connection) => {
    logger.trace('Connection released back to MySQL pool:', connection.threadId)
})

pool.on('enqueue', () => {
    logger.trace('Waiting for available connection slot in MySQL pool')
})

module.exports = {
    pool, dbConfig
}
