const express = require("express");
const routes = express.Router();

const userController = require("../controllers/userController");
const googleController = require("../controllers/googleAuth");
const githubController = require("../controllers/githubAuth");
routes.post("/signUp", userController.signUpUser);
routes.post("/login", userController.loginUser);
routes.post("/set-password", userController.setPassword);
routes.post("/google-auth", googleController.googleAuth);
routes.get(
  "/getAccessToken",
  githubController.exchangeGitHubCodeForAccessToken
);
routes.get("/getUserData", githubController.githubAuth);

module.exports = routes;
