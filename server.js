const express = require("express");
const path = require("path");
const { sql, poolPromise } = require("./db"); // asegúrate de la ruta correcta

const app = express();
const port = process.env.PORT || 5000;  // 🚨 Railway asigna el puerto dinámico

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ====================== RUTAS ======================

// Home
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

// LOGIN
app.post("/login", async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("usuario", sql.NVarChar(50), usuario)
      .input("contrasenia", sql.NVarChar(50), contrasenia)
      .query("SELECT * FROM login WHERE usuario = @usuario AND contrasenia = @contrasenia");

    if (result.recordset.length > 0) {
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

// PRODUCTOS & PRECIOS
app.get("/productos", async (_req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`
        SELECT q.id_precio, q.producto, p.precio
        FROM Precios AS p
        INNER JOIN Producto AS q ON p.id_precio = q.id_precio
        ORDER BY q.id_precio;
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error en la consulta SQL (productos):", err);
    res.status(500).send("Error consultando productos");
  }
});

// UPDATE PRODUCTO
app.put("/producto/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const id = parseInt(req.params.id, 10);
    const { producto, precio } = req.body;

    if (!Number.isInteger(id) || producto == null || precio == null) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const request = pool
      .request()
      .input("id", sql.Int, id)
      .input("producto", sql.NVarChar(50), producto)
      .input("precio", sql.Int, parseInt(precio, 10));

    const result = await request.query(`
      UPDATE Producto SET producto = @producto WHERE id_precio = @id;
      UPDATE Precios  SET precio   = @precio   WHERE id_precio = @id;
    `);

    const ok =
      Array.isArray(result.rowsAffected) &&
      (result.rowsAffected[0] > 0 || result.rowsAffected[1] > 0);

    if (ok) {
      return res.json({
        success: true,
        message: "Producto actualizado correctamente."
      });
    }
    return res.status(404).json({ error: "Producto no encontrado." });
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
});

// ====================== SERVER ======================
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});
