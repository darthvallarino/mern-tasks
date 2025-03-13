import { Router } from "express";
import { validateRegister, refreshToken } from "../validators/authValidator";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Autenticación de usuario
 */

/**
 * @swagger
 * /auth/users:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post("/users", validateRegister, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario logueado exitosamente
 */
router.post("/login", validateRegister, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresca el token de usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco
 *     responses:
 *       201:
 *         description: Token refrescado exitosamente
 */
router.post("/refresh", refreshToken, refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra la sesión de usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco
 *     responses:
 *       201:
 *         description: Sesión cerrada exitosamente
 */
router.post("/logout", refreshToken, logout);

export default router;
