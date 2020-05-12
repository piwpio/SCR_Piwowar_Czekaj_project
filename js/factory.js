const Factory = function(productsPriorities) {
  const _machinesNumber = navigator.hardwareConcurrency;
  const _productsPriorities = productsPriorities ? [...new Set(productsPriorities)] : [1,2,3];

  const _machines = [];
  const _queue = new FactoryQueue();
  const _$factory = document.getElementById("factory-machines");
  const _$factoryCreateButtons = document.getElementById("factory-create-buttons");

  const factoryConsole = new FactoryConsole();

  const init = () => {
    _createMachines();
    _createProductButtons();
  }

  const machineDoneNotificator = () => {
    _getFromQueue();
  }

  const _createMachines = () => {
    [...Array(_machinesNumber).keys()].forEach( (id) => {
      const machine = new Machine(id, machineDoneNotificator);
      _$factory.appendChild(machine.$getMachine());
      _machines.push(machine);
    });
  }

  const _createProductButtons = () => {
    _productsPriorities.forEach( priority => {
      const $button = document.createElement("button");
      $button.innerHTML  = 'Create PRIORITY ' + priority;
      $button.className  = 'product-button';
      $button.onclick = _requestProduct.bind(this, priority);
      _$factoryCreateButtons.appendChild($button);
    });
  }

  const _requestProduct = (priority) => {
    const product = new Product(priority);
    let machine = _getFirstFreeMachine();
    if (!machine) {
      machine = _getLowerPriorityBusyMachine(priority);
      if (machine) {
        machine.terminateProduction();
        _addToQueue(machine.getProducedProduct());
      }
    }
    machine ? _product(machine, product) : _addToQueue(product);
  }

  const _addToQueue = (product) => {
    _queue.addToQueue(product);
  }

  const _getFromQueue = () => {
    const product = _queue.getFromQueue();
    if (product) {
      _product(_getFirstFreeMachine(), product);
    } else if (_isFactoryProducing()) {
      // factoryConsole.write('!!! EMPTY QUEUE !!!');
    } else {
      factoryConsole.write('!!! EMPTY QUEUE, FACTORY IDLE !!!');
    }
  }

  const _product = (freeMachine, product) => {
    freeMachine.product(product);
  }

  const _getLowerPriorityBusyMachine = (priority) => {
    const filtered = _machines
      .filter(machine => machine.isBusy() && machine.getProducedProduct().getPriority() < priority)
      .sort((machineA, machineB) =>
        machineA.getProducedProduct().getPriority() - machineB.getProducedProduct().getPriority())
    return filtered.length ? filtered[0] : null;
  }

  const _getFirstFreeMachine = () => _machines.find( machine => !machine.isBusy());

  const _isFactoryProducing = () => _machines.some(machine => machine.isBusy());

  _getFromQueue();
  return {
    init: init,
    getMachines: () => _machines,
    getQueue: () => _queue,
    getConsole: () => factoryConsole
  };
}
