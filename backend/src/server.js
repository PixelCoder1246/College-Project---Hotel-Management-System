require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✔ Database connection established successfully');

    const server = app.listen(PORT, () => {
      console.log(`✔ Server is running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\nSHUTDOWN: ${signal} received. Closing resources...`);

      server.close(async () => {
        console.log('✔ HTTP server closed');
        await prisma.$disconnect();
        console.log('✔ Database disconnected');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('✘ Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('✘ Initialization error:', error);
    process.exit(1);
  }
}

main();
