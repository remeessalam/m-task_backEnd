const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Topic", topicSchema);
