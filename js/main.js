const DEFAULT_PRODUCT_TIME = 5000;

const Factory = function(machinesSpeedFactor, productsPriorities) {
  let _machinesSpeedFactor = machinesSpeedFactor || [1];
  let _productsPriorities = productsPriorities ? [...new Set(productsPriorities)] : [1,2,3];

  let _machines = [];
  let _queue = new FactoryQueue();
  let _$factory = document.getElementById("factory-machines");
  let _$factoryCreateButtons = document.getElementById("factory-create-buttons");

  let init = () => {
    _createMachines();
    _createProductButtons();
  }

  let machineDoneNotificator = () => {
    _getFromQueue();
  }

  let _createMachines = () => {
    _machinesSpeedFactor.forEach( (speedFactor, index) => {
      const machine = new Machine(index, speedFactor, machineDoneNotificator);
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
    const freeMachine = _getFirstFreeMachine();
    const product = new Product(priority);
    freeMachine ? _product(freeMachine, product) : _addToQueue(product);
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

  let _isAnyMachineFree = () => _machines.some( machine => !machine.isBusy());
  let _getFirstFreeMachine = () => _machines.find( machine => !machine.isBusy());

  _getFromQueue();
  return {
    init: init
  };
}

const Machine = function(machineIndex, speedFactor, machineDoneNotificator) {
  let _speedFactor = speedFactor || 1;
  let _state = 0;
  let _$machine = document.createElement("div");
  let _$speedFactor = document.createElement("div");

  let _init = () => {
    _$machine.className = 'machine speed-factor-color-' + _speedFactor;
    _$speedFactor.className = 'machine-speed-factor';
    _$speedFactor.innerHTML = 'MID: ' + machineIndex + '<br>SF: ' + _speedFactor;
  }

  let _render = (product) => {
    _$machine.innerHTML = '';
    if (product) {
      _$machine.appendChild(product.$getProduct());
    }
    _$machine.appendChild(_$speedFactor);
  }

  let product = (product) => {
    _render(product);
    _state = 1;
    factoryConsole.write('MACHINE ' + machineIndex + ' start PRIO ' + product.getPriority());
    setTimeout(() => {
      _state = 0;
      _render();
      factoryConsole.write('MACHINE ' + machineIndex + ' finish PRIO ' + product.getPriority());
      machineDoneNotificator();
    }, product.getProductTime() * (1/_speedFactor));
  }

  _init();
  _render();
  return {
    getSpeedFactor: () => _speedFactor,
    isBusy: () => !!_state,
    product: product,
    $getMachine: () => _$machine
  };
}

const Product = function(priority, productTime, name) {
  let _priority = priority || 1;
  let _productTime = productTime ? productTime * _priority : DEFAULT_PRODUCT_TIME;
  let _name = name || 'product priority' + _priority;
  let _$product = document.createElement("div");

  let _init = () => {
    _$product.className = 'product priority-color-' + _priority;
    _$product.innerHTML = 'PRIO ' + _priority;
  }

  _init();
  return {
    getPriority: () => _priority,
    getName: () => _name,
    getProductTime: () => _productTime,
    $getProduct: () => _$product
  }
}

const FactoryQueue = function() {
  let _queue = [];
  let _$queue = document.getElementById("factory-queue");

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

const FactoryConsole = function() {
  let _$console = document.getElementById("factory-console");

  let write = (message) => {
    const $message = document.createElement("div");
    $message.className = 'console-message';
    $message.innerHTML = '# ' + message;
    _$console.prepend($message);
  }

  return {
    write: write
  }
}

const factoryConsole = new FactoryConsole();
const factory = new Factory();
window.onload=factory.init();