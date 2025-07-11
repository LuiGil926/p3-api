import pool from "../db/confidb.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { user, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [user]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "usuario no encontrado",
        status: false,
      });
    }

    const usuario = rows[0];

    const isValid = await bcrypt.compare(password, usuario.contraseña);

    if (password !== usuario.contraseña) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
        status: false,
      });
    }

    res.status(200).json({
      message: "Usuario autenticado",
      id: usuario.id,
      user: usuario.correo,
      nombre: usuario.nombre,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la conexión con la base de datos",
      detalle: error.message,
    });
  }
};

export const register = async (req, res) => {
  const { password, name, email } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    if (rows.length === 0) {
      res.status(401).json({
        error: "Error en la creación del usuario",
      });
    } else {
      res.status(200).json({
        message: "Usuario creado",
        user: rows[0].id,
        status: true,
      });
    }
  } catch (error) {
    res.status(501).json({
      error: "Error en la conexión con la base de datos",
      error: error,
    });
  }
};

export const getproducts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM productos");

    res.status(200).json(rows);
  } catch (error) {
    res.status(501).json({
      error: "Error en la conexión con la base de datos",
      error: error,
    });
  }
};

export const createCart = async (req, res) => {
  const { id } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *",
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(501).json({
      error: "Error en la conexión con la base de datos",
      error: error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { carrito_id, producto_id } = req.body;

  try {
    const { rows } = await pool.query(
      "update carritoitem set cantidad = cantidad - 1 where producto_id = $2 and carrito_id = $1",
      [carrito_id, producto_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(501).json({
      error: "Error en la conexión con la base de datos",
      error: error,
    });
  }
}

export const getCart = async (req, res) => {
  const { id } = req.body;

  try {
    const { rows } = await pool.query(
      "select carritoitem.producto_id, productos.precio, productos.nombre, productos.imagen_url, carritoitem.cantidad from carritoitem inner join productos on carritoitem.producto_id = productos.id where carritoitem.carrito_id = $1",
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(501).json({
      error: "Error en la conexión con la base de datos",
      error: error,
    });
  }
};

export const addCart = async (req, res) => {
  const { id, producto_id, cantidad } = req.body;

  if (
    !Number.isInteger(id) ||
    !Number.isInteger(producto_id) ||
    !Number.isInteger(cantidad) ||
    cantidad <= 0
  ) {
    return res.status(400).json({
      status: false,
      message: "Datos inválidos",
    });
  }

  try { 

    const check = await pool.query(
      "SELECT * FROM carritoitem WHERE carrito_id = $1 AND producto_id = $2",
      [id, producto_id]
    );

    let result

    if (check.rows.length === 0) {
      result = await pool.query(
        "INSERT INTO carritoitem (carrito_id, producto_id, cantidad)VALUES ($1, $2, $3)RETURNING *",
        [id, producto_id, cantidad]
      );

    } else {
        result = await pool.query(
        "UPDATE carritoitem SET cantidad = cantidad + $3 WHERE carrito_id = $1 AND producto_id = $2",
        [id, producto_id, cantidad]
      );
    }

    res.status(200).json(result.rows);

  }catch(error){
    res.status(500).json({
      status: false,
      message: "Error al agregar al carrito",
    });
  }
};
