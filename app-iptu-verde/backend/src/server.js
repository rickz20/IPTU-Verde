import './config/env.js';
import app from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3001', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um número entre 1 e 65535.');
}

app.listen(port, '0.0.0.0', () => {
  console.log(`IPTU Verde backend disponível na porta ${port}.`);
});
