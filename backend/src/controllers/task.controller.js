const prisma = require("../config/prisma");

// Create a new task inside a project - only ADMIN can create tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId } =
      req.body;
    const { projectId } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    // If assignee is provided, make sure they are a project member
    if (assigneeId) {
      const isMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: { projectId, userId: assigneeId },
        },
      });

      if (!isMember) {
        return res
          .status(400)
          .json({ message: "Assignee must be a member of this project." });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        creatorId: req.user.id,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ message: "Task created successfully!", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task.", error: err.message });
  }
};

// Get all tasks of a project with optional filters
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assigneeId } = req.query;

    // Build filter object based on query parameters
    const where = { projectId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

// Update a task - any project member can update status, only ADMIN can change other fields
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assigneeId } =
      req.body;

    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    res.json({ message: "Task updated successfully!", task: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update task.", error: err.message });
  }
};

// Delete a task - only ADMIN can delete tasks
const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    await prisma.task.delete({ where: { id: req.params.taskId } });

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task." });
  }
};

// Get dashboard stats - total tasks, overdue, my assigned tasks
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects where this user is a member
    const myMemberships = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });

    const projectIds = myMemberships.map((m) => m.projectId);

    // Run all count queries at the same time for better performance
    const [total, todo, inProgress, done, overdue, myTasks, totalProjects] =
      await Promise.all([
        // Total tasks in all my projects
        prisma.task.count({ where: { projectId: { in: projectIds } } }),

        // Tasks with TODO status
        prisma.task.count({
          where: { projectId: { in: projectIds }, status: "TODO" },
        }),

        // Tasks currently in progress
        prisma.task.count({
          where: { projectId: { in: projectIds }, status: "IN_PROGRESS" },
        }),

        // Completed tasks
        prisma.task.count({
          where: { projectId: { in: projectIds }, status: "DONE" },
        }),

        // Overdue tasks - due date passed and not completed
        prisma.task.count({
          where: {
            projectId: { in: projectIds },
            dueDate: { lt: new Date() },
            status: { not: "DONE" },
          },
        }),

        // My assigned tasks that are not done yet
        prisma.task.findMany({
          where: { assigneeId: userId, status: { not: "DONE" } },
          include: {
            project: { select: { name: true } },
          },
          orderBy: { dueDate: "asc" },
          take: 5,
        }),

        // Total number of projects I am part of
        prisma.project.count({ where: { members: { some: { userId } } } }),
      ]);

    res.json({
      totalProjects,
      totalTasks: total,
      todo,
      inProgress,
      done,
      overdue,
      myTasks,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load dashboard data.", error: err.message });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getDashboard,
};
