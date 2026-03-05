import prisma from "../utils/prisma.js";

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const parsePositiveInt = (value, fieldName) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw createHttpError(400, `${fieldName} must be an integer greater than 0`);
    }
    return parsed;
};

export const createCategory = async ({ name }, createdById) => {
    if (!name || !name.trim()) {
        throw createHttpError(400, "Category name is required");
    }

    const parsedCreatedById = parsePositiveInt(createdById, "createdById");

    // Only allow category creation by an existing admin user.
    const adminUser = await prisma.user.findUnique({
        where: { id: parsedCreatedById },
        select: { id: true, role: true }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
        throw createHttpError(403, "Only admins can create categories");
    }

    try {
        return await prisma.category.create({
            data: {
                name: name.trim(),
                createdById: parsedCreatedById
            }
        });
    } catch (error) {
        if (error.code === "P2002") {
            throw createHttpError(409, "Category already exists");
        }
        throw error;
    }
};

export const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: "asc" }
    });
};
