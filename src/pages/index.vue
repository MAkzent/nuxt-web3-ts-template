<template lang="pug">
.landing
  .landing__wrapper
    section
      .landing__headline Raid Boss 👹
      raid-boss-card
    section
      .landing__headline Your Kitties 😼
      .landing__kitties--loading(v-if="!fetched")
        loading-spinner
      .landing__kitties(v-else-if="kitties.length > 0")
        kitty-card(
          v-for="kitty in kitties"
          :key="kitty.tokenId"
          :kitty="kitty"
          :isClickable="true"
        )
      .landing__kitties--empty(v-else) No Kitties 🙀
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'
  import KittyCard from '~/components/molecules/KittyCard.vue'
  import RaidBossCard from '~/components/molecules/RaidBossCard.vue'
  import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

@Component({
  components: {
    KittyCard,
    RaidBossCard,
    LoadingSpinner
  }
})
  export default class extends Vue {
    @State ownAddress
    @State networkId
    private kitties = []
    private fetched = false
    scrollToTop () {
      return true
    }

    async beforeMount () {
     const { assets } = await this.$openSeaService.getKittiesByAccount(this.ownAddress, this.networkId) || {}
     console.log(assets)
     if (assets) { this.kitties = assets }
     this.fetched = true
    }
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

    &--loading {
      height: 1rem;
      width: 1rem;
      margin: 3rem auto;
    }

    &--empty {
      text-align: center;
      margin: 3rem auto;
      font-weight: 1.2rem;
      opacity: 0.6;
    }
  }
}
</style>
