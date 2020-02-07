<template lang="pug">
transition(:name="transitionName" @after-enter="$emit('modal-open')" appear)
  .modal(:class="{ 'modalBottom': modalType === 'bottom', 'modalTop': modalType === 'top', 'mobileSafari': isMobileSafari }")
    .modal__mask
    .modal__wrapper(@click.stop="$emit('modal-close')")
      .modal__container(
        @click.stop
      )
        .modal__header
          button.modal__close(v-if="$listeners['modal-close']" @click="$emit('modal-close')") &times;
          slot(name="header")
        .modal__body
          .modal__bodyInner
            slot
        .modal__footer--transparent(
          v-if="$slots.transparentFooter"
        )
          slot(name="transparentFooter")
        .modal__footer(v-if="$slots.footer")
          slot(name="footer")
        .modal__footerOneBtn(
          v-if="$slots.footerOneBtn"
          :class="{'modal__footerOneBtn--transparent': transparentFooter}"
        )
          slot(name="footerOneBtn")
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
  export default class Modal extends Vue {
    @Prop() type?: string
    @Prop() appendToBody?: Boolean

    get modalType () {
      return this.type
    }

    get transitionName () {
      if (this.modalType === 'bottom') {
        return 'modalBottom'
      }
      return 'modal'
    }

    get isMobileSafari () {
      if (process.server) { return false }
      return (
        !window.web3 &&
        window.platform &&
        window.platform.name === 'Safari' &&
        window.platform.os.family === 'iOS'
      )
    }

    mounted () {
    this.$util.bodyScrollLockOn(this.$el.querySelector('.modal__body'))
    this.appendToBody && document.body.appendChild(this.$el)
  }

  beforeDestroy () {
    this.$util.bodyScrollLockClear()
  }

  destroyed () {
    if (!this.appendToBody) { return }
    setTimeout(() => {
      if (this.$el && this.$el.parentNode && this.$el.parentNode.removeChild) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }, 300)
  }
  }
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__mask {
    background: rgba(0, 0, 0, 0.85);
    position: absolute;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-backdrop-filter: blur(10px);
  }

  &__wrapper {
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    box-sizing: border-box;
    height: 100%;
    padding: 2rem 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__container {
    background: $color-obsidian;
    border-radius: 0.2rem;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.41);
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: 640px;
    width: 100%;
    border: 1px solid rgba($color-magikarp, 0.4);

    @include breakpoint(sm) {
      margin: 0 auto;
    }
  }

  &__header {
    padding: 1rem;
    position: relative;
    text-align: center;

    /deep/ * {
      font-size: 1rem;
    }

    @include breakpoint(sm) {
      /deep/ * {
        font-size: 1.1rem;
      }
    }
  }

  &__body {
    display: flex;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__bodyInner {
    height: 100%;
    padding: 1rem;
    width: 100%;

    @include breakpoint(sm) {
      padding: 2rem;
    }
  }

  &__footer {
    /deep/ {
      background-color: darken($color-obsidian, 4);
      border-radius: 0 0 0.2rem 0.2rem;
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;

      a, button {
        @extend %btn-primary;
      }
    }

    &--transparent {
      border-radius: 0 0 0.2rem 0.2rem;
      display: flex;
      flex: 0 0 auto;
      padding: 1rem;
      background-color: rgba($color-obsidian, 0) !important;

      @include breakpoint(sm) {
        padding: 1rem 2rem;
      }
    }
  }

  &__footerOneBtn {
    /deep/ {
      background-color: darken($color-obsidian, 4);
      border-radius: 0 0 0.2rem 0.2rem;
      display: flex;
      flex: 0 0 auto;
      padding: 1rem;

      @include breakpoint(sm) {
        padding: 1rem 2rem;
      }

      button {
        @extend %btn-primary;
        width: 100%;

        svg + span,
        span + svg {
          margin-left: 0.5rem;
        }
      }
    }

    &--transparent {
      /deep/ {
        background-color: rgba($color-obsidian, 0) !important;
      }
    }
  }

  &__close {
    appearance: none;
    background: transparent;
    border: 0;
    color: rgba($color-swan, 0.8);
    font-weight: 300;
    font-size: 1.5rem;
    height: 2rem;
    line-height: 1;
    margin: 0.5rem;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 2rem;
    transition: 0.2s ease-in-out;

    &:hover {
      cursor: pointer;
      color: $color-magikarp;
    }
  }

  &Bottom {
    .modal__wrapper {
      padding: 1rem 0 0;
      align-items: flex-end;

      @include breakpoint(sm) {
       padding: 2rem 0 0;
      }
    }

    .modal__container {
      border-radius: 1rem 1rem 0 0;
      box-shadow: 0 -1rem 2rem rgba(0, 0, 0, 0.1);
      max-width: 960px;
    }
  }

  &Top {
    .modal__wrapper {
      padding: 1rem;
      align-items: flex-start;

      @include breakpoint(sm) {
       padding: 2rem;
      }
    }

    .modal__container {
      border-radius: 1rem;
      box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
      max-width: 960px;
    }

    .modal__header {
      border-bottom: 1px solid rgba($color-swan, 0.8);
    }

    .modal__footer {
      background: darken($color-obsidian, 4);
    }
  }
}
</style>
