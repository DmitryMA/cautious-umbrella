const { parentPort } = require('worker_threads');

parentPort.on('message', ({ id }) => {
  setTimeout(() => {
    const result = `#${id} - processed`;
    parentPort.postMessage({ id, result });
  }, Math.floor(Math.random() * 2000));
});
