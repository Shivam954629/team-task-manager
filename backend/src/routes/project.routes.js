const express = require("express");
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
  deleteProject,
} = require("../controllers/project.controller");
const protect = require("../middleware/auth.middleware");
const { requireProjectRole } = require("../middleware/role.middleware");

// All project routes require login
router.use(protect);

// Get all my projects and create a new project
router.get("/", getMyProjects);
router.post("/", createProject);

// Get a single project and delete it
router.get("/:projectId", getProjectById);
router.delete("/:projectId", deleteProject);

// Member management - only ADMIN can add or remove members
router.post("/:projectId/members", requireProjectRole("ADMIN"), addMember);
router.delete(
  "/:projectId/members/:userId",
  requireProjectRole("ADMIN"),
  removeMember,
);

module.exports = router;
