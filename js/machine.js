let Machine = function(machineIndex, machineDoneNotificator) {
  let _state = 0;
  let _producedProduct = null;
  let _$machine = document.createElement("div");
  let _$machineInfo = document.createElement("div");
  let _worker = new Worker('js/worker.js');


  const factoryConsole = new FactoryConsole();

  const _init = () => {
    _$machine.className = 'machine';
    _$machineInfo.className = 'machine-info';
    _$machineInfo.innerHTML = 'MID: ' + machineIndex;
  }

  const _initWorker = () => {
    _worker.onmessage = e => {
      _state = 0;
      _producedProduct = null;
      _render();
      factoryConsole.write('MACHINE ' + machineIndex + ' finish PRIORITY ' + e.data.priority);
      machineDoneNotificator();
    };
  }

  const _render = (product) => {
    _$machine.innerHTML = '';
    if (product) {
      _$machine.appendChild(product.$getProduct());
    }
    _$machine.appendChild(_$machineInfo);
  }

  const product = (product) => {
    _render(product);
    _state = 1;
    _producedProduct = product;
    factoryConsole.write('MACHINE ' + machineIndex + ' start PRIORITY ' + product.getPriority());
    _worker.postMessage({priority: product.getPriority()});
  }

  const terminateProduction = () => {
    _worker.terminate();
  }

  _init();
  _initWorker();
  _render();
  return {
    isBusy: () => !!_state,
    getProducedProduct: () => _producedProduct,
    product: product,
    terminateProduction: terminateProduction,
    $getMachine: () => _$machine
  };
}
