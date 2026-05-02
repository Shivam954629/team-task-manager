const express = require("express");
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getDashboard,
} = require("../controllers/task.controller");
const protect = require("../middleware/auth.middleware");
const { requireProjectRole } = require("../middleware/role.middleware");

// All task routes require login
router.use(protect);

// Dashboard route - get all stats for logged in user
router.get("/dashboard", getDashboard);

// Get all tasks of a project - any member can view
router.get(
  "/:projectId/tasks",
  requireProjectRole("ADMIN", "MEMBER"),
  getProjectTasks,
);

// Create a task - only ADMIN can create
router.post("/:projectId/tasks", requireProjectRole("ADMIN"), createTask);

// Update a task - any member can update (e.g. change status)
router.patch(
  "/:projectId/tasks/:taskId",
  requireProjectRole("ADMIN", "MEMBER"),
  updateTask,
);

// Delete a task - only ADMIN can delete
router.delete(
  "/:projectId/tasks/:taskId",
  requireProjectRole("ADMIN"),
  deleteTask,
);

module.exports = router;
