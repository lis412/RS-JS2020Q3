/* eslint-disable no-console */
import GameField from './js/GameField';

window.onload = () => {
  console.log('Hello Rolling Scopes!');
};

new GameField().init(4);
