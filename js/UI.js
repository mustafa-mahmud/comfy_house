import Products from './Products.js';
import Storage from './Storage.js';

class UI {
  cartContainer = document.querySelector('.cart-content');
  cartBtn = document.querySelector('.cart-btn');
  overlayEl = document.querySelector('.cart-overlay');
  showCartEl = document.querySelector('.cart');
  closeCartEl = document.querySelector('.close-cart');
  clearCartEl = document.querySelector('.clear-cart');

  constructor() {
    this.init();
  }

  displayProducts() {
    const container = document.querySelector('.products-center');

    container.innerHTML = '';

    Products.jsonData.forEach((product, index) => {
      const inCart = Products.allCarts.find((cart) => cart.id === product.id);

      container.innerHTML += `
			<article class="product">
          <div class="img-container">
            <img
              src="${product.image}"
              alt="product"
              class="product-img"
            />
            <button class="bag-btn ${inCart ? 'incart' : ''}" data-id="${
        product.id
      }">
              <i class="fas fa-shopping-cart"></i>
							${inCart ? 'in cart' : '	add to bag'}
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
			`;
    });

    this.addEvents(
      'click',
      [...container.querySelectorAll('button')],
      this.addCart
    );
  }

  addEvents(type, listeners, eventFun) {
    if (Array.isArray(listeners)) {
      listeners.forEach((listener) =>
        listener.addEventListener(`${type}`, eventFun.bind(this))
      );
    } else {
      listeners.addEventListener(`${type}`, eventFun.bind(this));
    }
  }

  addCart(e) {
    const id = e.target.getAttribute('data-id');

    const userChoosen = Products.jsonData.find((product) => product.id === id);
    Products.allCarts.push({ ...userChoosen, amount: 1 });

    Storage.saveData(Products.allCarts);
    this.inputCarts();
    this.displayProducts();
    this.calculateTotal();
  }

  inputCarts() {
    this.cartBtn.querySelector('.cart-items').textContent =
      Products.allCarts.length;

    this.cartContainer.innerHTML = '';

    Products.allCarts.forEach((cart) => {
      this.cartContainer.innerHTML += `
					<div class="cart-item">
						<img src="${cart.image}" alt="product" />
						<div>
							<h4>${cart.title}</h4>
							<h5>$${cart.price}</h5>
							<span class="remove-item" data-id="${cart.id}">remove</span>
						</div>
						<div>
							<i class="fas fa-chevron-up up" data-id="${cart.id}"></i>
							<p class="item-amount">
								${cart.amount}
							</p>
							<i class="fas fa-chevron-down down" data-id="${cart.id}"></i>
						</div>
					</div>
			`;
    });

    this.addEvents(
      'click',
      [...this.cartContainer.querySelectorAll('.up')],
      this.updateAmount
    );
    this.addEvents(
      'click',
      [...this.cartContainer.querySelectorAll('.down')],
      this.updateAmount
    );
    this.addEvents(
      'click',
      [...this.cartContainer.querySelectorAll('.remove-item')],
      this.removeItem
    );
  }

  removeItem(e) {
    const id = e.target.getAttribute('data-id');
    const index = Products.allCarts.findIndex((index) => index.id === id);
    Products.allCarts.splice(index, 1);

    this.inputCarts();
    this.displayProducts();
    this.calculateTotal();
    Storage.saveData(Products.allCarts);
  }

  clearAllCarts() {
    Products.allCarts = [];
    this.inputCarts();
    this.displayProducts();
    this.calculateTotal();
    Storage.saveData(Products.allCarts);
  }

  updateAmount(e) {
    const id = e.target.getAttribute('data-id');
    const up_down = e.target.classList.contains('up');

    Products.allCarts.forEach((cart, index) => {
      if (up_down) if (cart.id === id) cart.amount++;
      if (!up_down) if (cart.id === id) cart.amount--;
      if (cart.amount < 1) Products.allCarts.splice(index, 1);
    });

    this.inputCarts();
    this.displayProducts();
    this.calculateTotal();
    Storage.saveData(Products.allCarts);
  }

  calculateTotal() {
    const cartTotal = document.querySelector('.cart-total');
    const total = Products.allCarts.map((cart) => cart.price * cart.amount);
    let amount = 0;

    if (total.length) amount = total.reduce((total, curr) => total + curr);
    console.log(total);
    cartTotal.textContent = `${total.length ? amount : '0'}`;
  }

  showCarts() {
    this.overlayEl.classList.add('transparentBcg');
    this.showCartEl.classList.add('showCart');
  }

  hideCarts() {
    this.overlayEl.classList.remove('transparentBcg');
    this.showCartEl.classList.remove('showCart');
  }

  init() {
    this.inputCarts();
    this.calculateTotal();
    this.addEvents('click', this.cartBtn, this.showCarts);
    this.addEvents('click', this.closeCartEl, this.hideCarts);
    this.addEvents('click', this.clearCartEl, this.clearAllCarts);
  }
}

export default new UI();
