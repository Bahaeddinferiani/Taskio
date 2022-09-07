const mongoose = require("mongoose");
mongoose.Schema;
const taskmodel = mongoose.Schema(
  {
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Tasks = mongoose.model("tasks", taskmodel);
module.exports = Tasks;
