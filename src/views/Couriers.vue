<template>
  <v-card>
    <v-card-title>
      Couriers
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="couriers" :search="search">
      <template v-slot:[`item.actions`]="{ item }">
        <v-simple-checkbox
          :ripple="false"
          :value="is_selected(item.id, 'courier')"
          @click="set_user({ id: item.id, type: 'courier' })"
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
        { text: 'phone_number', value: 'phone_number' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters(['couriers', 'user']),
  },
  methods: {
    ...mapActions(['get_couriers', 'set_user']),
    is_selected(item_id, item_type) {
      const { id, type } = this.user || {};
      if (item_id == id && item_type == type) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.get_couriers();
  },
};
</script>
