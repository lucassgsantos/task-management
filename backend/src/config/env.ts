import dotenv from 'dotenv';

dotenv.config();

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variável obrigatória ausente: ${name}`);
  }

  return value;
};

const getOptionalEnv = (name: string, fallback: string) => {
  return process.env[name]?.trim() || fallback;
};

const parsePort = (value: string) => {
  const port = Number(value);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`PORT inválida: ${value}`);
  }

  return port;
};

const corsOrigin = getOptionalEnv('CORS_ORIGIN', 'http://localhost:3000');

export const env = {
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),
  port: parsePort(getOptionalEnv('PORT', '5000')),
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  dbPath: getOptionalEnv('DB_PATH', 'data.db'),
  allowAllCorsOrigins: corsOrigin === '*',
  corsOrigins: corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
