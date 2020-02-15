<template lang="pug">
.landing
  .landing__wrapper
    section
      .landing__headline Raid Boss 👹
      .landing__enemy(:style="{ backgroundImage: `url(${require('~/assets/images/enemies/werewolf.png')})`}")
      .landing__enemy__stats
        .landing__enemy__stats__category HP
        .landing__enemy__stats__value
          small 50,000 /
          span 32,423
        .landing__enemy__stats__category Eaten 🤑
        .landing__enemy__stats__value 30
    section
      .landing__headline Your Kitties 😼
      .landing__kitties
        .landing__kitties__kitty(
          v-for="kitty in kitties"
          v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}` }"
        )
          img(:src="kitty.imageUrl")
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'

@Component({
  components: {
  }
})
  export default class extends Vue {
    @State ownAddress
    private kitties = []
    scrollToTop () {
      return true
    }

    async beforeMount () {
     const { assets } = await this.$openSeaService.getKittiesByAccount(this.ownAddress) || {}
     if (assets) { this.kitties = assets }
    }

  // getKittyAttributes(tokenId) {
  //   const element:
  // }

  // getElementIcon(elementId) {
  //   switch (elementId) {
  //     case 1: return ""
  //   }
  // }
  }
</script>

<style lang="scss" scoped>
.landing {
  &__wrapper {
    @include breakpoint(sm) {
      display: grid;
      grid-column-gap: 3rem;
      grid-template-columns: 1fr 1.5fr;
    }
  }
  &__headline {
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
    font-weight: 300;
  }
  &__enemy {
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
  &__kitties {
    margin: 1rem 0rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    @include breakpoint(sm) {
      grid-template-columns: repeat(6, 1fr);
      margin: 2rem 0;
    }
    &__kitty {
      display: relative;
      border-radius: 0.25rem;
      padding-bottom: 1rem;
      transition: 0.1s ease-in-out;
      img {
        display: flex;
      }

      &:hover {
        cursor: pointer;
        transform: translate(0.15rem, -0.25rem);
      }
    }
  }
}
</style>
