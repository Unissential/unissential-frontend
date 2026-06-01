import dotenv from 'dotenv';
import app from '@/app';
import prisma from '@/config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     UNISSENTIAL BACKEND SERVER         ║
╚════════════════════════════════════════╝
  
  Environment: ${NODE_ENV}
  Port: http://localhost:${PORT}
  API: http://localhost:${PORT}/api
  Health: http://localhost:${PORT}/api/health
  
  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}
  
  Ready to accept requests! 🚀
  `);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server shut down successfully');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
