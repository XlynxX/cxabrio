<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="(toast, index) in toasts"
        :key="toast.id"
        class="bg-[#202938] text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between gap-4 w-72 animate-slide-in"
      >
        <span>{{ toast.message }}</span>
        <button @click="removeToast(index)" class="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

function addToast(message, duration = 3000) {
  const id = Date.now();
  toasts.value.push({ id, message });

  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, duration);
}

function removeToast(index) {
  toasts.value.splice(index, 1);
}

defineExpose({ addToast });
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
