<template lang="pug">
modal.resultModal(
  @modal-close="$emit('modal-close')"
)
  template(slot="header") Raid Result
  .resultModal__body
    section(
      v-if="!showResult"
      @click="openChest"
    )
      img.resultModal__body__chest(src="~/assets/images/icons/chest.png")
    section(v-else)
      .resultModal__body__headline Raid Boss Slayer Kitty!
      .kitty
        .kitty__img-wrapper(v-bind:style="{ backgroundColor: `#${winnerKitty.backgroundColor}`}")
          .kitty__img(:style="`background-image: url(${winnerKitty.imageUrl})`")
        .kitty__attributes
          img(:src="getElementImg(winnerKitty.kittyId)")
          span {{ getStats(winnerKitty.tokenId).attack }}
          img(src="~/assets/images/icons/speed.png")
          span {{ getStats(winnerKitty.tokenId).speed }}
          img(src="~/assets/images/icons/crit.png")
          span {{ getStats(winnerKitty.tokenId).crit }}
        img.kitty__dmg__img(src="~/assets/images/icons/dmg.png")
        .kitty__dmg
          span {{ winnerKitty.damage}}
          small DMG
      .resultModal__body__headline Raid Loot
      .resultModal__body__loot
        span 42
        img(src="~/assets/images/icons/dai.png")
  template(slot="footer")
    button Close
    a.tweet(:href="urlForTwitter" target="_blank") Tweet
</template>

<script lang="ts">
  import { Component, State, Vue } from 'nuxt-property-decorator'
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
    Modal
  }
})
  export default class MyComponent extends Vue {
    @State ownAddress

    private showResult = false;

    private winnerKitty = {
      tokenId: '1480654',
      backgroundColor: 'cdf5d4',
      imageUrl: 'https://lh3.googleusercontent.com/AqoHNDpTPj4PQznEuDOFtXqCERVnALbS7SKdDHRSqhZAlS1gQ4kSa87XDgK8-4XCBE-0HDyTWgqLQD0-buMOkOel',
      damage: '253'
    }

    private dmgKitty = {
      tokenId: '1835349',
      backgroundColor: 'fcdede',
      imageUrl: 'https://lh3.googleusercontent.com/9ndDzIKhRzoXfeD3ZbDSKJfL23fwl_juA9V_c_rUeqCIdmYw_K7MfwKpVsKR9xEJuNEJG-Vv6VJ71l2dBUcee_Thug',
      damage: '782'
    }

    private timerId

    get urlForTwitter () {
      const baseUrl = 'https://twitter.com/share'
      const text = 'I just turned Kitties into Dai!'
      const params = Object.entries({
        text: encodeURIComponent(text),
        url: 'https://diekittydai.herokuapp.com/',
        hashtags: ['DIE', 'KITTY', 'DAI'].join(',')
      })
        .map(param => param.join('='))
        .join('&')
      return `${baseUrl}?${params}`
    }

    getStats (kittyId) {
      return {
        attack: Number(kittyId) % ATTACK_CAP,
        speed: Number(kittyId) % SPEED_CAP,
        crit: Number(kittyId) % CRIT_CAP,
        element: Number(kittyId) % Object.keys(ELEMENT_TYPES).length
      }
    }

    openChest () {
      this.showResult = true
      import('~/assets/scripts/confetti').then((confetti : any) => {
        confetti.default.start()
      })
    }

    beforeDestroy () {
      import('~/assets/scripts/confetti').then((confetti : any) => {
        confetti.default.stop()
        confetti.default.remove()
      })
    }

    getElementImg (kittyId) {
      switch (this.getStats(kittyId).element) {
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
.resultModal{
  &__body {
    @extend %col;
    &__chest {
      margin: 2rem auto;
      height: 6rem;
      width: auto;
      animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
      transition: 0.1s ease-in-out;
      filter: drop-shadow(0px 0px 0px rgba($color-magikarp, 0.1));

      &:hover {
        cursor: pointer;
        filter: drop-shadow(0px 0px 10px rgba(lighten($color-magikarp, 10), 0.9));
      }
    }
    &__headline {
      color: $color-magikarp;
      font-size: 1.1rem;
      margin: 2rem 0 1rem;
    }
    &__loot {
      @extend %row;
      background-color: rgba($color-woodsmoke, 0.9);
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;

      img {
        height: 2rem;
        width: auto;
      }

      span {
        font-size: 1.2rem;
        margin-right: 0.5rem;
        color: $color-kournikova;
      }
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
      height: 2.5rem;
      filter: drop-shadow(0px 0px 2px rgba($color-magikarp, 0.7));
      @include breakpoint(sm) {
        height: 3rem;
      }
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
.tweet {
  color: white !important;
  text-decoration: none;
  background-color: $color-twitter !important;
  border-color: $color-twitter !important;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}
</style>
