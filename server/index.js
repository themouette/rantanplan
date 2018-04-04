// this is the production entry point
'use strict';

const run = require('./dist').default;
const fs = require('fs');
const path = require('path');

// When we are in production, the public assets are available
// in './public'.
// Otherwise, when we mimic production environment, they are available
// in '../client/build'
function resolvePublicDir() {
  const productionAssets = path.resolve(__dirname, 'public');
  if (fs.existsSync(productionAssets)) return productionAssets;

  const developmentAssets = path.resolve(__dirname, '..', 'client', 'build');
  if (fs.existsSync(developmentAssets)) return developmentAssets;

  console.error('The public assets are not built yet.');
  console.error('Please run the `./bin/build` command from repository root');
  console.error('to build everyting for production.')

  process.exit(1);
}

run({
  port: 3000,
  public: resolvePublicDir(),
  sampler: 1000,
  openBrowser: true,
});
