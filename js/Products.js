import Storage from './Storage.js';

class Products {
  jsonData;
  allCarts;

  constructor() {
    this.allCarts = Storage.getData() ? Storage.getData() : [];
  }

  async fetchData() {
    const res = await fetch('./products.json');
    const { items } = await res.json();

    return items;
  }

  processData(items) {
    this.jsonData = items.map((item) => {
      const { id } = item.sys;
      const { title } = item.fields;
      const { price } = item.fields;
      const { url } = item.fields.image.fields.file;
      return { id, title, price, image: url };
    });
  }
}

export default new Products();
