import { Request, Response, NextFunction } from "express";
import { verifyAsync } from "../services/jwt";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
 
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Acceso denegado" });
  } else {
    const user = await verifyAsync(token).catch(() => {
      return res.status(403).json({ message: "Token inválido" });
    });

    (req as any).user = user;
    next();
  }
};

export { authenticateToken };
