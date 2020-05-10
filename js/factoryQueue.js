let FactoryQueue = function() {
  let _queue = [];
  let _$queue = document.getElementById("factory-queue");

  const factoryConsole = new FactoryConsole();

  let addToQueue = (product) => {
    const addIndex = _queue.findIndex( queuedProduct => product.getPriority() > queuedProduct.getPriority());
    addIndex > -1 ? _queue.splice(addIndex, 0, product) : _queue.push(product);
    factoryConsole.write('QUEUE add PRIO' + product.getPriority());
    _render();
  }

  let getFromQueue = () => {
    if (_queue.length) {
      const element = _queue.shift();
      _render();
      factoryConsole.write('QUEUE get PRIO' + element.getPriority());
      return element;
    } else {
      return null;
    }

  }

  let _render = () => {
    _$queue.innerHTML = '';
    _queue.forEach((product, index) => {
      const $queueProduct = document.createElement("div");
      $queueProduct.className = 'queue-product priority-color-' + product.getPriority();
      $queueProduct.innerHTML = (index + 1) + '. Product PRIO ' + product.getPriority();
      _$queue.appendChild($queueProduct);
    })
  }


  return {
    getFromQueue: getFromQueue,
    addToQueue: addToQueue
  }
}