import { config } from "dotenv";
config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 🔥 THIS IS KEY
  ssl: {
    rejectUnauthorized: false, // 🔥 REQUIRED for Render
  },
});

pool.on("error", (err) => {
  console.error("❌ DB pool error:", err.message);
});

pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => console.error("❌ PostgreSQL connection failed:", err.message));

export default pool;