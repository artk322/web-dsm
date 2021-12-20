<template>
  <v-row>
    <v-card class="mx-auto my-12" width="250" v-for="product in products" :key="product.id">
      <v-card-title v-text="product.name"></v-card-title>

      <v-card-text>
        <!-- <v-row align="center" class="mx-0">
          <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

          <div class="grey--text ms-4">4.5 (413)</div>
        </v-row> -->

        <div class="my-4 text-subtitle-1">$ {{ product.price }}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-btn color="deep-purple lighten-2 mx-auto" text @click="open_product_dialog(product)">
        Create Order
      </v-btn>
    </v-card>
    <v-dialog v-model="is_product_dialog_open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Create Order</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Details*" v-model="order_details" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Amount*" v-model="product_amount" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="is_product_dialog_open = false"> Close </v-btn>
          <v-btn
            color="blue darken-1"
            :loading="is_loading"
            text
            @click="home_create_order"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Home',

  data: () => ({
    is_product_dialog_open: false,
    selected_product: null,
    order_details: '',
    product_amount: '',
    is_loading: false,
  }),

  computed: {
    ...mapGetters(['products', 'user']),
  },

  methods: {
    ...mapActions(['get_products', 'create_order']),
    open_product_dialog(product) {
      const { type } = this.user || {};
      if (type == 'customer') {
        this.selected_product = product;
        this.is_product_dialog_open = true;
      } else {
        this.$router.push('/customers');
      }
    },
    async home_create_order() {
      this.is_loading = true;
      const payload = {
        details: this.order_details,
        amount: this.product_amount,
        product_id: this.selected_product.id,
        price: this.selected_product.price,
        name: this.selected_product.name,
      };
      await this.create_order(payload);
      this.selected_product = null;
      this.is_product_dialog_open = false;
      this.is_loading = false;
    },
  },

  async mounted() {
    await this.get_products();
  },
};
</script>
