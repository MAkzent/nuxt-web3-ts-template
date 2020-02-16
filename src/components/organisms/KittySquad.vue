<template lang="pug">
.squad
  .squad__details
    .squad__headline Crit DMG Bonus
    .squad__stats
      span {{ critAdded }}
      small /
      small {{ maxDefense }}
  .squad__progress
    .squad__progress__outer
      img.squad__progress__outer__cat(
        :style="{'left': `calc(${squadPercent}% - 0.5rem)`}"
        src="~/assets/images/icons/squad.png"
      )
      img.squad__progress__outer__battle(src="~/assets/images/icons/battle.png")
      .squad__progress__inner(:style="{'width': `${squadPercent}%`}")

</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'

@Component({
  components: {
  }
})
  export default class KittySquad extends Vue {
    @State networkId

    private bossStats = {
      originalCritDefense: 0,
      critDefense: 0
    }

    get critAdded () {
      return this.bossStats.originalCritDefense - this.bossStats.critDefense
    }

    get maxDefense () {
      return this.bossStats.originalCritDefense
    }

    get squadPercent () {
      return this.critAdded / this.maxDefense * 100
    }

    async beforeMount () {
      this.bossStats = await this.$ethereumService.getCurrentBoss(this.networkId)
    }
  }
</script>

<style lang="scss" scoped>
.squad {
  margin-top: 1rem;
  border-radius: 0.25rem;
  border: 1px solid $color-magikarp;
  padding: 0.5rem 1rem 1.5rem;

  &__details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.5rem 0 1.5rem;
  }
  &__headline {
    font-size: 1.2rem;
    font-weight: 300;
  }
  &__stats {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    span {
      line-height: 0.9;
      font-size: 1.8rem;
      margin-right: 0.5rem;
    }

    small {
      font-size: 0.7rem;
      opacity: 0.7;

      &:last-of-type {
        margin-left: 0.35rem;
      }
    }
  }
  &__progress {
    width: 100%;
    margin: 1rem 0 0.5rem;
    &__outer {
      position: relative;
      height: 1rem;
      margin: 0 auto;
      width: 95%;
      background-color: $color-woodsmoke;
      border-radius: 0.25rem;

      &__cat {
        z-index: 2;
        height: 2rem;
        width: auto;
        position: absolute;
        top: -80%;
      }
      &__battle {
        z-index: 2;
        height: 2rem;
        width: auto;
        position: absolute;
        right: -0.75rem;
        top: -50%;
      }
    }

    &__inner {
      position: absolute;
      top: 0;
      left: 0;
      height: 1rem;
      background-color: $color-magikarp;
      border-radius: 0.25rem;
    }
  }

  &__info {
    background-color: $color-woodsmoke;
    padding: 0.35rem 0.75rem;
  }

  &__sub-headline {
    font-size: 0.9rem;
    margin: 1rem 0 0.5rem;
    color: $color-magikarp;
  }
}
</style>
