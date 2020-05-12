const FactoryQueue = function() {
  const _queue = [];
  const _$queue = document.getElementById("factory-queue");

  const factoryConsole = new FactoryConsole();

  const addToQueue = (product) => {
    const addIndex = _queue.findIndex( queuedProduct => product.getPriority() > queuedProduct.getPriority());
    addIndex > -1 ? _queue.splice(addIndex, 0, product) : _queue.push(product);
    factoryConsole.write('QUEUE add PRIORITY' + product.getPriority());
    _render();
  }

  const getFromQueue = () => {
    if (_queue.length) {
      const element = _queue.shift();
      _render();
      factoryConsole.write('QUEUE get PRIORITY' + element.getPriority());
      return element;
    } else {
      return null;
    }
  }

  const _render = () => {
    _$queue.innerHTML = '';
    _queue.forEach((product, index) => {
      const $queueProduct = document.createElement("div");
      $queueProduct.className = 'queue-product priority-color-' + product.getPriority();
      $queueProduct.innerHTML = (index + 1) + '. Product PRIORITY ' + product.getPriority();
      _$queue.appendChild($queueProduct);
    })
  }


  return {
    getFromQueue: getFromQueue,
    addToQueue: addToQueue
  }
}
