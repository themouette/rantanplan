import createMonitoring from './monitoring';
import createServer from './server';
import opn from 'opn';

export default function run(config) {
  const port = process.env.PORT || config.port;
  const monitoringInterval = config.sampler;
  const publicDir = config.public;

  const monitoring = createMonitoring(monitoringInterval);
  const server = createServer(port, publicDir, monitoring);

  monitoring.start();
  server
    .start()
    .then(({ url }) => {
      if (config.openBrowser) { opn(url); }
    });
}
