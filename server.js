const express = require("express");
const path = require("path");
const pool = require("./db"); // tu db.js adaptado a pg

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ruta base → abre login.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM login WHERE usuario = $1 AND contrasenia = $2`,
      [usuario, contrasenia]
    );

    if (result.rows.length > 0) {
      if (usuario === "admin") {
        return res.json({ success: true, rol: "admin" });
      } else {
        return res.json({ success: true, rol: "cliente" });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ================= PRODUCTOS =================
app.get("/productos", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.id_precio, q.producto, p.precio
      FROM Precios AS p
      INNER JOIN Producto AS q ON p.id_precio = q.id_precio
      ORDER BY q.id_precio;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error en consulta productos:", err);
    res.status(500).send("Error consultando productos");
  }
});

app.put("/producto/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { producto, precio } = req.body;

    if (!Number.isInteger(id) || producto == null || precio == null) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    await pool.query(
      `UPDATE Producto SET producto = $1 WHERE id_precio = $2`,
      [producto, id]
    );

    await pool.query(
      `UPDATE Precios SET precio = $1 WHERE id_precio = $2`,
      [precio, id]
    );

    return res.json({
      success: true,
      message: "Producto actualizado correctamente.",
    });
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
});

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});
