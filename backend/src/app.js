//Exportamos las librerias necesarias para el funcionamiento
import express from "express";
import {config} from "dotenv";
import { conexion } from "./conexion.js";


//Instanciamos express para inciar la aplicacion
const app = express();

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

//Declaramos el puerto en el que trabajaremos
const puerto = process.env.PORT || 3700;

// Configuración para permitir cualquier origen (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite cualquier origen
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Métodos permitidos
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Encabezados permitidos
  next();
});

//Notas CRUD

app.post("/crearNota", async (req, res) => {
  const {nota} = req.body;
  // Inserción de un nuevo registro
  try {
    // Realiza la inserción en la base de datos
    conexion.query(
      "INSERT INTO notas (nota, fecha_creacion) VALUES (?, NOW())",
      [nota],
      (err, result) => {
        if (err) {
          console.error("Error al insertar el nuevo la nota:", err);
          res.status(500).json({error: "Error al insertar la nueva nota"});
          return;
        }

        console.log("nota creada:", result.insertId);
        res.json({message: "Inserción exitosa", insertId: result.insertId});
      }
    );
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

app.get("/listarNota", async (req, res) => {
  try {
    // Realizar la consulta a la base de datos
    conexion.query("SELECT * FROM notas", (err, results) => {
      if (err) {
        // En caso de error, mostrar un mensaje de error
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).json({error: "Error al ejecutar la consulta"});
        return;
      }

      // Si la consulta se realizó correctamente, mostrar los resultados
      if (results.length > 0) {
        console.log("Resultados de la consulta:", results);
        res.json(results);
      } else {
        console.log("No se encontraron resultados");
        res.status(404).json({message: "No se encontraron resultados"});
      }
    });
  } catch (error) {
    // En caso de error interno, mostrar un mensaje de error
    console.error("Error interno del servidor:", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

app.post("/actualizarNota", async (req, res) => {
  const {id, nota} = req.body;
  // Actualización de un registro existente
  try {
    // Realiza la actualización en la base de datos
    conexion.query(
      "UPDATE notas SET nota = ? WHERE id = ?",
      [nota, id],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar la nota:", err);
          res.status(500).json({error: "Error al actualizar la nota"});
          return;
        }

        console.log("Número de filas actualizadas:", result.affectedRows);
        res.json({
          message: "Actualización exitosa",
          affectedRows: result.affectedRows,
        });
      }
    );
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

export{app}

app.listen(puerto, () => {
  console.log(`Servidor iniciado en: localhost:${puerto}`);
});