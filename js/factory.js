let Factory = function(productsPriorities) {
  let _machinesNumber = navigator.hardwareConcurrency;
  let _productsPriorities = productsPriorities ? [...new Set(productsPriorities)] : [1,2,3];

  let _machines = [];
  let _queue = new FactoryQueue();
  let _$factory = document.getElementById("factory-machines");
  let _$factoryCreateButtons = document.getElementById("factory-create-buttons");

  const factoryConsole = new FactoryConsole();

  let init = () => {
    _createMachines();
    _createProductButtons();
  }

  let machineDoneNotificator = () => {
    _getFromQueue();
  }

  let _createMachines = () => {
    [...Array(_machinesNumber).keys()].forEach( (id) => {
      const machine = new Machine(id, machineDoneNotificator);
      _$factory.appendChild(machine.$getMachine());
      _machines.push(machine);
    });
  }

  let _createProductButtons = () => {
    _productsPriorities.forEach( priority => {
      const $button = document.createElement("button");
      $button.innerHTML  = 'Create PRIO ' + priority;
      $button.className  = 'product-button';
      $button.onclick = _requestProduct.bind(this, priority);
      _$factoryCreateButtons.appendChild($button);
    });
  }

  let _requestProduct = (priority) => {
    const product = new Product(priority);
    let machine = _getFirstFreeMachine();
    if (!machine) {
      machine = _getLowerPriorityBusyMachine(priority);
      if (machine) {
        _addToQueue(machine.getProducedProduct());
      }
    }
    machine ? _product(machine, product) : _addToQueue(product);
  }

  let _addToQueue = (product) => {
    _queue.addToQueue(product);
  }

  let _getFromQueue = () => {
    const product = _queue.getFromQueue();
    if (product) {
      _product(_getFirstFreeMachine(), product);
    } else {
      factoryConsole.write('!!! FACTORY IDLE !!!');
    }
  }

  let _product = (freeMachine, product) => {
    freeMachine.product(product);
  }

  const _getLowerPriorityBusyMachine = (priority) => {
    const filtered = _machines
      .filter(machine => machine.isBusy() && machine.getProducedProduct().getPriority() < priority)
      .sort((machineA, machineB) =>
        machineA.getProducedProduct().getPriority() - machineB.getProducedProduct().getPriority())
    return filtered.length ? filtered[0] : null;
  }

  let _getFirstFreeMachine = () => _machines.find( machine => !machine.isBusy());

  _getFromQueue();
  return {
    init: init
  };
}