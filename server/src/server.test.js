import createServer from './server';
import fetch from 'node-fetch';


describe('Server', () => {
  const monitoring = (testData) => ({
    getData: () => typeof testData === 'function' ? testData() : testData,
  });

  const publicDir = __dirname;

  // A simple utility to generate a url for both ip v6 and ip v4
  const formatUrl = ({ address, port }, path) => {
    let hostname;

    if (address.indexOf(':') > -1) {
      // this is an ipv6 address
      hostname = `[${address}]:${port}`;
    } else {
      hostname = `${address}:${port}`;
    }

    return `http://${hostname}${path}`;
  };

  test('should listen on `port` given as argument', () => {
    const server = createServer(5000, publicDir, monitoring('test data'));
    return server.start()
      .then(({ port }) => {
        expect(port).toBe(5000);
        server.stop();
      });
  });

  test('should expose GET /api/statistics', () => {
    const server = createServer(undefined, publicDir, monitoring('http data'));
    return server.start()

      // the actual test is here
      .then((infos) => fetch(formatUrl(infos, '/api/statistics')))
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.text()).resolves.toBe('"http data"');
      })

      // teardown and error handling
      .then(() => { server.stop(); })
      .catch((err) => {
        server.stop();
        throw err;
      });
  });

  test('should handle monitoring service error', () => {
    const server = createServer(
      undefined,
      publicDir,
      monitoring(() => { throw new Error('Monitoring Error'); })
    );
    return server.start()

      // the actual test is here
      .then((infos) => fetch(formatUrl(infos, '/api/statistics')))
      .then((response) => {
        expect(response.status).toBe(500);
      })

      // teardown and error handling
      .then(() => { server.stop(); })
      .catch((err) => {
        server.stop();
        throw err;
      });
  });

  test('should be possible to start server several times', () => {
    const server = createServer(undefined, publicDir, monitoring('http data'));
    return server.start()
      .then(() => server.start())

      // teardown and error handling
      .then(() => { server.stop(); })
      .catch((err) => {
        server.stop();
        throw err;
      });
  });

  test('should not fail is stopped when not started', () => {
    const server = createServer(undefined, publicDir, monitoring('http data'));

    server.stop();
  });
});
