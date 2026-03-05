const parsePositiveNumber = (value, fieldName) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return `${fieldName} must be a number greater than 0`;
    }
    return null;
};

const parsePositiveInt = (value, fieldName) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return `${fieldName} must be an integer greater than 0`;
    }
    return null;
};

export const validateCreateProduct = (req, res, next) => {
    const { name, price, stock, categoryId } = req.body;

    // Keep required field checks at route boundary for cleaner controller flow.
    if (!name || !String(name).trim()) {
        return res.status(400).json({ message: "name is required" });
    }

    const priceError = parsePositiveNumber(price, "price");
    if (priceError) {
        return res.status(400).json({ message: priceError });
    }

    const stockError = parsePositiveInt(stock, "stock");
    if (stockError) {
        return res.status(400).json({ message: stockError });
    }

    const categoryError = parsePositiveInt(categoryId, "categoryId");
    if (categoryError) {
        return res.status(400).json({ message: categoryError });
    }

    next();
};

export const validateUpdateProduct = (req, res, next) => {
    const { name, price, stock, categoryId } = req.body;

    // For updates, fields are optional, but any provided field must be valid.
    if (name !== undefined && !String(name).trim()) {
        return res.status(400).json({ message: "name cannot be empty" });
    }

    if (price !== undefined) {
        const priceError = parsePositiveNumber(price, "price");
        if (priceError) {
            return res.status(400).json({ message: priceError });
        }
    }

    if (stock !== undefined) {
        const stockError = parsePositiveInt(stock, "stock");
        if (stockError) {
            return res.status(400).json({ message: stockError });
        }
    }

    if (categoryId !== undefined) {
        const categoryError = parsePositiveInt(categoryId, "categoryId");
        if (categoryError) {
            return res.status(400).json({ message: categoryError });
        }
    }

    next();
};
