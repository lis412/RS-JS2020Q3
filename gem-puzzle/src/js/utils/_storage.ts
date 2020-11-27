/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function get(key: string, defaultValue = 'null'): any {
  return JSON.parse(window.localStorage.getItem(key) || defaultValue);
}

export function set(key: string, value: any): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function del(key: string): void {
  window.localStorage.removeItem(key);
}
