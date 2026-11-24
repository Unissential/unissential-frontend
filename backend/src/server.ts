import 'dotenv/config';
import './register-paths';
import app from '@/app';
import prisma from '@/config/database';

const PORT = Number(process.env.PORT || 5000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║     UNISSENTIAL BACKEND SERVER         ║
╚════════════════════════════════════════╝
  
  Environment: ${NODE_ENV}
  Port: http://${HOST}:${PORT}
  API: http://${HOST}:${PORT}/api
  Health: http://${HOST}:${PORT}/api/health
  
  Database: ${process.env.DATABASE_URL ? 'configured' : 'Not configured'}
  
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
