<template lang="pug">
.landing
  .landing__wrapper
    section
      raid-boss-card
      kitty-squad
    section
      .landing__headline Your Kitties 😼
      .landing__kitties--loading(v-if="!fetched")
        loading-spinner
      .landing__unlock(v-else-if="ownAddress.length === 0") Connect / Unlock your Wallet to Play
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
  import { Component, Vue, State, Watch } from 'nuxt-property-decorator'
  import EthersService from '../services/EthersService'
  import KittyCard from '~/components/molecules/KittyCard.vue'
  import RaidBossCard from '~/components/molecules/RaidBossCard.vue'
  import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
  import KittySquad from '~/components/organisms/KittySquad.vue'

@Component({
  components: {
    KittyCard,
    RaidBossCard,
    LoadingSpinner,
    KittySquad
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

    @Watch('ownAddress')

    onAddressChanged () {
      this.loadKitties()
    }

    async beforeMount () {
     await this.loadKitties()
      this.listenForEvents()
    }

    async listenForEvents () {
        this.$ethersService.bossDefeated(this.openModal)
        this.$ethersService.damageInflicted(this.openModal)
        this.$ethersService.bossAppears(this.openModal)

    }

    openModal(a,b,c) {
      console.log(a,b,c)
    }

    async loadKitties () {
      this.fetched = false
      const { assets } = await this.$openSeaService.getKittiesByAccount(this.ownAddress, this.networkId) || {}
      if (assets) { this.kitties = assets }
      this.fetched = true
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
    &__unlock {
        text-align: center;
        margin: 3rem auto;
        font-size: 1.2rem;
        opacity: 0.6;
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
