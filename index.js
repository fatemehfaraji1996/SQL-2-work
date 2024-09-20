const express = require("express");
const pool = require("./db/connection");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/employees", async (req, res) => {
  const { name, position, salary } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)",
      [name, position, salary]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  try {
    await pool.query(
      "UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?",
      [name, position, salary, id]
    );
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Connected to the database");
    conn.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
