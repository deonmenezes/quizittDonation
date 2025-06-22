import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import paymentRoutes from './src/routes/payment.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Use CORS middleware
app.use(cors({
    origin: 'https://quizitt-funds.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/api/v1/payment', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose is connected"))
    .catch((err) => console.log("Error in connecting Mongoose:", err));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});