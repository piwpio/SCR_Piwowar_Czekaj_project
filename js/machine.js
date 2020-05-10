let Machine = function(machineIndex, machineDoneNotificator) {
  let _state = 0;
  let _producedProduct = null;
  let _$machine = document.createElement("div");
  let _$machineInfo = document.createElement("div");
  let _worker = new Worker('js/worker.js');


  const factoryConsole = new FactoryConsole();

  let _init = () => {
    _$machine.className = 'machine';
    _$machineInfo.className = 'machine-info';
    _$machineInfo.innerHTML = 'MID: ' + machineIndex;
  }

  let _render = (product) => {
    _$machine.innerHTML = '';
    if (product) {
      _$machine.appendChild(product.$getProduct());
    }
    _$machine.appendChild(_$machineInfo);
  }

  let product = (product) => {
    _render(product);
    _state = 1;
    _producedProduct = product;
    factoryConsole.write('MACHINE ' + machineIndex + ' start PRIO ' + product.getPriority());
    _worker.postMessage({priority: product.getPriority()});
  }

  const _initWorker = () => {
    _worker.onmessage = e => {
      _state = 0;
      _producedProduct = null;
      _render();
      factoryConsole.write('MACHINE ' + machineIndex + ' finish PRIO ' + e.data.priority);
      machineDoneNotificator();
    };
  }

  _init();
  _initWorker();
  _render();
  return {
    isBusy: () => !!_state,
    getProducedProduct: () => _producedProduct,
    product: product,
    terminateProduction: _worker.terminate,
    $getMachine: () => _$machine
  };
}