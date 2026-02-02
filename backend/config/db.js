// config/db.js

const postgres = require('postgres')
const dotenv = require('dotenv')

dotenv.config()

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',        // required for Supabase
  prepare: false,        // IMPORTANT for transaction pooler
})

module.exports = sql
