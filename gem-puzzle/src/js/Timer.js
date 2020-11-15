export default class Timer {
  constructor() {
    this.reset();
  }

  reset() {
    this.counter = 0;
  }

  init(value, callback) {
    this.counter = value;
    this.callback = callback;
    return this;
  }

  start() {
    // если таймер запущен не делаем ничего
    if (this.timerId) return;

    this.timerId = setInterval(() => {
      this.counter += 1;
      if (this.callback) this.callback(this.getTimeString());
    }, 1000);
  }

  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = 0;
    }
  }

  getTimeString() {
    const hours = Math.floor(this.counter / 3600);
    const minutes = Math.floor((this.counter - hours * 3600) / 60);
    const seconds = this.counter % 60;
    const addZero = (value) => (value < 10 ? `0${value}` : `${value}`);
    return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
  }
}
