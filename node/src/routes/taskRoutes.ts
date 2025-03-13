import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  validateTask,
  validateGetTasks,
  validateUpdateTaskStatus,
} from "../validators/taskValidator";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getTaskStats,
} from "../controllers/taskController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Operaciones de tareas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - status
 *         - user
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           description: Estado de la tarea
 *         user:
 *           type: string
 *           description: ID del usuario que creó la tarea
 *       example:
 *         title: "Aprender TypeScript"
 *         status: "pending"
 *         user: "67d1c878754524db2a867d90"
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarea creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authenticateToken, validateTask, createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *         description: Filtrar tareas por estado
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authenticateToken, validateGetTasks, getTasks);

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Actualiza el status de una tarea a "completed"
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea a actualizar
 *     responses:
 *       200:
 *         description: Tarea marcada como completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID de tarea no válido
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:taskId", validateUpdateTaskStatus, updateTaskStatus);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Obtiene estadísticas sobre las tareas, incluyendo tiempos de finalización
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Estadísticas de las tareas con tiempos de finalización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTasks:
 *                   type: integer
 *                   description: Número total de tareas
 *                 completedTasks:
 *                   type: integer
 *                   description: Número de tareas completadas
 *                 pendingTasks:
 *                   type: integer
 *                   description: Número de tareas pendientes
 *                 completionRate:
 *                   type: string
 *                   description: Porcentaje de tareas completadas
 *                 avgCompletionTimeGlobal:
 *                   type: string
 *                   description: Tiempo promedio global en minutos para completar una tarea
 *                 completionTimeByUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: ID del usuario
 *                       avgCompletionTime:
 *                         type: string
 *                         description: Tiempo promedio en minutos por usuario
 *                 tasksByUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del usuario
 *                       count:
 *                         type: integer
 *                         description: Número de tareas del usuario
 *       500:
 *         description: Error interno del servidor
 */
router.get("/stats", getTaskStats);

export default router;
