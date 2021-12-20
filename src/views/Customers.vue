<template>
  <v-card>
    <v-card-title>
      Customers
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="customers" :search="search">
      <template v-slot:[`item.actions`]="{ item }">
        <v-simple-checkbox
          :ripple="false"
          :value="is_selected(item.id, 'customer')"
          @click="set_user({ id: item.id, type: 'customer' })"
        ></v-simple-checkbox>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      search: '',
      headers: [
        { text: 'id', value: 'id' },
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'email', value: 'email' },
        { text: 'balance', value: 'balance' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters(['customers', 'user']),
  },
  methods: {
    ...mapActions(['get_customers', 'set_user']),
    is_selected(item_id, item_type) {
      const { id, type } = this.user || {};
      if (item_id == id && item_type == type) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.get_customers();
  },
};
</script>
