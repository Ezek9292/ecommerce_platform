import express from "express";
import { register, login, adminRegister, adminLogin } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Separate admin endpoints:
// - create admin requires an existing admin token.
router.post("/admin/register", authenticate, authorize(["ADMIN"]), adminRegister);
// - admin login allows only ADMIN accounts to succeed.
router.post("/admin/login", adminLogin);

export default router;
