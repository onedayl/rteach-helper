<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import db from '@/db.js'
import util from '@/util.js'

// function log (msg) {
//   console.log(`[ ${new Date().toISOString()} ] ${msg}`)
// }

// function formatDate (d) {
//   const year = d.getFullYear()
//   const month = polishing(d.getMonth() + 1)
//   const day = polishing(d.getDate())
//   return `${year}-${month}-${day}`
// }

// function polishing (num) {
//   return num < 10 ? `0${num}` : num.toString()
// }

export default {
  name: 'app',
  methods: {
    async postFetch (type, body={}) {
      const prefix = 'http://h5.rteach.com/services/citem'
      const key = this.$root.state.key
      let url
      body.ver = '1.0'
      body.sourceid = 'channel_wx'
    
      if (type == 'feedback') {
        url = `${prefix}/cfeedbackservice/queryfeedbackdetail?key=${key}`
        body.size = 75
    
      } else if (type == 'feedbacks') {
        url = `${prefix}/cfeedbackservice/listrecentfeedback?key=${key}`
        body.mobileno = null
        body.size = 102
    
      } else {
        url = `${prefix}/cuserservice/querysummaryinfo?key=${key}`
        body.mobileno = null
      }
      
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'zh-cn',
            'connection': 'keep-alive',
            'content-length': 64,
            'content-type': 'application/json;charset=UTF-8',
            'host': 'h5.rteach.com',
            'origin': 'http://wxauth.rteach.com',
            'proxy-connection': 'keep-alive',
            'referer': 'http://wxauth.rteach.com/?key=49a40eea-988d-48ef-b8e3-5b3bfa38863f',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_6 like Mac OS X) AppleWebKit/605.,1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.10(0x17000a21) NetType/WIFI Language/zh_CN'
          },
          body: JSON.stringify(body)
        })
        return res.json()
    
      } catch (error) {
        console.log(error)
        return null
      }
    }
  },
  mounted () {
    ipcRenderer.send('mounted')

    ipcRenderer.once('listening', function (evt, msg) {
      util.log(`Proxy listening on ${msg.ip}:8888`)
      this.$root.setIP(msg.ip)
    }.bind(this))

    ipcRenderer.once('connected', function () {
      util.log('Proxy connected')
      this.$root.checkConnected()
    }.bind(this))

    ipcRenderer.once('authorized', async function (evt, msg) {
      util.log('Proxy authorized with key ' + msg.key)
      this.$root.checkAuthorized(msg.key)

      // Query summary info
      const { currentStudent: info } = await this.postFetch('info')
      this.$root.setInfo(info)

      // Query & store feedback list
      const { data } = await this.postFetch('feedbacks')
      const feedbacks = data.map(d => {
        const time = d.ordertime.time
        const encodedTime = new Date(time)
        const date = util.formatDate(encodedTime)
        return {
          fid: d.feedbackid,
          time,
          date,
          operator: d.operator,
          content: d.content,
          theme: d.theme,
          thumbnail: d.thumbnailurl
        }
      })

      this.$root.setTotal(feedbacks.length)
      this.$root.setFeedbacks(feedbacks.slice(0, 10))

      try {
        await db.feedback.clear()
        await db.feedback.bulkPut(feedbacks)
      } catch (error) {
        console.log(error)
      }


    }.bind(this))
    
    ipcRenderer.once('disconnected', function () {
      util.log('Proxy disconnected')
    }.bind(this))
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

button {
  min-width: 80px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
