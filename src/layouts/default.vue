<template lang="pug">
  .container
    top-bar.top-bar
    nuxt.content
</template>

<script lang="ts">
  import { Component, Vue } from 'nuxt-property-decorator'
  import TopBar from '~/components/organisms/TopBar.vue'
@Component({
  components: {
    TopBar
  }
})
  export default class extends Vue {
  }
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.top-bar {
  position: sticky;
  top: 0;
  left: 0;
}
.content {
  padding: 0 1rem 2rem;
  max-width: $screen-max-width;
  margin: 0 auto;
}
</style>
