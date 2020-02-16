<template lang="pug">
.kitty(
  v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}`}"
  :class="{'kitty--notApproved': !isApproved}"
  @click="handleKittyClick"
)
  .kitty__approve(v-if="!isApproved")
    button Approve
  img(:src="kitty.imageUrl")
  .kitty__attributes
    .kitty__attributes__value
      img(:src="getElementImg")
      span {{ getStats.attack }}
    .kitty__attributes__value
      img(src="~/assets/images/icons/speed.png")
      span {{ getStats.speed }}
    .kitty__attributes__value
      img(src="~/assets/images/icons/crit.png")
      span {{ getStats.crit }}

  modal.enterBattleModal(
    v-if="showEnterModal"
    :appendToBody="true"
    type="bottom"
    @modal-close="closeEnterModal"
  )
    template(slot="header") Into the Battle
    .enterBattleModal__body
      .enterBattleModal__body__wrapper
        .enterBattleModal__body__header
          .enterBattleModal__body__kitty(
            v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}`}"
          )
            .enterBattleModal__body__kitty__img(:style="{ backgroundImage: `url(${kitty.imageUrl})` }")
          section
            .enterBattleModal__body__kitty__name {{kitty.name}}
            .enterBattleModal__body__kitty__text "I'm ready to Dai."
        section
          .enterBattleModal__body__title Cattributes
          .enterBattleModal__body__stats
            img(:src="getElementImg")
            span Elemental Damage
            .enterBattleModal__body__stats__value {{ getStats.attack }}
            img(src="~/assets/images/icons/speed.png")
            span Attack Speed
            .enterBattleModal__body__stats__value {{ getStats.speed }}
            img(src="~/assets/images/icons/crit.png")
            span Crit Chance
            .enterBattleModal__body__stats__value {{ getStats.crit }}
        section
          .enterBattleModal__body__title Power Boosts
          .enterBattleModal__body__boosts
            .enterBattleModal__body__boosts__img
              img(src="~/assets/images/icons/chai.png")
              span 0x
              span Chai
            .enterBattleModal__body__boosts__add
              span 5 DAI
              span +
            .enterBattleModal__body__boosts__img
              img(src="~/assets/images/icons/daiquiri.png")
              span 0x
              span Daiquiri
            .enterBattleModal__body__boosts__add
              span 10 DAI
              span +
            .enterBattleModal__body__boosts__img
              img(src="~/assets/images/icons/znarkmeister.png")
              span 0x
              span Daisake
            .enterBattleModal__body__boosts__add
              span 20 DAI
              span +

    template(slot="footer")
      button(@click="closeEnterModal") Back
      button.enterBattleModal__fight(:disabled="isSending" @click="fight")
        section(v-if="isSending")
          .enterBattleModal--loading
            loading-spinner
          span Entering
        span(v-else) ⚔️ Fight
</template>

<script lang="ts">
  import { Component, Prop, Vue, State } from 'nuxt-property-decorator'
  import { OpenSeaAssetDetails } from '~/types'
  import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
  import Modal from '~/components/molecules/Modal.vue'

  const ATTACK_CAP = 128
  const SPEED_CAP = 64
  const CRIT_CAP = 16
  const ELEMENT_TYPES = {
    Earth: 0,
    Water: 1,
    Fire: 2,
    Wind: 3,
    Void: 4
  }

@Component({
  components: {
    Modal,
    LoadingSpinner
  }
})
  export default class KittyCard extends Vue {
    @Prop() kitty!: OpenSeaAssetDetails
    @Prop({ default: false }) isClickable?: boolean
    @State networkId
    @State ownAddress

    private showEnterModal = false
    private isSending = false
    private isApproved = false

    get getStats () {
      const kittyGene = this.kitty.tokenId
      return {
        attack: Number(kittyGene) % ATTACK_CAP,
        speed: Number(kittyGene) % SPEED_CAP,
        crit: Number(kittyGene) % CRIT_CAP,
        element: Number(kittyGene) % Object.keys(ELEMENT_TYPES).length
      }
    }

    get getElementImg () {
      switch (this.getStats.element) {
        case 0: return require('~/assets/images/icons/fire.png')
        case 1: return require('~/assets/images/icons/wind.png')
        case 2: return require('~/assets/images/icons/void.png')
        case 3: return require('~/assets/images/icons/earth.png')
        case 4: return require('~/assets/images/icons/water.png')
        default: return require('~/assets/images/icons/fire.png')
      }
    }

    async beforeMount () {
      this.isApproved = await this.$ethereumService.getIsKittyApproved(this.kitty.tokenId, this.networkId)
    }

    async handleKittyClick () {
      if (this.isClickable) {
        if (this.isApproved) {
          this.showEnterModal = true
        } else {
          await this.$ethereumService.approveContract(this.kitty.tokenId, this.ownAddress, this.networkId)
          location.reload()
        }
      }
    }

    closeEnterModal () {
      this.showEnterModal = false
    }

    async fight () {
      this.isSending = true
      await this.$ethereumService.enterRaid(this.ownAddress, this.kitty.tokenId, this.networkId, () => location.reload())
    }
  }
