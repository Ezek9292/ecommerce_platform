import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../services/productService.js';

export const create = async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        // Service can attach status; default to 500 for unknown errors.
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json({ products });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.json({ product });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const product = await updateProduct(req.params.id, req.body);
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
