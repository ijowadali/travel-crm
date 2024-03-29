import '@src/assets/styles/main.scss';

import {createApp} from 'vue';
import App from '@src/App.vue';
import {faviconLoader} from '@src/constants/faviconLoader';
import {naiveUILoader} from '@src/constants/naiveUILoader';
import {setupNaive} from '@src/plugins/naive';
import {setupDirectives} from '@src/plugins/directives';
import {setupNaiveDiscreteApi} from '@src/plugins/naiveDiscreteApi';
import {setupStore} from '@src/store';
import {setupRouter} from '@src/router';
import print from 'vue3-print-nb'

const app = createApp(App);
app.use(print);
faviconLoader();
naiveUILoader();

setupNaive(app);

setupStore(app);

setupDirectives(app);

setupNaiveDiscreteApi();

setupRouter(app);

app.mount('#app');
