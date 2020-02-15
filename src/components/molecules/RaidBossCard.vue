<template lang="pug">
section
  .raidBoss(:style="{ backgroundImage: `url(${require('~/assets/images/enemies/werewolf.png')})`}")
  .raidBoss__stats
    .raidBoss__stats__category HP
    .raidBoss__stats__value
      small 50,000 /
      span 32,423
    .raidBoss__stats__category Eaten 🤑
    .raidBoss__stats__value 30
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
.raidBoss{
  border-radius: 0.125rem;
    height: 20rem;
    width: 100%;
    background-position: 50% 10%;
    background-size: cover;
    background-repeat: none;

    &__stats {
      font-family: $font-mono;
      background-color: $color-woodsmoke;
      padding: 1rem 1.5rem;
      display: grid;
      grid-gap: 0.5rem;
      grid-template-columns: repeat(2, 1fr);
      &__category {
        opacity: 0.8;
      }
      &__value {
        font-size: 1.2rem;
        font-weight: 300;
        margin-left: auto;

        small {
          font-size: 0.9rem;
          display: inline-block;
          opacity: 0.7;
          margin-right: 0.5rem;
        }
      }
    }
}
</style>
