const { parentPort } = require('worker_threads');

parentPort.on('message', ({ id }) => {
  setTimeout(() => {
    const result = `#${id} - processed`;
    parentPort.postMessage({ id, result });
  }, 2000);
});
