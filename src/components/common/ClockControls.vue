<script>
export default {
  name: 'ClockControls',
  props: {
    time: { type: String, required: true },
  },
  emits: ['advance-time'],
  setup(props, { emit }) {
    function advanceTime(minutes) {
      emit('advance-time', minutes);
    }

    return { advanceTime };
  },
};
</script>

<template>
  <div class="clock-controls">
    <span class="fw-bold">{{ time }} hr</span>
    <button class="btn btn-sm btn-secondary" @click="advanceTime(1)">+1 min</button>
    <button class="btn btn-sm btn-secondary" @click="advanceTime(5)">+5 min</button>
  </div>
</template>
