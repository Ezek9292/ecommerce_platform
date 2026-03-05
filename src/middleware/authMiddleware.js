import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export const authorize = (roles) => (req, res, next) => {
    // Normalize to array so route usage is predictable: authorize(["ADMIN"]).
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: you do not have rights" });
    }

    next();
};
