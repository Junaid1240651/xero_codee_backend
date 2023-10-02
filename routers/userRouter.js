const express = require("express");
const routes = express.Router();
const { verifyToken } = require("../jwt/jwtAuth"); // Import JWT functions

const userController = require("../controllers/userController");
const googleController = require("../controllers/googleAuth");
const githubController = require("../controllers/githubAuth");
const verifyTokenController = require("../controllers/verifyToken");
routes.post("/signUp", userController.signUpUser);
routes.post("/login", userController.loginUser);
routes.post("/set-password", userController.setPassword);
routes.post("/google-auth", googleController.googleAuth);
routes.get(
  "/getAccessToken",
  githubController.exchangeGitHubCodeForAccessToken
);
routes.get("/getUserData", githubController.githubAuth);
routes.get("/api/verify-token", verifyToken, verifyTokenController.verifyToken);

module.exports = routes;
