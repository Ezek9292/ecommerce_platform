import { registerUser, loginUser, registerAdmin, loginAdmin } from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { token, user } = await loginUser(req.body);
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
};

export const adminRegister = async (req, res) => {
    try {
        const adminUser = await registerAdmin(req.body);
        res.status(201).json({ message: "Admin registered successfully", user: adminUser });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { token, user } = await loginAdmin(req.body);
        res.json({ message: "Admin login successful", token, user });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
};
