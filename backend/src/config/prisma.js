const { PrismaClient } = require("@prisma/client");

// Create a single Prisma instance for the whole app
const prisma = new PrismaClient();

module.exports = prisma;
