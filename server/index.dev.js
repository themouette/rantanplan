// This is  the development entry point.

'use strict';

require("babel-register");
const run = require('./src').default;
const fs = require('fs');
const path = require('path');


const publicDir = path.resolve(__dirname, '..', 'client', 'build');

if (!fs.existsSync(publicDir)) {
  console.error('The public assets are not built yet.');
  console.error('Please run the `./bin/setup` command from repository root');
  console.error('to build everyting.')

  process.exit(1);
}

run({
  port: 1337,
  public: publicDir,
  sampler: 1000,
});

