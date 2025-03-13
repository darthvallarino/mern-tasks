import { Router, Request, Response } from "express";
import authRoutes from "./authRoutes";
import taskRoutes from "./taskRoutes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API ok" });
});

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

export default router;