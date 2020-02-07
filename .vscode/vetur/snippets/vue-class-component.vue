<template lang="pug">
.className
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component({
  components: {

  }
})
  export default class MyComponent extends Vue {
    @Prop() propName!: string
  }
</script>

<style lang="scss" scoped>
.className{
  
}
</style>
