import mysql from "mysql";
import {config} from "dotenv";
config();

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_DATABASE || "sis_notas",
  port: process.env.DB_PORT || 3306,
});

// Conectar a la base de datos
conexion.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err.stack);
    return;
  }
  console.log("Conexión a la base de datos exitosa: ", conexion.threadId);
});

export{conexion}