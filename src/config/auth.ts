import { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You must log in to access dashboard");
    res.redirect("/users/login");
  }
};
export const ensureGuest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/dashboard");
  }
};
