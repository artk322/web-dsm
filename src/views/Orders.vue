<template>
  <v-card>
    <v-card-title>
      Orders
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="orders" :search="search">
      <template v-slot:[`item.open`]="{ item }">
        <v-icon @click="open_order_dialog(item)">mdi-open-in-new</v-icon>
      </template>
    </v-data-table>
    <Order />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Order from '@/components/Order.vue';

export default {
  components: { Order },
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
        { text: 'Courier_id', value: 'courier_id' },
        { text: 'Customer_id', value: 'customer_id' },
        { text: 'Product_id', value: 'product_id' },
        { text: 'Feedback_id', value: 'feedback_id' },
        { text: 'Status', value: 'status' },
        { text: 'Is_paid', value: 'is_paid' },
        { text: 'Details', value: 'details' },
        { text: 'Open', value: 'open' },
      ],
    };
  },
  computed: {
    ...mapGetters(['orders', 'user']),
  },
  methods: {
    ...mapActions(['get_orders', 'set_user', 'open_order_dialog']),
    is_selected(item_id, item_type) {
      const { id, type } = this.user || {};
      if (item_id == id && item_type == type) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.get_orders();
  },
};
</script>
