const mongoose = require("mongoose");

const taskmodel = {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: false,
  },
};
const Tasks = mongoose.model("tasks", taskmodel);
module.exports = Tasks;
