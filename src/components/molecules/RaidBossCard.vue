<template lang="pug">
section
  .raidBoss(:style="{ backgroundImage: `url(${require('~/assets/images/enemies/golem.png')})`}")
    button.raidBoss__history(@click="showHistoryModal = true") Raid History
  .raidBoss__stats
    .raidBoss__stats__category HP
    .raidBoss__stats__value
      small 50,000 /
      span 32,423
    .raidBoss__stats__category Eaten 🤑
    .raidBoss__stats__value 30

  modal.raidHistory(
    v-if="showHistoryModal"
    :appendToBody="true"
    @modal-close="closeHistoryModal"
  )
    template(slot="header") Raid History
    .raidHistory__body
      .raidHistory__body__header
        .raidHistory__body__header__icon(:style="{ backgroundImage: `url(${require('~/assets/images/enemies/golem.png')})`}")
      .raidHistory__body__headline Raid Boss Stats
      .raidHistory__body__header__stats
        .raidHistory__body__header__stats__category Element
        .raidHistory__body__header__stats__value ???
        .raidHistory__body__header__stats__category Type
        .raidHistory__body__header__stats__value ???
        .raidHistory__body__header__stats__category Skin Thickness
        .raidHistory__body__header__stats__value ??
      .raidHistory__body__headline R.I.P. Kitties
      .raidHistory__body__kitties
        .kitty(
          v-for="kitty in killedKitties"
        )
          .kitty__img-wrapper(v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}`}")
            .kitty__img(:style="`background-image: url(${kitty.imageUrl})`")
          .kitty__attributes
            img(:src="getElementImg( getStats(kitty.tokenId).element)")
            span {{ getStats(kitty.tokenId).attack }}
            img(src="~/assets/images/icons/speed.png")
            span {{ getStats(kitty.tokenId).speed }}
            img(src="~/assets/images/icons/crit.png")
            span {{ getStats(kitty.tokenId).crit }}
          img.kitty__dmg__img(src="~/assets/images/icons/dmg.png")
          .kitty__dmg
            span {{ kitty.damage}}
            small DMG

    template(slot="footerOneBtn")
      button(@click="closeHistoryModal") Back
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'
  import { KittyInfo } from '~/types'
  import Modal from '~/components/molecules/Modal.vue'
@Component({
  components: {
    Modal
  }
})
  export default class MyComponent extends Vue {
    @Prop() propName!: string

    private showHistoryModal = false

    private killedKitties : Array<KittyInfo> = [
      {
        tokenId: '1480654',
        backgroundColor: 'cdf5d4',
        imageUrl: 'https://lh3.googleusercontent.com/AqoHNDpTPj4PQznEuDOFtXqCERVnALbS7SKdDHRSqhZAlS1gQ4kSa87XDgK8-4XCBE-0HDyTWgqLQD0-buMOkOel',
        damage: '253'
      },
      {
        tokenId: '1835349',
        backgroundColor: 'fcdede',
        imageUrl: 'https://lh3.googleusercontent.com/9ndDzIKhRzoXfeD3ZbDSKJfL23fwl_juA9V_c_rUeqCIdmYw_K7MfwKpVsKR9xEJuNEJG-Vv6VJ71l2dBUcee_Thug',
        damage: '782'
      },
      {
        tokenId: '1834194',
        backgroundColor: 'e8f2da',
        imageUrl: 'https://lh3.googleusercontent.com/vVRn8FOmnEqaNK_LgxuZ8Rszu0GjwQGpZ-IwY6eLfESfbiE3isXd1fGjH6WbiZHR9iFZRkzC2AchXOb6h0yLCog',
        damage: '24'
      }
    ]

    closeHistoryModal () {
      this.showHistoryModal = false
    }

    getStats (tokenId) {
      return {
        attack: Number(tokenId) % 102,
        element: Number(tokenId) % 5,
        speed: Number(tokenId) % 42,
        crit: Number(tokenId) % 12
      }
    }

    getElementImg (elementId) {
      switch (elementId) {
        case 0: return require('~/assets/images/icons/fire.png')
        case 1: return require('~/assets/images/icons/wind.png')
        case 2: return require('~/assets/images/icons/void.png')
        case 3: return require('~/assets/images/icons/earth.png')
        case 4: return require('~/assets/images/icons/water.png')
        default: return require('~/assets/images/icons/fire.png')
      }
    }
  }
</script>

<style lang="scss" scoped>
.raidBoss{
  position: relative;
  border-radius: 0.125rem;
  height: 20rem;
  width: 100%;
  background-position: 50% 10%;
  background-size: cover;
  background-repeat: none;

  &__history {
    @extend %btn-primary;
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    filter: drop-shadow(1px 1px 4px rgba($color-obsidian, 0.7));
  }

  &__stats {
    font-family: $font-mono;
    background-color: $color-woodsmoke;
    padding: 1rem 1.5rem;
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: auto 1fr;
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

.raidHistory {
  &__body {
    &__headline {
      margin-bottom: 0.5rem;
      padding: 0.25rem 0;
      font-size: 0.9rem;
      font-weight: 300;
      color: $color-magikarp;
      border-bottom: solid 2px rgba($color-magikarp, 0.3);
    }

    &__header {
      display: flex;
      align-items: center;

      &__icon {
        margin: 0 auto;
        border-radius: 50%;
        height: 6rem;
        width: 6rem;
        background-position: 50% 10%;
        background-size: cover;
        background-repeat: none;
      }

    &__stats {
        font-family: $font-mono;
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: auto 1fr;
        width: 100%;
        margin-bottom: 1rem;
        &__category {
          opacity: 0.8;
        }
        &__value {
          text-align: right;
          font-size: 1.2rem;
          font-weight: bold;
          margin-left: auto;
        }
      }
    }

    &__kitties {
      display: grid;
      grid-gap: 0.5rem;
    }
  }
}

.kitty{
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-gap: 1rem;
  align-items: center;
  justify-items: center;
  background-color: rgba($color-woodsmoke, 0.9);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;

  &__img-wrapper {
    @extend %row;
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    background-position: center;
    background-size: cover;
    background-repeat: none;
  }

  &__img {
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    background-position: center;
    background-size: cover;
    background-repeat: none;
  }

  &__attributes {
    justify-content: flex-start;
    font-family: $font-mono;
    margin: 0 0.5rem 0.25rem;
    border-radius: 0.25rem;
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: auto 1fr;
    grid-gap: 0.25rem;
    img {
      margin: 0 auto;
      height: 0.7rem;
    }

    span {
      font-size: 0.9rem;
    }

    @include breakpoint(sm) {
      margin: 0;
      grid-template-rows: 1fr;
      grid-gap: 0;
      grid-template-columns: repeat(6, 1fr);
      span {
        margin-right: 0.75rem;
        font-size: 1rem;
      }
    }
  }

  &__dmg {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 4.5rem;

    @include breakpoint(sm) {
      min-width: 6rem;
    }

    &__img {
      margin-left: auto;
      height: 3rem;
      filter: drop-shadow(0px 0px 2px rgba($color-swan, 0.5));
    }

    span {
      font-family: $font-mono;
      font-size: 1.5rem;
    }

    small {
      padding-top: 0.5rem;
      opacity: 0.5;
      font-size: 0.6rem;
      margin-left: 0.25rem;
    }
  }
}
</style>
