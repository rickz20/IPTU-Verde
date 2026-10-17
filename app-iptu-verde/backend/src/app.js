import './config/env.js';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();
const configuredOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigin =
  !configuredOrigins?.length || configuredOrigins.includes('*')
    ? '*'
    : configuredOrigins;

app.use(
  cors({
    origin: corsOrigin,
  }),
);
app.use(express.json({ limit: '16kb' }));

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use(authRoutes);

app.use((error, _request, response, _next) => {
  if (error.statusCode === 409) {
    return response.status(409).json({ erro: error.message });
  }

  console.error('Erro na API:', error);
  response.status(500).json({
    erro: 'Erro interno do servidor.',
  });
});

export default app;
