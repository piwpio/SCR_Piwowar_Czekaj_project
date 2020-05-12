const DEFAULT_PRODUCT_TIME = 5000;
window.addEventListener('load', function () {
  if (window.Worker) {
    const factory = new Factory();
    window.factory = factory;
    window.onload = factory.init();
  } else {
    alert('No support for web workers, sorry :(')
  }
});

