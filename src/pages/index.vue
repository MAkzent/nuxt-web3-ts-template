<template lang="pug">
.landing
  .landing__wrapper
    section
      .landing__headline Raid Boss 👹
      raid-boss-card
    section
      .landing__headline Your Kitties 😼
      .landing__kitties
        kitty-card(
          v-for="kitty in kitties"
          :key="kitty.tokenId"
          :kitty="kitty"
          :isClickable="true"
        )
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'
  import KittyCard from '~/components/molecules/KittyCard.vue'
  import RaidBossCard from '~/components/molecules/RaidBossCard.vue'

@Component({
  components: {
    KittyCard,
    RaidBossCard
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
    margin: 1.5rem 0 1rem;
    font-size: 1.2rem;
    font-weight: 300;
  }
  &__kitties {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    @include breakpoint(sm) {
      grid-template-columns: repeat(5, 1fr);
      margin: 2rem 0;
    }
  }
}
</style>
