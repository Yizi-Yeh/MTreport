import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';

axios.defaults.withCredentials = true
import App from './App';
import router from './router';
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios, axios);
Vue.use(Loading);
Vue.component('Loading', Loading);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
