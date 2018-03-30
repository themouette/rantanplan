import createMonitoring from './monitoring';
import createServer from './server';

export default function run(config) {
  const port = process.env.PORT || config.port;
  const monitoringInterval = config.sampler;
  const publicDir = config.public;

  const monitoring = createMonitoring(monitoringInterval);
  const server = createServer(port, publicDir, monitoring);

  monitoring.start();
  server.start();
}
