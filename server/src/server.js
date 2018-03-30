import createDebug from 'debug';
import express from 'express';


const debug = createDebug('rantanplan:server:debug');
const error = createDebug('rantanplan:server:error');

// A simple log middleware to log the called urls
// For a real world application, we would rely on something more battletested,
// but this implementation relies on `debug`, just as all the other logs here.
const logger = (req, res, next) => {
  next();
  debug(`Call route ${req.path}`);
};

// Create the server.
const createServer = (port, publicDir, monitoring) => {
  // Keep a reference to current listener
  // It allows to close the server and access
  let listener;
  const server = express();

  server.use(logger);

  server.get('/api/statistics', (req, res) => {
    res.json(monitoring.getData());
  });

  server.use(express.static(publicDir));

  const start = () => {
    // If the server is already listening, then return current information.
    if (listener) {
      const { address, port } = listener.address();
      return Promise.resolve({ address, port });
    }

    // Start the server
    return new Promise((resolve, reject) => {
      listener = server.listen(port, () => {
        const { address, port } = listener.address();
        debug(`Server listens on http://${address}:${port}`);
        resolve({ address, port });
      });
    });
  };

  const stop = () => {
    if (listener) listener.close();
  };

  return { start, stop };
};

export default createServer;
