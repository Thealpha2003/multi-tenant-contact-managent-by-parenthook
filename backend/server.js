require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err.message);
    res.status(503).json({
      ok: false,
      error: err.code === "ECONNREFUSED" ? "Database unreachable" : "Database error - ensure contactapp exists and init-db.sql was run",
    });
  }
});

const contactRoutes = require("./routes/contact");
app.use("/api", contactRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
