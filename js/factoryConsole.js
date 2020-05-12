const FactoryConsole = function() {
  const _$console = document.getElementById("factory-console");

  const write = (message) => {
    const $message = document.createElement("div");
    $message.className = 'console-message';
    $message.innerHTML = '# ' + message;
    _$console.prepend($message);
  }

  const clear = () => {
    _$console.innerHTML = '';
  }

  return {
    write: write,
    clear: clear
  }
}
