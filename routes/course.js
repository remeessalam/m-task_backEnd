const express = require("express");
const {
  createCourse,
  getCourses,
  addChapter,
  addTopic,
} = require("../controller/course");

const routes = express.Router();

routes.route("/createcourse").post(createCourse);
routes.route("/addchapter").post(addChapter);
routes.route("/addtopic").post(addTopic);
routes.route("/").get(getCourses);

module.exports = routes;
