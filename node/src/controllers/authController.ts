import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefresh } from "../services/jwt";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nickname, password } = req.body;
    const userExists = await User.findOne({ nickname });
    if (userExists) throw new AppError("Usuario ya registrado", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({ nickname, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nickname, password } = req.body;
    const user: IUser | null = await User.findOne({ nickname });
    if (!user) {
      throw new AppError("Credenciales incorrectas", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Credenciales incorrectas", 400);
    }

    const { accessToken, refreshToken } = generateTokens(
      (user._id as unknown as string).toString()
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user: (user._id as unknown as string).toString() });
  } catch (error) {
    next(error);
  }
};

const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("Token requerido", 401);
  }

  try {
    const payload = verifyRefresh(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError("Token inválido", 403);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      (user._id as unknown as string).toString()
    );
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    next(error);
  }
};

export { register, login, refresh, logout };
