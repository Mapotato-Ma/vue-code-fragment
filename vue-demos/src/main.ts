import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './style.scss';
createApp(App).use(router).mount('body');
window.console.log(
  '%cMapotato',
  `
    color: #fa2d48;
    font-weight: bolder;
    font-size: 16vw;
    padding: 1vw 0;
    font-family: NNN;
    text-shadow: 0.7px 1px 0 rgb(255 255 255 / 100%),
      1.4px 2px 0 rgb(255 255 255 / 96%),
      2.1px 3px 0 rgb(255 255 255 / 92%),
      2.8px 4px 0 rgb(255 255 255 / 88%),
      1px 1px 2px rgb(100 100 100 / 70%);
  `
);
