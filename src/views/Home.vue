<template>
  <v-row>
    <Restaurant v-for="item in 4" :key="item" />
  </v-row>
</template>

<script>
import Restaurant from '../components/Restaurant.vue';

export default {
  name: 'Home',

  components: {
    Restaurant,
  },
};
</script>
