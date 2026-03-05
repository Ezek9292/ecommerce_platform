import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10;

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const registerUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, role: true }
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "14d" });

    // Return `name` to match the Prisma User model.
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const registerAdmin = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw createHttpError(400, "All fields are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw createHttpError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Dedicated admin onboarding path with explicit ADMIN role.
    const adminUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "ADMIN" },
        select: { id: true, name: true, email: true, role: true }
    });

    return adminUser;
};

export const loginAdmin = async (credentials) => {
    const result = await loginUser(credentials);

    // Admin login endpoint should only issue success for ADMIN accounts.
    if (result.user.role !== "ADMIN") {
        throw createHttpError(403, "Forbidden: admin access required");
    }

    return result;
};
