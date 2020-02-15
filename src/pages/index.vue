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
        )
    modal(
        @modal-close="() => this.showModal = false"
        v-if="showModal"
    )
        template(
        slot="header"
        v-if="modalTab === 1"
        )
            img.modal__image(src="~/assets/images/icons/kitty-dai.png")
        template(
            slot="header"
            v-else
            )
            img.modal__image__large(src="~/assets/images/enemies/werewolf.png")

        .modal__content(v-if="modalTab === 1") Earn DAI battling your CryptoKitties to the death
        .modal__content(v-else) Your kitty just may be the one to beat the Raid Boss to claim victory 💰from the kitties that came before you
        template(
            slot="footerOneBtn"
        )
            button(
                v-on:click="this.onClick"
            ) {{modalTab === 1 ? "Next" : "Play"}}

</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'
  import KittyCard from '~/components/molecules/KittyCard.vue'
  import RaidBossCard from '~/components/molecules/RaidBossCard.vue'
  import Modal from '~/components/molecules/Modal.vue'

@Component({
  components: {
    KittyCard,
    RaidBossCard,
    Modal
  }
})
  export default class extends Vue {
    @State ownAddress
    private kitties = []
    private showModal = true;
    private modalTab = 1
    scrollToTop () {
      return true
    }

    async beforeMount () {
     const { assets } = await this.$openSeaService.getKittiesByAccount(this.ownAddress) || {}
     if (assets) { this.kitties = assets }
    }

    onClick() {
      if (this.modalTab === 2) {
        this.showModal = false
      } else {
        this.modalTab = 2
      }

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
    margin: 1rem 0 1.5rem;
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
    .modal {
        &__image {
            width: auto;
            height: auto;
            max-width: 5rem;
            max-height: 5rem;
            &__large {
                width: auto;
                height: auto;
                max-width: 10rem;
                max-height: 10rem;
            }
        }
        &__content {

        }
    }

</style>
