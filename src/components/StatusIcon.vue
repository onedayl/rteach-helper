<template>
  <b-icon
    :icon="flag ? 'check' : 'close'"
    :type="flag ? 'is-success' : 'is-danger'"
  ></b-icon>
</template>

<script>
export default {
  name: 'StatusIcon',
  props: ['flag'],
}
</script>