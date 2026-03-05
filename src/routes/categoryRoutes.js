import express from "express";
import { create, getAll } from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public read for category listing.
router.get("/", getAll);

// Admin-only category creation as requested.
router.post("/", authenticate, authorize(["ADMIN"]), create);

export default router;
