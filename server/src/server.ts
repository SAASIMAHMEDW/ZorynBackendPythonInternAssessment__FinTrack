import app from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForDatabase = async (retries = 0): Promise<void> => {
  try {
    console.log(`[DB] 🔌 Connecting to database (Attempt ${retries + 1}/${MAX_RETRIES})...`);
    
    // Attempt to connect
    await prisma.$connect();
    
    // Try a simple query to ensure it's fully awake
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('[DB] ✅ Connection successful!');
  } catch (error) {
    if (retries + 1 >= MAX_RETRIES) {
      console.error(`\n[DB] ❌ CRITICAL: Failed to connect after ${MAX_RETRIES} attempts.`);
      console.error('[DB] Error Details:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }

    const delay = INITIAL_BACKOFF * Math.pow(2, retries);
    console.warn(`[DB] ⚠️ Connection failed. Retrying in ${delay / 1000}s...`);
    
    await sleep(delay);
    return waitForDatabase(retries + 1);
  }
};

const start = async () => {
  try {
    // Wait for DB before starting server
    await waitForDatabase();

    app.listen(config.port, () => {
      console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🚀  FinTrack API Server                    ║
  ║                                              ║
  ║   Port:        ${String(config.port).padEnd(28)}║
  ║   Environment: ${config.nodeEnv.padEnd(28)}║
  ║   Health:      http://localhost:${config.port}/api/health  ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
