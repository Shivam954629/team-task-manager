const prisma = require("../config/prisma");

// Create a new project - the creator automatically becomes ADMIN
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    // Create project and add creator as ADMIN member in one query
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: "ADMIN",
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.status(201).json({ message: "Project created successfully!", project });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create project.", error: err.message });
  }
};

// Get all projects where the logged in user is a member
const getMyProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: { some: { userId: req.user.id } },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects.", error: err.message });
  }
};

// Get a single project by ID with all its tasks and members
const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.projectId,
        members: { some: { userId: req.user.id } },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project." });
  }
};

// Add a new member to a project - only ADMIN can do this
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { projectId } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Member email is required." });
    }

    // Find the user by their email address
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email address." });
    }

    // Check if this user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: user.id },
      },
    });

    if (existingMember) {
      return res
        .status(409)
        .json({ message: "This user is already a member of the project." });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role: role || "MEMBER",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ message: "Member added successfully!", member });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add member.", error: err.message });
  }
};

// Remove a member from a project - only ADMIN can do this
const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Prevent admin from removing themselves
    if (userId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot remove yourself from the project." });
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    res.json({ message: "Member removed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member." });
  }
};

// Delete a project - only the project owner can do this
const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Only the owner can delete the project
    if (project.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the project owner can delete this project." });
    }

    await prisma.project.delete({ where: { id: req.params.projectId } });

    res.json({ message: "Project deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project." });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
  deleteProject,
};
