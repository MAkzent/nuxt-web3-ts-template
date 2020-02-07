<template lang="pug">
.landing Hello World. Your Address: {{ ownAddress }}
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'

@Component({
  components: {
  }
})
  export default class extends Vue {
    @State ownAddress
    scrollToTop () {
      return true
    }
  }
</script>

<style lang="scss" scoped>
.landing {
  font-weight: 300;
}
</style>
