import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { ensureAuthenticated, ensureGuest } from "../config/auth";

router.get("/", ensureGuest, (req: Request, res: Response) => {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req: Request, res: Response) => {
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    date: Date;
  }
  const user: User = req.user as User;
  res.render("dashboard", {
    name: user.name,
  });
});

export default router;
