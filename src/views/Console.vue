<template>
  <ModuleLayout>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-icon icon="school" size="is-small"></b-icon><small>{{ this.state.school }}</small>
        </div>
        <div class="level-item">
          <b-icon
            :icon="this.state.gender == 1 ? 'gender-male' : 'gender-female'"
            size="is-small"
          ></b-icon>
          <small>{{ this.state.name }}</small>
        </div>
        <div class="level-item">
          <b-icon icon="flag" size="is-small"></b-icon><small>{{ this.state.total }}</small>
        </div>
      </div>
      <div class="level-right">
        <b-button
          type="is-primary"
          icon-left="download"
          size="is-small"
          @click="onDownload"
        >下载</b-button>
      </div>
    </div>
    <div class="flexbox">
      <div class="box" v-for="(feedback, index) in state.feedbacks" :key="index">
        <div class="media">
          <div class="media-left">
            <figure>
              <template v-if="feedback.thumbnail">
                <img :src="feedback.thumbnail">
              </template>
              <template v-else>
                <b-skeleton width="102px" height="102px"></b-skeleton>
              </template>
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <ul>
                <li>{{ `${feedback.date}`}}</li>
                <li>{{ feedback.theme}}</li>
                <li>{{ feedback.operator}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="columns is-centered">
        <div class="column is-four-fifths">
          <b-pagination
            :total="state.total"
            per-page="10"
            :current.sync="current"
            order="is-centered"
            @change="onPageChange"
          >
          </b-pagination>
        </div>
      </div>
    </footer>
  </ModuleLayout>
</template>

<script>
import ModuleLayout from '@/layouts/ModuleLayout.vue'
import db from '@/db.js'
import DownloadModal from'@/components/DownloadModal.vue'

export default {
  name: 'Console',
  components: {
    ModuleLayout,
  },
  data () {
    return {
      state: this.$root.state,
      current: 1,
    }
  },
  methods: {
    async onPageChange (page) {
      this.current = page
      const feedbacks = await db.feedback
        .orderBy('time')
        .reverse()
        .offset((page - 1) * 10)
        .limit(10)
        .toArray()
      this.$root.setFeedbacks(feedbacks)
    },
    async onDownload () {
      this.$buefy.modal.open({
        parent: this,
        component: DownloadModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['button'],
        destroyOnHide: true,
      })
    }
  }
}
</script>

<style scoped>
.level {
  position: fixed;
  top: 54px;
  left: 0;
  width: 100%;
  height: 42px;
  padding: 0 1em;
  background-color: #f8f8f8;
  box-shadow: 0 2px 6px rgba(80, 80, 80, 0.1);
}
.icon.is-small {
  margin-right: 0.4em;
}
.flexbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 110px;
  padding-bottom: 60px;
}
.box {
  margin: 10px;
  width: 370px;
}
figure > img {
  width: 102px;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
