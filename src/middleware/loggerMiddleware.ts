import { NextFunction, Request, Response } from "express";

interface ILoggerMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

export const loggerMiddleware: ILoggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
