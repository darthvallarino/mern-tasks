import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";
import User from "../models/User";
import { AppError } from "../errors/AppError";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, status, user } = req.body;

    const task = new Task({ title, status, user });
    await task.save();

    res.status(201).json({ message: "Tarea creada con éxito", task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).populate("user", "nickname");
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError("Tarea no encontrada", 400);
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({ message: "Tarea marcada como completada", task });
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Obtener cantidad de tareas por usuario
    const tasksByUser = await Task.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 }
        }
      }
    ]);

    // Calcular tiempo de finalización de tareas completadas
    const completedTasksData = await Task.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $project: {
          user: 1,
          completionTime: { $subtract: ["$updatedAt", "$createdAt"] }
        }
      }
    ]);

    // Calcular promedio de finalización global
    const totalCompletionTime = completedTasksData.reduce((sum, task) => sum + task.completionTime, 0);
    const avgCompletionTimeGlobal = completedTasksData.length > 0 ? totalCompletionTime / completedTasksData.length : 0;

    // Calcular promedio de finalización por usuario
    const completionTimeByUser = await Task.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: "$user",
          avgCompletionTime: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } }
        }
      }
    ]);

    // Obtener nombres de los usuarios
    const userIds = tasksByUser.map(user => user._id);
    const users = await User.find({ _id: { $in: userIds } }).select("_id nickname");

    // Mapear los datos con el nombre del usuario
    const completionTimeByUserWithNames = completionTimeByUser.map(user => {
      const userInfo = users.find((u: any) => u._id.toString() === user._id.toString());
      return {
        userId: user._id,
        userName: userInfo ? userInfo.nickname : "Usuario desconocido",
        avgCompletionTime: `${(user.avgCompletionTime / 1000 / 60).toFixed(2)} minutos`
      };
    });

    // Mapear los datos con el nombre del usuario
    const tasksByUserWithNames = tasksByUser.map(user => {
      const userInfo = users.find((u: any) => u._id.toString() === user._id.toString());
      return {
        userId: user._id,
        userName: userInfo ? userInfo.nickname : "Usuario desconocido",
        count: user.count
      };
    });

    // Transformar los datos
    const totalTasks = stats.reduce((sum, item) => sum + item.count, 0);
    const completedTasks = stats.find(item => item._id === 'completed')?.count || 0;
    const pendingTasks = stats.find(item => item._id === 'pending')?.count || 0;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: `${completionRate.toFixed(2)}%`,
      avgCompletionTimeGlobal: `${(avgCompletionTimeGlobal / 1000 / 60).toFixed(2)} minutos`,
      completionTimeByUser: completionTimeByUserWithNames,
      tasksByUser: tasksByUserWithNames
    });
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasks, updateTaskStatus };
