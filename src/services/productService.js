import prisma from "../utils/prisma.js";

// Attach HTTP status to service errors so controllers can respond consistently.
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

const parsePositiveNumber = (value, fieldName) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw createHttpError(400, `${fieldName} must be a number greater than 0`);
    }
    return parsed;
};

const ensureCategoryExists = async (categoryId) => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw createHttpError(404, "Category not found");
    }
};

export const createProduct = async (data) => {
    const { name, description, price, stock, categoryId } = data;

    if (!name) {
        throw createHttpError(400, "Name is required");
    }

    // Requirement from you: price cannot be 0.
    const parsedPrice = parsePositiveNumber(price, "price");
    // Requirement from you: stock cannot be 0 (and must be provided on create).
    const parsedStock = parsePositiveInt(stock, "stock");

    // Product should point to an existing category created via admin endpoints.
    if (categoryId === undefined || categoryId === null || categoryId === "") {
        throw createHttpError(400, "categoryId is required");
    }
    const parsedCategoryId = parsePositiveInt(categoryId, "categoryId");
    await ensureCategoryExists(parsedCategoryId);

    return await prisma.product.create({
        data: {
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            // Write relation via FK field; do not pass relation object directly.
            categoryId: parsedCategoryId
        },
        include: {
            category: true
        }
    });
};

export const getAllProducts = async () => {
    return await prisma.product.findMany({
        include: { 
            category: true 
        }
    });
};


export const getProductById = async (id) => {
    const parsedId = parsePositiveInt(id, "id");
    const product = await prisma.product.findUnique({
        where: { id: parsedId },
        include: { category: true }
    });

    if (!product) {
        throw createHttpError(404, "Product not found");
    }

    return product;
};

export const updateProduct = async (id, data) => {
    const parsedId = parsePositiveInt(id, "id");
    const { name, description, price, stock, categoryId } = data;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // Allow partial update, but if provided, price must remain > 0.
    if (price !== undefined) {
        updateData.price = parsePositiveNumber(price, "price");
    }

    // Allow partial update, but if provided, stock must remain > 0.
    if (stock !== undefined) {
        updateData.stock = parsePositiveInt(stock, "stock");
    }

    if (categoryId !== undefined) {
        const parsedCategoryId = parsePositiveInt(categoryId, "categoryId");
        await ensureCategoryExists(parsedCategoryId);
        updateData.categoryId = parsedCategoryId;
    }

    try {
        const product = await prisma.product.update({
            where: { id: parsedId },
            data: updateData,
            include: { category: true }
        });

        return product;
    } catch (error) {
        // Prisma P2025 => record to update does not exist.
        if (error.code === "P2025") {
            throw createHttpError(404, "Product not found");
        }
        throw error;
    }
};

export const deleteProduct = async (id) => {
    const parsedId = parsePositiveInt(id, "id");

    try {
        const product = await prisma.product.delete({
            where: { id: parsedId }
        });
        return product;
    } catch (error) {
        // Prisma P2025 => record to delete does not exist.
        if (error.code === "P2025") {
            throw createHttpError(404, "Product not found");
        }
        throw error;
    }
};
