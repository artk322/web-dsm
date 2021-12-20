<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn text x-large to="/">
          <span>DSM</span>
        </v-btn>
      </div>
      <v-btn text v-if="user">
        <span>{{ 'id: ' + user.id + ', type: ' + user.type }}</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn v-for="route, idx in routes" :key="idx" text :to="route.to">
        <span v-text="route.name"></span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  data: () => ({
    routes: [{
        name: 'Customers',
        to: '/customers',
      }, {
        name: 'Couriers',
        to: '/couriers',
      }, {
        name: 'Orders',
        to: '/orders'
      }, {
        name: 'Login',
        to: '/login'
      }],
  }),
  computed: {
    ...mapGetters(['user']),
  }
};
</script>
