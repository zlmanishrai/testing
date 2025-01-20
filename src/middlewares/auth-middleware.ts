import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IPayload } from "../types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers["authorization"]?.split(" ")[1] || "";
  if (!token) {
    throw new Error("error");
  }
  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (!decoded) {
    throw new Error("error");
  }
  req.user = decoded as IPayload;
  next();
};
