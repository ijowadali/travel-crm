import '@src/assets/styles/main.scss';
import 'nprogress/nprogress.css';

import { createApp } from 'vue';
import App from '@src/App.vue';
import { faviconLoader } from '@src/constants/faviconLoader';
import { naiveUILoader } from '@src/constants/naiveUILoader';
import { setupStore } from '@src/store';
import { router, setupRouter } from '@src/router';
import { setupNaive } from '@src/plugins';

const app = createApp(App);

faviconLoader();
naiveUILoader();

setupNaive(app);

setupStore(app);

setupRouter(app);

await router.isReady();

app.mount('#app');