</script>

<style lang="scss" scoped>
.kitty{
  border-radius: 0.25rem;
  transition: 0.1s ease-in-out;
  > img {
    display: flex;
  }

  &--notApproved {
    position: relative;
  }

  &__approve {
    @extend %row;
    border-radius: 0.25rem;
    position: absolute;
    background-color: rgba($color-obsidian, 0.6);
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    button {
      @extend %btn-primary;
    }
  }

  &:hover {
    cursor: pointer;
    transform: translate(0.15rem, -0.25rem);
  }

  &__attributes {
    @extend %row;
    justify-content: flex-start;
    font-family: $font-mono;
    background-color: rgba($color-woodsmoke, 0.9);
    padding: 0.35rem 0.75rem;
    border-radius: 0.25rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.25rem;
    &__value {
      @extend %col;

      img {
        margin: 0 auto;
        height: 0.7rem;
        margin-bottom: 0.25rem;
      }

      span {
        font-size: 0.8rem;
      }
    }
  }
}

.enterBattleModal {
  &__body {
    &__header {
      @extend %row;
      justify-content: flex-start;
    }

    &__kitty {
      border-radius: 50%;
      margin-right: 1rem;
      &:hover {
        cursor: default;
        transform: translate(0, 0);
      }

      &__img {
        border-radius: 50%;
        height: 6rem;
        width: 6rem;
        background-position: center;
        background-size: cover;
        background-repeat: none;
      }

      &__name {
        font-size: 1.3rem;
        margin-bottom: 1rem;
      }

      &__text {
        padding-left: 0.5rem;
        font-family: $font-mono;
        font-size: 1.1rem;
        opacity: 0.8;
      }
    }
    &__title {
      margin: 1rem 0 0.5rem;
      color: $color-magikarp;
    }
    &__stats {
      border-radius: 0.25rem;
      padding: 0.75rem 1rem;
      margin: 0.5rem 0;
      margin-right: 0.75rem;
      background-color: $color-woodsmoke;
      font-family: $font-mono;

      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 1rem;
      align-items: center;

      &__value {
        font-size: 1.1rem;
        font-weight: bold;
        margin-left: auto;
      }

      img {
        height: 1rem;
        width: auto;
      }

      span {
        display: inline-block;
      }
    }
    &__boosts {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      grid-gap: 1rem;
      border-radius: 0.25rem;
      padding: 0.75rem 1rem;
      margin: 0.5rem 0;
      margin-right: 0.75rem;
      background-color: $color-woodsmoke;
      font-family: $font-mono;

      &__img {
        display: flex;
        align-items: center;
        img {
          height: 2rem;
          width: auto;
        }
        span {
          padding-left: 1rem;
        }
      }

      &__add {
        margin-left: auto;
        span {
          &:last-of-type {
            margin-left: 0.5rem;
            font-weight: bold;
            text-align: center;
            display: inline-block;
            width: 1rem;
            height: 1rem;
            line-height: 1;
            background-color: $color-kournikova;
            color: $color-obsidian;
            border-radius: 50%;
            padding: 0.15rem;
            transition: 0.1s ease-in-out;

            &:hover {
              cursor: pointer;
              background-color: rgba($color-kournikova, 0.8);
            }
          }
        }
      }
    }
  }

  &__fight {
    @extend %row;
    background-color: $color-gossip !important;
    &:hover {
      background-color: darken($color-gossip, 5) !important;
    }
  }

  &--loading {
    display: inline-block;
    height: 0.8rem;
    width: 0.8rem;
    margin-right: 0.5rem;
    border-color: $color-swan !important;
  }
}
</style>
