<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import Calendar from './components/Calendar.vue'
import router from './router'

</script>

<template>
  <header>
  </header>
  <body>
    <!-- <Calendar /> -->
    <router-view />
  </body>
</template>

<style scoped>
</style>
