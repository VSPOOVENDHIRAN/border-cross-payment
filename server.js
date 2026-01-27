// server.js (CommonJS)

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const sql = require("./config/db.js"); // postgres.js client

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running by your side 🚀");
});

// Routes
const hospitalRoutes = require("./routes/hospitalroutes.js");
app.use("/api/hospitals", hospitalRoutes);

const authRoutes = require("./routes/authroutes.js");
app.use("/api/auth", authRoutes);

const historyRoutes = require("./routes/historyroutes.js");
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

// ✅ Health check (postgres.js style)
app.get("/health", async (req, res) => {
  try {
    const result = await sql`SELECT NOW()`;
    res.json({
      status: "ok",
      dbTime: result[0].now,
    });
  } catch (err) {
    res.status(500).json({
      status: "db error",
      error: err.message,
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sql`SELECT 1 + 1`;
    console.log("✅ Database connected successfully (postgres.js)");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
});
