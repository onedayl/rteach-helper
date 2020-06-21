<template>
  <ModuleLayout>
    <div class="content">
      <blockquote><span><b-icon icon="emoticon-cool-outline" size="is-small" type="is-primary"></b-icon></span>只需 3 步即可完成设置，请留意小助手右上角的信息<span><b-icon icon="arrow-top-right" size="is-small" type="is-primary"></b-icon></span></blockquote>
      <h2>1. 电脑和手机连接到同一个 wifi</h2>
      <p>这一步是让电脑和手机处于局域网内，能够实现连接代理。</p>
      <h2>2. 设置手机 HTTP 代理</h2>
      <p>如果是 iOS，进入<span class="highlight">设置 > WiFi</span>，点击 wifi 名称最右侧的<span class="highlight"><b-icon icon="alert-circle-outline" size="is-small"></b-icon></span>，找到最下方的<span class="highlight">HTTP 代理</span>并点击右侧的<span class="highlight"><b-icon icon="chevron-right" size="is-small"></b-icon></span>，选择手动后将<span class="highlight">服务器</span>设为小助手右上角的<b> IP</b>（以自己电脑上显示的为准），<span class="highlight">端口</span>设为<b> 8888</b>，设置好后点击<span class="highlight">存储</span>。</p>
      <div class="columns">
        <div class="column">
          <img src="@/assets/guide1.jpg">
        </div>
        <div class="column">
          <img src="@/assets/guide2.jpg">
        </div>
        <div class="column">
          <img src="@/assets/guide3.jpg">
        </div>
        <div class="column">
          <img src="@/assets/guide4.jpg">
        </div>
      </div>
      <br>
      <p>如果是 Android，由于机型太多不好举例，请使用关键词<em> “手机品牌/手机系统 + 设置代理” </em>搜索相关文章进行设置。</p>
      <h2>3. 访问天启课堂公众号“我的主页”</h2>
      <p>手机打开天启课堂公众号，点击底部菜单中的“我的主页”，等待几秒页面成功跳转到主页面即可，这时候小助手右上角的<span class="highlight">代理</span>和<span class="highlight">授权</span>状态应该都显示为 <b-icon icon="check" type="is-success" size="is-small"></b-icon> 了。</p>
      <div class="columns">
        <div class="column is-one-quarter">
          <img src="@/assets/guide5.jpg">
        </div>
        <div class="column is-one-quarter">
          <img src="@/assets/guide6.jpg">
        </div>
      </div>
      <p><span><b-icon icon="party-popper" size="is-small" type="is-primary"></b-icon></span>大功告成！可以把第 2 步的代理取消了，以免影响手机的正常使用～～现在，点击跳转<router-link to="/console"><span><b-icon icon="monitor-dashboard" size="is-small" type="is-primary"></b-icon></span>控制台</router-link>，随意浏览和下载吧！</p>
    </div>
  </ModuleLayout>
</template>

<script>
import ModuleLayout from '@/layouts/ModuleLayout.vue'

export default {
  name: 'Guide',
  components: {
    ModuleLayout
  }
}
</script>

<style scoped>
.content {
  padding: 74px 2em 2em;
  line-height: 32px;
}
.highlight {
  background-color: #f2f2f2;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  margin: 0 6px;
  vertical-align: middle;
}
a {
  color: blueviolet;
}
em {
  color: #888888;
}
img {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
span {
  padding: 0 0.3em;
}
</style>
