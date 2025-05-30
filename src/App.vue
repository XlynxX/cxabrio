<script setup>
import { ref, onMounted } from 'vue';
import Toast from './components/Toast.vue';
import { registerToast } from './composables/useToast';

const toastRef = ref(null);
onMounted(() => registerToast(toastRef.value));
</script>

<template>
  <header>
  </header>

  <body>
    <Toast ref="toastRef" />
    <router-view />
  </body>
</template>

<style scoped></style>
