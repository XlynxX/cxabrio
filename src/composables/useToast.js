import { ref } from 'vue';

const toastRef = ref(null);

export function registerToast(refInstance) {
  toastRef.value = refInstance;
}

export function showToast(message, duration = 4000) {
  toastRef.value?.addToast(message, duration);
}
