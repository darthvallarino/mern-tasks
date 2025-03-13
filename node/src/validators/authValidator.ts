import { body } from "express-validator";
import validateMiddleware from "../middlewares/validateMiddleware";

const validateRegister = [
  body("nickname").trim().notEmpty().withMessage("El nombre es requerido"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .isAlphanumeric()
    .withMessage("La contraseña debe contener solo letras y números"),
  validateMiddleware,
];

const refreshToken = [
  body("refreshToken").notEmpty().withMessage("Token requerido"),
  validateMiddleware,
];

export { validateRegister, refreshToken };
