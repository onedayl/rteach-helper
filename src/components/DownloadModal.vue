<template>
  <div class="modal-card" style="width: 400px; border-radius: 2px;">
    <section class="modal-card-body">
      <b-field label="日期范围">
        <b-datepicker
          v-model="dates"
          range
        ></b-datepicker>
      </b-field>
      <b-field label="下载位置">
        <b-button
          icon-left="folder"
          expanded
          @click="onChooseFolder"
        >选择文件夹</b-button>
      </b-field>
      <small v-show="this.state.downloadPath">{{ this.state.downloadPath}}</small>
      <b-field label="下载进度">
        <b-progress
          :value="downloadProgress"
          :show-value="true"
          format="percent"
        ></b-progress>
      </b-field>
      <div style="margin-top: 2em;">
        <div class="columns is-centered">
          <div class="column is-half">
            <b-button
              expanded
              @click="onCancelDownload"
            >{{ closeText }}</b-button>
          </div>
          <div class="column is-half">
            <b-button
              expanded
              type="is-primary"
              :loading="downloadLoading"
              :disabled="!canDownload"
              @click="onDownload"
            >开始下载</b-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import db from '@/db.js'

async function sleep(ms) {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export default {
  name: 'DownloadModal',
  data () {
    return {
      state: this.$root.state,
      dates: [],
      closeText: '关闭',
      downloadLoading: false,
      downloadProgress: 0,
      cancelDownload: false,
      downloadDoneCount: 0,
      downloadTotal: 0,
    }
  },
  computed: {
    canDownload () {
      return this.dates.length !== 0 && this.state.downloadPath !== '******'
    }
  },
  mounted () {
    ipcRenderer.on('confirmDirectory', function (evt, msg) {
      this.$root.setDownloadPath(msg.path)
    }.bind(this))
  },
  methods: {
    onChooseFolder () {
      ipcRenderer.send('openDirectory')
    },
    async onDownload () {
      this.closeText = '取消下载'
      this.downloadLoading = true
      this.downloadDoneCount = 0
      this.downloadTotal = 0
      this.downloadProgress = 0
      const startDate = this.dates[0].getTime()
      const endDate = this.dates[1].getTime() + 86400000

      const downloadFeedbacks = await db.feedback
        .where('time')
        .between(startDate, endDate, true, false)
        .toArray()
      this.downloadTotal = downloadFeedbacks.length

      if (this.downloadTotal !== 0) {
        this.$buefy.toast.open(`查询到 ${this.downloadTotal} 份记录，开始下载`)
        for (let i = 0; i < downloadFeedbacks.length; i++) {
          if (this.cancelDownload) {
            break
          } else {
            const { fid, date } = downloadFeedbacks[i]
            ipcRenderer.send('download', { fid, date })
            await sleep(1000)
            this.downloadDoneCount = this.downloadDoneCount + 1
            this.downloadProgress = Math.floor((this.downloadDoneCount / this.downloadTotal) * 100)
            if (this.downloadProgress == 100) {
              this.downloadLoading = false
              this.closeText = '关闭'
              this.$buefy.toast.open({
                message: '下载完成',
                type: 'is-success'
              })
            }
          }
        }
      } else {
        this.$buefy.toast.open({
          message: '选定的日期范围内无记录',
          type: 'is-warning'
        })
        this.downloadLoading = false
      }
    },
    onCancelDownload () {
      if (this.downloadLoading) {
        this.cancelDownload = true
        this.downloadLoading = false
        this.$buefy.toast.open({
          message: '下载已取消',
          type: 'is-danger'
        })
      }
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
  text-align: center;
  margin-bottom: 1em;
}
small {
  display: block;
  margin-bottom: 1em;
  color: #b2b2b2;
}
</style>