import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './style.scss';
createApp(App).use(router).mount('body');
window.console.log(
  '%cMapotato',
  '\n  color: #fa2d48;\n  font-weight: bold;\n  font-size: 16vw;\n  padding: 1vw 0;\n  text-shadow: 0.7px 1px 0 rgb(255 255 255 / 100%),\n    1.4px 2px 0 rgb(255 255 255 / 96%),\n    2.1px 3px 0 rgb(255 255 255 / 92%),\n    2.8px 4px 0 rgb(255 255 255 / 88%),\n    1px 1px 2px rgb(100 100 100 / 70%);\n'
);
