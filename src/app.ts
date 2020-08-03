import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";
import { MongoURI } from "./config/keys";
import expressLayouts from "express-ejs-layouts";
import userRoutes from "./routes/users";
import genRoutes from "./routes/index";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
require("./config/passport")(passport);

// DB
mongoose
  .connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB port: 27017"))
  .catch(err => console.log(err));

const app: Application = express();

//EJS
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("view engine", "ejs");

//BodyParser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});
//Routes
app.use("/users", userRoutes);
app.use("/", genRoutes);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
