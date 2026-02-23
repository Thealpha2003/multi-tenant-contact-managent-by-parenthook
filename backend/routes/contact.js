const express = require("express");
const router = express.Router();
const pool = require("../db");

const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const sanitizeString = (str, maxLen = 255) => {
  if (typeof str !== "string") return null;
  return str.trim().slice(0, maxLen) || null;
};

/* GET contacts by tenant */
router.get("/tenants/:tenantId/contacts", async (req, res) => {
  try {
    const tenantId = parseInt(req.params.tenantId, 10);
    if (isNaN(tenantId) || tenantId < 1) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const result = await pool.query(
      "SELECT id, tenant_id, name, email FROM contacts WHERE tenant_id = $1 ORDER BY name",
      [tenantId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET contacts error:", err);
    const msg =
      err.code === "ECONNREFUSED"
        ? "Database unreachable"
        : err.code === "42P01"
          ? "Table 'contacts' missing - run backend/scripts/init-db.sql"
          : "Failed to fetch contacts";
    res.status(500).json({ message: msg });
  }
});

/* CREATE contact */
router.post("/tenants/:tenantId/contacts", async (req, res) => {
  try {
    const tenantId = parseInt(req.params.tenantId, 10);
    if (isNaN(tenantId) || tenantId < 1) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const name = sanitizeString(req.body?.name);
    const email = req.body?.email;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const result = await pool.query(
      "INSERT INTO contacts (tenant_id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [tenantId, name, email.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST contact error:", err);
    const msg =
      err.code === "42P01"
        ? "Table 'contacts' missing - run backend/scripts/init-db.sql"
        : "Failed to create contact";
    res.status(500).json({ message: msg });
  }
});

/* UPDATE contact */
router.put("/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const name = sanitizeString(req.body?.name);
    const email = req.body?.email;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const result = await pool.query(
      "UPDATE contacts SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT contact error:", err);
    const msg = err.code === "42P01" ? "Table 'contacts' missing - run init-db.sql" : "Failed to update contact";
    res.status(500).json({ message: msg });
  }
});

/* DELETE contact */
router.delete("/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const result = await pool.query("DELETE FROM contacts WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE contact error:", err);
    const msg = err.code === "42P01" ? "Table 'contacts' missing - run init-db.sql" : "Failed to delete contact";
    res.status(500).json({ message: msg });
  }
});

module.exports = router;
