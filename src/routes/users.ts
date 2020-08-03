import express, { Router, Request, Response, NextFunction } from "express";
const router: Router = express.Router();
import { ensureGuest } from "../config/auth";
import User from "../models/User";
import passport from "passport";
import bcrypt from "bcryptjs";

router.get("/login", ensureGuest, (req: Request, res: Response) => {
  res.render("login");
});

router.get("/register", ensureGuest, (req: Request, res: Response) => {
  res.render("register");
});

router.post("/register", (req: Request, res: Response) => {
  interface Error {
    msg: string;
  }
  let errors: Array<Error> = [];

  const { name, email, password, password2 } = req.body;
  //Fields missing?
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Passwords dont match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Password too short
  if (password.length < 6) {
    errors.push({ msg: "Password must be atleast 6 characters" });
  }

  // If error
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
    });
  } else {
    User.exists({ email })
      .then(exists => {
        if (exists) {
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
          });
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;

              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can login"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  throw err;
                });
            })
          );
        }
      })
      .catch(err => {
        throw err;
      });
  }
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req: Request, res: Response) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("login");
});
export default router;
