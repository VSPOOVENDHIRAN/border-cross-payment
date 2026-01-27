import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import hospitalroutes from "./routes/hospitalroutes.js";
import pool from "./config/db.js";

dotenv.config();



console.log("DATABASE_URL:", process.env.DATABASE_URL);


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/hospital", hospitalroutes);

app.get("/", (req, res) => {
  res.send("Server is running by your side");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully after server start");
    client.release();
  } catch (err) {
    console.error("❌ Database connection failed after server start:");
    console.error(err); // log full error object
  }
});
