export default class Timer {
  counter = 0;

  onTimerTick: null | ((str: string) => void);

  timerId: NodeJS.Timeout | null = null;

  constructor() {
    this.onTimerTick = null;
    this.reset();
  }

  reset(): Timer {
    this.counter = 0;
    this.start();
    return this;
  }

  init(value: number, callback: (str: string) => void): Timer {
    this.counter = value;
    this.onTimerTick = callback;
    return this;
  }

  start(): Timer {
    // если таймер запущен не делаем ничего
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.counter += 1;
        if (this.onTimerTick) this.onTimerTick(this.getTimeString());
      }, 1000);
    }

    return this;
  }

  stop(): Timer {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    return this;
  }

  getTimeString(): string {
    const hours = Math.floor(this.counter / 3600);
    const minutes = Math.floor((this.counter - hours * 3600) / 60);
    const seconds = this.counter % 60;
    const addZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
    return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
  }
}
