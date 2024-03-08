const express = require("express");
const { signup, login, logout } = require("../controller/authentication");

const routes = express.Router();

routes.route("/signup").post(signup);
routes.route("/login").post(login);
routes.route("/logout").post(logout);

module.exports = routes;
