<template>
  <v-dialog
    v-model="is_order_dialog_open"
    v-if="selected_order"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="close_order_dialog()"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close_order_dialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Order #{{ selected_order.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-toolbar-items>
          <v-btn dark text @click="close_order_dialog()"> Close </v-btn>
        </v-toolbar-items> -->
      </v-toolbar>
      <v-list three-line subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Order Status</v-list-item-title>
            <v-list-item-subtitle>
              {{ selected_order.status }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="feedback">
          <v-list-item-content>
            <v-list-item-title>Feedback Title</v-list-item-title>
            <v-list-item-subtitle>
              {{ feedback.title }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="feedback">
          <v-list-item-content>
            <v-list-item-title>Feedback Description</v-list-item-title>
            <v-list-item-subtitle>
              {{ feedback.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template
        v-if="
          user &&
          user.id == selected_order.customer_id &&
          user.type == 'customer' &&
          !selected_order.feedback_id &&
          selected_order.status == 'completed'
        "
      >
        <v-container>
          <v-form>
            <v-text-field v-model="title" label="Title" required></v-text-field>
            <v-text-field v-model="description" label="Description" required></v-text-field>
            <v-btn color="primary" @click="send_feedback({ id: Date.now(), title, description })"
              >Submit Feedback</v-btn
            >
          </v-form>
        </v-container>
      </template>
      <template v-if="user && user.type == 'courier'">
        <v-divider></v-divider>
        <v-subheader>Actions</v-subheader>
        <v-row>
          <v-col
            class="justify-center align-center"
            cols="3"
            v-if="selected_order && !selected_order.courier_id"
          >
            <v-btn color="warning" dark @click="order_assign_courier()">Take to work</v-btn>
          </v-col>
          <v-col
            class="justify-center align-center"
            cols="3"
            v-if="selected_order && user.id == selected_order.courier_id"
          >
            <v-select
              :items="statuses"
              item-text="name"
              item-value="value"
              label="Change status"
              v-model="selected_status"
              solo
            ></v-select>
            <v-btn dark :loading="status_loading" color="primary" @click="save_status"
              >Save status</v-btn
            >
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data: () => ({
    selected_status: null,
    status_loading: false,
  }),
  computed: {
    ...mapGetters([
      'orders',
      'user',
      'is_order_dialog_open',
      'selected_order',
      'statuses',
      'feedback',
    ]),
  },
  methods: {
    ...mapActions([
      'get_orders',
      'close_order_dialog',
      'order_assign_courier',
      'order_set_status',
      'send_feedback',
    ]),
    async save_status() {
      this.status_loading = true;
      const payload = {
        id: this.selected_order.id,
        status: this.selected_status,
      };
      await this.order_set_status(payload);
      this.status_loading = false;
    },
  },
  async mounted() {},
};
</script>
