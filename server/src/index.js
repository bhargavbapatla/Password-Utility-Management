
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passwordRoutes from './router/passwordRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api", passwordRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});