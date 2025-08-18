import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const protectAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Not authorized, no token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have admin access." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, token failed." });
  }
};

export const protectStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Not authorized, no token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    if (decoded.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have student access." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, token failed." });
  }
};
