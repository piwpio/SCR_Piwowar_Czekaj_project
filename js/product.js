const Product = function(priority, productTime, name) {
  const _priority = priority || 1;
  const _productTime = productTime ? productTime * _priority : DEFAULT_PRODUCT_TIME;
  const _name = name || 'product priority' + _priority;
  const _$product = document.createElement("div");

  const _init = () => {
    _$product.className = 'product priority-color-' + _priority;
    _$product.innerHTML = 'PRIORITY ' + _priority;
  }

  _init();
  return {
    getPriority: () => _priority,
    getName: () => _name,
    getProductTime: () => _productTime,
    $getProduct: () => _$product
  }
}
