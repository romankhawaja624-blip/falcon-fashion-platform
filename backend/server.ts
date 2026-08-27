// FALCON Backend Server Entry Point
// Real Node.js HTTP runtime using Express
// Connects to PostgreSQL via pg driver pool

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkConnection } from './db/pool';
import { applySchema } from './db/migrate';
import { seedDatabase } from './db/seed';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes      from './routes/authRoutes';
import aiRoutes        from './routes/aiRoutes';
import checkoutRoutes  from './routes/checkoutRoutes';
import orderRoutes     from './routes/orderRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import supportRoutes   from './routes/supportRoutes';
import adminRoutes     from './routes/adminRoutes';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// --- CORS Configuration ---
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Body parsing ---
app.use(express.json({ limit: '1mb' }));

// --- Health Check ---
app.get('/api/health', async (_req, res) => {
  const dbHealthy = await checkConnection();
  const status    = dbHealthy ? 200 : 503;
  res.status(status).json({
    success: dbHealthy,
    data: {
      server:   'ok',
      database: dbHealthy ? 'ok' : 'unreachable',
      timestamp: new Date().toISOString(),
      version:  '1.0.0',
    },
  });
});

// --- API Routes ---
app.use('/api/auth',      authRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/checkout',  checkoutRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/support',   supportRoutes);
app.use('/api/admin',     adminRoutes);

// --- 404 & Error Handling ---
app.use('/api', notFound);
app.use(errorHandler);

// --- Server Startup ---
async function start(): Promise<void> {
  console.log('[FALCON] Starting backend server...');

  // Check PostgreSQL connectivity
  const dbUp = await checkConnection();
  if (dbUp) {
    console.log('[FALCON] PostgreSQL connection established.');

    // Apply schema (idempotent CREATE IF NOT EXISTS)
    try {
      await applySchema();
    } catch (err: any) {
      console.error('[FALCON] Schema migration failed:', err.message);
    }

    // Seed development data (idempotent ON CONFLICT DO NOTHING)
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedDatabase();
      } catch (err: any) {
        console.error('[FALCON] Seed failed:', err.message);
      }
    }
  } else {
    console.warn('[FALCON] ⚠️  PostgreSQL is not reachable. Server will start but database operations will fail.');
    console.warn('[FALCON]    Ensure PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE are configured in .env');
  }

  const server = app.listen(PORT, () => {
    console.log(`[FALCON] Backend server running on http://localhost:${PORT}`);
    console.log(`[FALCON] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[FALCON] Database: ${dbUp ? '✅ Connected' : '❌ Unavailable'}`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`[FALCON] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        const { closePool } = await import('./db/pool');
        await closePool();
        console.log('[FALCON] Database pool closed. Server shutdown complete.');
        process.exit(0);
      } catch (err) {
        console.error('[FALCON] Error closing database pool:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[FALCON] Fatal startup error:', err);
  process.exit(1);
});

export default app;
