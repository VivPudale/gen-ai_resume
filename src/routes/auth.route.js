const express = require("express");
const {
  create_user,
  login_user,
  logout_user,
  getUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", create_user);
authRouter.post("/login", login_user);
authRouter.get("/logout", logout_user);
authRouter.get("/get-me", authMiddleware, getUser);

module.exports = authRouter;
