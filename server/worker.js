const { parentPort } = require('worker_threads');

parentPort.on('message', ({ id }) => {
  setTimeout(() => parentPort.postMessage({ id, status: 'done' }), 2000);
});
