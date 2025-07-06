const Task = require("../models/Task");
const admin = require("firebase-admin"); 


exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.uid;

    const tasks = await Task.find({
      $or: [
        { createdBy: userId },
        { sharedWith: userId }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // ✅ Log before saving
    console.log("📥 Creating task for user:", req.user.uid);
    console.log("📋 Task details:", { title, description, dueDate });

    const task = new Task({
      title,
      description,
      dueDate,
      createdBy: req.user.uid, 
    });

    const savedTask = await task.save();

   
    console.log("✅ Task saved:", savedTask);

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.uid },
      { title, description, status, dueDate, completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or not yours" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.uid,
    });

    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });

    res.json({ message: "Task deleted successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};


exports.shareTask = async (req, res) => {
  const { email } = req.body; 
  const taskId = req.params.id;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required to share" });
    }

   
    console.log("📨 Share request received for email:", email);

    
    const userRecord = await admin.auth().getUserByEmail(email);
    const sharedUID = userRecord.uid;

    
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.uid },
      { $addToSet: { sharedWith: sharedUID } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or not owned by you" });
    }

    res.status(200).json({ message: `Task shared with ${email}`, task });
  } catch (err) {
    console.error("❌ Error sharing task:", err);
    res.status(500).json({ message: "Error sharing task", error: err.message });
  }
};
