import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const verifyRefresh = (refreshToken: string) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
    userId: string;
  };
};

const verifyAsync = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
      (err, user) => {
        if (err) return reject(err);
        resolve(user);
      }
    );
  });
};

export { generateTokens, verifyRefresh, verifyAsync };
