let Product = function(priority, productTime, name) {
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