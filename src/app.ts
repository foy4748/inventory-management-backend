import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalRoutes from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandlers';
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);

// App Routes
app.use('/api', globalRoutes);

app.get('/', (_: Request, res: Response) => {
  res.send({ success: true, message: 'Server is UP and RUNNING' });
});

app.use(globalErrorHandler);

export default app;
