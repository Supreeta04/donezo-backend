const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    sharedWith: [{ type: String }] // list of emails
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
