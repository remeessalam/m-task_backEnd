const express = require("express");
const cors = require("cors");
const moongose = require("mongoose");
const user = require("./routes/user");
const course = require("./routes/course");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

moongose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("database connected"); 
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/authenticate", user);
app.use("/course", course);
// app.post("/authenticate", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log(username, password);
//     res.json({ success: true, message: "Authentication successful" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Authentication failed" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
