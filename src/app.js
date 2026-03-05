import express from 'express';
import cors from 'cors';
import prisma from './utils/prisma.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);


app.get("/", async (req, res) => {
    // Prisma returns a Promise, so await before responding.
    const users = await prisma.user.findMany();
    res.json({ users });
});

export default app;
