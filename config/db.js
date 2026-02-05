// config/db.js - MOCK VERSION FOR DEMO
const postgres = require('postgres');
require('dotenv').config();

let sql;

if (process.env.DATABASE_URL) {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    prepare: false,
  });
} else {
  console.warn("⚠️ DATABASE_URL not found. Using MOCK database for UI demonstration.");
  // Mock the postgres client for basic queries
  sql = async (strings, ...values) => {
    const query = strings.join('?');
    console.log(`[MOCK SQL] ${query}`, values);

    if (query.includes('SELECT NOW()')) return [{ now: new Date() }];
    if (query.includes('SELECT 1 + 1')) return [{ result: 2 }];
    if (query.includes('hospitals')) return [];
    if (query.includes('emergencies')) return [];
    return [];
  };
}

module.exports = sql;
