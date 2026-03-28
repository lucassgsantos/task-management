import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.info(`Backend disponível em http://localhost:${env.port}`);
});
