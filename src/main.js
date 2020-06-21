import Vue from 'vue'
import Buefy from 'buefy'
import '@mdi/font/css/materialdesignicons.css'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(Buefy)
const store = {
  state: {
    ip: '*.*.*.*',
    connected: false,
    authorized: false,
    key: '',
    school: '*****',
    name: '*****',
    gender: 1,
    total: 0,
    feedbacks: [],
    downloadPath: '******',
  },
  setIP (ip) {
    this.state.ip = ip
  },
  checkConnected () {
    this.state.connected = true
  },
  checkAuthorized (key) {
    this.state.authorized =true
    this.state.key = key
  },
  setInfo (info) {
    this.state.school = info.bname
    this.state.name = info.studentname
    this.state.gender = info.sex == '男' ? 1 : 2
  },
  setTotal (total) {
    this.state.total = total
  },
  setFeedbacks (feedbacks) {
    this.state.feedbacks = feedbacks
  },
  setDownloadPath (downloadPath) {
    this.state.downloadPath = downloadPath
  }
}

new Vue({
  router,
  data: store,
  render: (h) => h(App),
}).$mount('#app')
