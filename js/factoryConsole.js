let FactoryConsole = function() {
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