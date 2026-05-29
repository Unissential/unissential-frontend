import express from 'express';
import cors from 'cors';
import routes from '@/routes';
import { errorMiddleware, loggingMiddleware } from '@/middleware';

const app = express();

// ==================== MIDDLEWARE ====================
// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logging
app.use(loggingMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== ROUTES ====================
app.use('/api', routes);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// ==================== ERROR HANDLER ====================
app.use(errorMiddleware);

export default app;
