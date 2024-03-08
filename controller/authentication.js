const userSchema = require("../model/user");
const sessionSchema = require("../model/session");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res) => {
    console.log(req.body, "thisisreq");
    const { email, password } = req.body;
    const pass = await bcrypt.hash(password, 10);
    const sameUser = await userSchema.findOne({ email: email });
    if (sameUser) {
      // throw Error("Sorry, this email already exists. try something different");
      res.status(401).json({
        status: false,
        msg: "Sorry, this user already exists. try something different",
      });
    } else {
      const user = await userSchema.create({
        email: email,
        password: pass,
      });
      const token = jwt.sign(
        { user: user, userId: user.id },
        process.env.JWT_SECRET
      );
      //   createToken({ user: user, userId: user.id });
      Session = await sessionSchema.create({ userId: user._id });

      res.status(201).json({
        userid: user._id,
        status: true,
        user: user,
        token,
        sessionId: Session._id,
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    let Session;
    const user = await userSchema.findOne({ email: email });
    if (user) {
      const use = await bcrypt.compare(password, user.password);
      if (use) {
        const token = jwt.sign(
          { user: user, userId: user.id },
          process.env.JWT_SECRET
        );
        const activeSessionsCount = await sessionSchema.countDocuments({
          userId: user._id,
        });

        const maxLoginLimit = 3;

        if (activeSessionsCount >= maxLoginLimit) {
          return res
            .status(401)
            .json({ status: false, msg: "Maximum login limit exceeded" });
        } else {
          Session = await sessionSchema.create({ userId: user._id });
          // await Session.save();
          console.log(activeSessionsCount, Session);
        }

        res.status(201).json({
          userid: user._id,
          status: true,
          user: user,
          token,
          sessionId: Session._id,
        });
      } else {
        res.status(401).json({
          status: false,
          msg: "Sorry, your password was incorrect. Please double-check your password.",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        msg: "Sorry, your username or password was incorrect. Please double-check your password.",
      });
    }
  },
  logout: async (req, res) => {
    let { sessionId } = req.body;
    console.log(sessionId);
    sessionId = sessionId.replace(/^"|"$/g, "");

    try {
      const session = await sessionSchema.findOneAndDelete({ _id: sessionId });

      if (session) {
        res.json({ status: true, msg: "Session deleted successfully" });
      } else {
        res.status(404).json({ status: false, msg: "Session not found" });
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ status: false, msg: "Internal server error" });
    }
  },
};
