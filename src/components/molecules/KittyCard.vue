<template lang="pug">
.kitty(v-bind:style="{ backgroundColor: `#${kitty.backgroundColor}`}")
  img(:src="kitty.imageUrl")
  .kitty__attributes
    .kitty__attributes__value
      img(src="~/assets/images/icons/fire.png")
      span {{ getStats.attack }}
    .kitty__attributes__value
      img(src="~/assets/images/icons/speed.png")
      span {{ getStats.speed }}
    .kitty__attributes__value
      img(src="~/assets/images/icons/crit.png")
      span {{ getStats.crit }}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'
  import { OpenSeaAssetDetails } from '~/types'
@Component({
  components: {
  }
})
  export default class KittyCard extends Vue {
    @Prop() kitty!: OpenSeaAssetDetails

    beforeMount () {
      console.log(this.getStats)
    }

    get getStats () {
      return {
        attack: Number(this.kitty.tokenId) % 102,
        speed: Number(this.kitty.tokenId) % 42,
        crit: Number(this.kitty.tokenId) % 12
      }
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
</style>
