const prisma = require("../config/prisma");

// This middleware checks if the user has the required role in a project (ADMIN or MEMBER)
const requireProjectRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required." });
      }

      // Check if the user is a member of this project
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: req.user.id,
          },
        },
      });

      // If user is not a member of the project
      if (!member) {
        return res
          .status(403)
          .json({ message: "You are not a member of this project." });
      }

      // If user does not have the required role
      if (!roles.includes(member.role)) {
        return res
          .status(403)
          .json({
            message: "You do not have permission to perform this action.",
          });
      }

      req.memberRole = member.role;
      next();
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong while checking permissions." });
    }
  };

module.exports = { requireProjectRole };
