const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  shareTask, 
} = require("../controllers/taskController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

router.put("/:id/share", verifyToken, shareTask);

module.exports = router;
