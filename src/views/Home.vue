<template>
  <MainLayout>
    <section>
      <h1><span><b-icon icon="hand-peace-variant" size="is-medium" type="is-primary"></b-icon></span>欢迎使用</h1>
      <div class="columns is-centered">
        <div class="column is-four-fifths">
          <p>本应用非天启学堂官方程序，仅用于辅助获取天启学堂公众号内的临时授权凭证来完成图片下载任务，满足家长保存备份孩子照片的需求，不涉及敏感信息<span><b-icon icon="incognito-off" size="is-small" type="is-primary"></b-icon></span></p>
          <br />
          <p>如果你是第一次使用，请参考<span><b-icon icon="hand-pointing-down" size="is-small" type="is-primary"></b-icon></span>操作指引设置连接代理和生成授权凭证<span><b-icon icon="key" size="is-small" type="is-primary"></b-icon></span></p>
        </div>
      </div>
    </section>
    <section style="margin-top: 2em;">
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="columns">
            <div class="column">
              <router-link to="/guide">
                <div class="module">
                <b-icon icon="book" size="is-large" type="is-primary"></b-icon>
                </div>
                <strong>操作指引</strong>
              </router-link>
            </div>
            <div class="column">
            <router-link to="/console">
              <div class="module">
                <b-icon icon="monitor-dashboard" size="is-large" type="is-primary"></b-icon>
              </div>
              <strong>控制台</strong>
            </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout> 
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  name: 'Home',
  components: {
    MainLayout
  }
}
</script>

<style scoped>
h1 {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1em;
}
p {
  text-align: left;
}
span {
  padding: 0 0.3em;
}
.column {
  text-align: center;
}
.module {
  font-size: 4em;
}
</style>
