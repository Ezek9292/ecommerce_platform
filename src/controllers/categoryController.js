import { createCategory, getAllCategories } from "../services/categoryService.js";

export const create = async (req, res) => {
    try {
        // req.user.userId comes from JWT created at login.
        const category = await createCategory(req.body, req.user.userId);
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json({ categories });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
