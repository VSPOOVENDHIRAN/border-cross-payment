// config/db.js
import pkg from "pg";
import url from "url";
import dotenv from "dotenv";

dotenv.config(); // ensures process.env is loaded

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const params = url.parse(process.env.DATABASE_URL);
const [user, password] = params.auth.split(":");

const pool = new Pool({
  user,
  password,
  host: params.hostname,
  database: params.pathname.split("/")[1],
  port: params.port,
  ssl: { rejectUnauthorized: false },
});

export default pool;
