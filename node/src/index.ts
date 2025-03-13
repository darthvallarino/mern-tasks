import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import router from "./routes";
import connect from "./db";
import { errorHandler } from "./middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT is not defined");

connect();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/", router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/docs`);
});
