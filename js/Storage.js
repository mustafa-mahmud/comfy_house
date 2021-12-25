export default class Storage {
  constructor() {}

  static saveData(data) {
    localStorage.setItem('comfy', JSON.stringify(data));
  }

  static getData() {
    return JSON.parse(localStorage.getItem('comfy'));
  }
}
