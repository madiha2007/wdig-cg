// backend/db/index.js
import { config } from "dotenv";
config();
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || "wdig_db",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("❌ DB pool error:", err.message);
});

pool.query("SELECT 1").then(() => {
  console.log("✅ PostgreSQL connected to wdig_db");
}).catch((err) => {
  console.error("❌ PostgreSQL connection failed:", err.message);
});

console.log("DB PASSWORD:", process.env.DB_PASSWORD);

export default pool;
