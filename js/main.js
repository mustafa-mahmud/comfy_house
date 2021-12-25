'use strict';

import Products from './Products.js';
import UI from './UI.js';

Products.fetchData().then((item) => {
  Products.processData(item);
  UI.displayProducts();
});
