import { body, query, param } from "express-validator";
import validateMiddleware from "../middlewares/validateMiddleware";

const validateTask = [
  body("title")
    .notEmpty()
    .withMessage("El título es requerido")
    .isString()
    .withMessage("El título debe ser un texto"),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage('El estado debe ser "pending" o "completed"'),
  body("user")
    .notEmpty()
    .withMessage("El usuario es requerido")
    .isMongoId()
    .withMessage("El usuario debe ser un ObjectId válido"),
  validateMiddleware,
];

const validateGetTasks = [
  query("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage('El estado debe ser "pending" o "completed"'),
  validateMiddleware,
];

const validateUpdateTaskStatus = [
  param("taskId").isMongoId().withMessage("El ID de la tarea no es válido"),
  validateMiddleware,
];

export { validateTask, validateGetTasks, validateUpdateTaskStatus };
