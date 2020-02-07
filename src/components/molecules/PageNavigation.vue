<template lang="pug">
.pageNavigation
  ul
    li(v-for="path in paths")
      nuxt-link(
        :to="localePath(path.location)"
        :class="{ 'nuxt-link-active': isActive(path.title)}"
      ) {{ path.title }}
        .link_underline
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'nuxt-property-decorator'

  interface Link {
    title: string,
    location: Location,
  }

@Component({})
  export default class PageNavigation extends Vue {
    @Prop() paths!: Array<Object>

    isActive (title) {
      const lowerCaseTitle = title.toLowerCase()
      const lowerCasePath = this.$route.path
      return lowerCasePath.includes(lowerCaseTitle)
    }
  }
</script>

<style lang="scss" scoped>
.pageNavigation{
  .link_underline {
    margin: 0.25rem auto 1rem;
    height: 2px;
    border-radius: 1rem;
    width: 70%;
    background-color: $color-magikarp;
    opacity: 0;
    transition: 0.1s ease-in-out;

    @include breakpoint(sm) {
      height: 3px;
      margin: 0.5rem auto 0;
    }
  }

  ul {
    font-weight: 300;
    display: flex;
    justify-content: space-around;
    list-style-type: none;
    margin: 1.5rem auto 1rem;
    max-width: 640px;
    padding: 0;
    font-size: 0.9rem;

    @include breakpoint(sm) {
      font-size: 1.1rem;
      margin: 2rem auto;
    }
  }

  li {
    a {
      opacity: 0.7;
    }
  }
}

.nuxt-link-exact-active, .nuxt-link-active {
  opacity: 1 !important;
  .link_underline {
    opacity: 1;
  }
}
</style>
