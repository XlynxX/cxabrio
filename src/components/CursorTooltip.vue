<template>
  <div
    v-if="visible"
    class="tooltip"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
  {{ 'ТЛоды на смене:' }}
  <div v-for="(item, index) in tlodList" :key="index">
    <div><span>{{ item.name }}</span> - <span>{{ item.period }}</span></div>
  </div>
  <div class=" mt-2">Коллеги на смене:</div>
  <div v-for="(item, index) in colleagueList" :key="index">
    {{ item.name }}
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  tlodList: Array,
  adminList: Array,
  colleagueList: Array
})

const x = ref(0)
const y = ref(0)
const visible = ref(false)

function updateMousePosition(e) {
  x.value = e.pageX + 10 // offset so it doesn’t cover cursor
  y.value = e.pageY + 10
}

onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition)
  visible.value = true
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
  visible.value = false
})
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: black;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  pointer-events: none; /* so it doesn’t block mouse events */
  font-size: 14px;
  z-index: 1000;
  white-space: nowrap;
}
</style>
