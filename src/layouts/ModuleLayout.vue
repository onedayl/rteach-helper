<template>
  <section>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <router-link to="/">
            <b-icon icon="arrow-left"></b-icon>
          </router-link>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <label><strong>IP：</strong></label>
          <h3>{{ state.ip }}</h3>
        </div>
        <div class="level-item">
          <label><strong>代理：</strong></label>
          <StatusIcon :flag="state.connected"></StatusIcon>
        </div>
        <div class="level-item">
          <label><strong>授权：</strong></label>
          <StatusIcon :flag="state.authorized"></StatusIcon>
        </div>
      </div>
    </nav>
    <div class="container">
      <slot></slot>
    </div>
  </section>
</template>
<script>
import StatusIcon from '@/components/StatusIcon.vue'

export default {
  name: 'ModuleLayout',
  components: {
    StatusIcon,
  },
  data () {
    return {
      state: this.$root.state,
    }
  }
}
</script>

<style scoped>
nav.level {
  position: fixed;
  z-index: 100;
  padding: 0 1em;
  margin-bottom: 0;
  width: 100%;
  height: 54px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
span {
  padding: 0 0.6em;
}
</style>
