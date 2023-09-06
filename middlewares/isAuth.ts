import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  isAuth: boolean;
  userId: string;
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken: any = jwt.verify(token, "v1sion");
    console.log("token: " + decodedToken);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    req.isAuth = false;
    return next();
  }
};
