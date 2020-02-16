<template lang="pug">
.kitty(
  v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}`}"
  @click="handleKittyClick"
)
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
            .enterBattleModal__body__kitty__text {{`"${getKittyQuote()}"`}}
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
      button.enterBattleModal__fight ⚔️ Fight
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'
  import { OpenSeaAssetDetails } from '~/types'
  import Utils from '~/assets/scripts/Util.js'
  import Modal from '~/components/molecules/Modal.vue'
@Component({
  components: {
    Modal
  }
})
  export default class KittyCard extends Vue {
    @Prop() kitty!: OpenSeaAssetDetails
    @Prop({ default: false }) isClickable?: boolean

    private showEnterModal = false

    beforeMount () {
      console.log(this.kitty);
    }

    getKittyQuote () {
      const utils = new Utils
      return utils.randKittyQuote();
    }

    get getStats () {
      return {
        attack: Number(this.kitty.tokenId) % 102,
        element: Number(this.kitty.tokenId) % 5,
        speed: Number(this.kitty.tokenId) % 42,
        crit: Number(this.kitty.tokenId) % 12
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

    handleKittyClick () {
      if (this.isClickable) {
        this.showEnterModal = true
      }
    }

    closeEnterModal () {
      this.showEnterModal = false
    }
  }
</script>

<style lang="scss" scoped>
.kitty{
  display: relative;
  border-radius: 0.25rem;
  transition: 0.1s ease-in-out;
  > img {
    display: flex;
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
    margin: 0 0.5rem 0.25rem;
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
    background-color: $color-gossip !important;
    &:hover {
      background-color: darken($color-gossip, 5) !important;
    }
  }
}
</style>
