import { Strategy as LocalStrategy } from "passport-local";

import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcryptjs";

module.exports = (passport: any) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "Email is not registered" });
          } else {
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                done(null, false, { message: "Password Incorrect" });
              }
            });
          }
        })
        .catch(err => {
          throw err;
        });
    })
  );
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    date: Date;
  }
  passport.serializeUser((user: User, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
