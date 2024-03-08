const courseSchema = require("../model/course");
const chapterSchema = require("../model/chapter");
const topicSchema = require("../model/topic");

module.exports = {
  createCourse: async (req, res) => {
    const { formData } = req.body;
    console.log(formData);
    // res.json({ status: 200, msg: "req and res done" });
    try {
      const { title, description, duration, category } = formData;

      const newCourse = new courseSchema({
        title: title,
        description: description,
        duration: duration,
        category: category,
      });

      await newCourse.save();

      res.status(201).json({
        success: true,
        message: "Course added successfully",
        course: newCourse,
      });
    } catch (error) {
      console.error("Error adding course:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  getCourses: async (req, res) => {
    try {
      const courses = await courseSchema.find().populate({
        path: "chapters",
        populate: {
          path: "topics",
          model: "Topic",
        },
      });

      return res.json({ success: true, courses });
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  addChapter: async (req, res) => {
    try {
      console.log("request reached");
      const { title, courseId } = req.body;

      const newChapter = new chapterSchema({
        title,
      });

      const savedChapter = await newChapter.save();

      const updatedCourse = await courseSchema
        .findByIdAndUpdate(
          courseId,
          { $push: { chapters: savedChapter._id } },
          { new: true }
        )
        .populate("chapters");

      res.status(200).json({
        success: true,
        message: "Topic added successfully",
        topic: savedChapter,
        updatedCourse,
      });
    } catch (error) {
      console.error("Error adding topic:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add topic",
      });
    }
  },
  addTopic: async (req, res) => {
    try {
      const { form, id } = req.body;
      const { title, description, content, attachments } = form;
      const newTopic = new topicSchema({
        title: title,
        description: description,
        content: content,
        attachments: attachments,
      });

      const savedTopic = await newTopic.save();

      //   const chapterId = req.params.chapterId;

      const updatedChapter = await chapterSchema
        .findByIdAndUpdate(
          id,
          { $push: { topics: savedTopic._id } },
          { new: true }
        )
        .populate("topics");

      console.log("Updated chapter:", id, updatedChapter);

      res
        .status(201)
        .json({ success: true, topic: savedTopic, chapter: updatedChapter });
    } catch (error) {
      console.error("Error adding topic:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
