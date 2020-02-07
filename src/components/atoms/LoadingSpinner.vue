<template <template lang="pug">
.loading-spinner
</template>

<script>
  export default {}
</script>

<style <style lang="scss">
.loading-spinner {
  display: inline-block;
  box-sizing: border-box;
  border: 2px solid rgb(59, 59, 59);
  border-left-color: $color-magikarp;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  animation: donut-spin 1.2s linear infinite;
}

@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
