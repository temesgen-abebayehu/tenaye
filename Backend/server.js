import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import userRouter from './routes/user.route.js';
import doctorRouter from './routes/doctor.route.js';
import appointmentRouter from './routes/appointment.route.js';
import chatbotRouter from './routes/chatbot.route.js';
import discussionRouter from './routes/discussion.route.js';
import resourceRouter from './routes/resource.route.js';
import paymentRouter from './routes/payment.route.js';
import chatDoctorRouter from './routes/chatWithDoctor.route.js';
import { cloudinary_delete } from './config/cloudinaryCnfig.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = 3000;

connectDB();

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/chatbot', chatbotRouter);
app.use("/api/discussions", discussionRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/chatdoctors', chatDoctorRouter);

app.post("/api/deleteImage", cloudinary_delete);

app.listen(PORT, () => {
    console.log(`server on at http://localhost:${PORT}`);
})