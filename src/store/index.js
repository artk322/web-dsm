import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const SERVICES_NAME = {
  customer: 'customers_service',
  courier: 'couriers_service',
  order: 'orders_service',
  product: 'products_service',
  feedback: 'feedback_service',
}

const STATUSES = [{
  name: 'In progress',
  value: 'in_progress',
}, {
  name: 'Delivering',
  value: 'delivering',
}, {
  name: 'Completed',
  value: 'completed'
}];

export default new Vuex.Store({
  state: {
    customers: [],
    couriers: [],
    orders: [],
    products: [],
    user: null,
    is_order_dialog_open: false,
    selected_order: null,
    feedback: null,
  },
  getters: {
    couriers: state => state.couriers,
    customers: state => state.customers,
    orders: state => state.orders,
    products: state => state.products,
    user: state => state.user,
    is_order_dialog_open: state => state.is_order_dialog_open,
    selected_order: state => state.selected_order,
    statuses: _ => STATUSES,
    feedback: state => state.feedback,
  },
  mutations: {
    set_customers(state, customers) {
      state.customers = customers;
    },
    set_couriers(state, couriers) {
      state.couriers = couriers;
    },
    set_orders(state, orders) {
      state.orders = orders;
    },
    set_products(state, products) {
      state.products = products;
    },
    set_user(state, user) {
      state.user = user;
    },
    set_is_order_dialog_open(state, is_order_dialog_open) {
      state.is_order_dialog_open = is_order_dialog_open;
    },
    set_selected_order(state, selected_order) {
      state.selected_order = selected_order;
    },
    set_feedback(state, feedback) {
      state.feedback = feedback;
    },
  },
  actions: {
    async get_load_balanced_service(_, service) {
      return (await axios.get("http://localhost:8085/get-load-balance/" + service)).data;
    },
    async get_customers({ dispatch, commit }) {
      const url = await dispatch('get_load_balanced_service', SERVICES_NAME.customer);
      const { data } = await axios.get(url + '/customer');
      commit('set_customers', data);
    },
    async get_couriers({ dispatch, commit }) {
      const url = await dispatch('get_load_balanced_service', SERVICES_NAME.courier);
      const { data } = await axios.get(url + '/courier');
      commit('set_couriers', data);
    },
    async get_orders({ dispatch, commit }) {
      const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
      const { data } = await axios.get(url + '/order');
      commit('set_orders', data);
    },
    async get_products({ dispatch, commit }) {
      const url = await dispatch('get_load_balanced_service', SERVICES_NAME.product);
      const { data } = await axios.get(url + '/product');
      commit('set_products', data);
    },
    async create_order({ dispatch, getters }, payload) {
      const { id, type } = getters.user || {};
      if (type != 'customer') {
        return;
      }
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        await axios.post(url + '/order', { ...payload, id: Date.now(), customer_id: id });
        await dispatch('get_orders');
      } catch (error) {
        console.log(error);
      }
    },
    async order_set_status({ dispatch }, { id, status }) {
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        await axios.post(`${url}/order/status/${id}`, { status });
        await dispatch('update_selected_order', id);
        await dispatch('get_orders');
      } catch (error) {
        console.log(error);
      }
    },
    async order_get_status({ dispatch }, { id }) {
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        await axios.get(`${url}/order/status/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    async order_assign_courier({ dispatch, getters }) {
      try {
        const courier_id = getters.user.id;
        const { id } = getters.selected_order;
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        await axios.post(`${url}/order/assign/courier/${id}`, { id: courier_id });
        await dispatch('update_selected_order', id);
      } catch (error) {
        console.log(error);
      }
    },
    async order_assign_feedback({ dispatch, getters }, feedback_id) {
      try {
        const { id } = getters.selected_order;
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        await axios.post(`${url}/order/assign/feedback/${id}`, { id: feedback_id });
        await dispatch('update_selected_order', id);
      } catch (error) {
        console.log(error);
      }
    },
    async update_selected_order({ dispatch, commit }, id) {
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.order);
        const { data } = await axios.get(`${url}/order/${id}`);
        commit('set_selected_order', data);
      } catch (error) {
        console.log(error);
      }
    },
    async send_feedback({ dispatch }, feedback) {
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.feedback);
        const { data } = await axios.post(url + '/feedback', feedback);
        await dispatch('order_assign_feedback', data);
        await dispatch('get_orders');
        await dispatch('get_feedback_by_id', data);
      } catch (error) {
        console.log(error);
      }
    },
    async get_feedback_by_id({ dispatch, commit }, id) {
      try {
        const url = await dispatch('get_load_balanced_service', SERVICES_NAME.feedback);
        const { data } = await axios.get(url + '/feedback/' + id);
        commit('set_feedback', data);
      } catch (error) {
        console.log(error);
      }
    },
    set_user({ commit, getters }, user) {
      const { id, type } = getters.user || {};
      if (user.id == id && user.type == type) {
        commit('set_user', null);
        return;
      }
      commit('set_user', user);
    },
    async open_order_dialog({ dispatch, commit }, order) {
      commit('set_selected_order', order);
      if (order.feedback_id) {
        await dispatch('get_feedback_by_id', order.feedback_id);
      }
      commit('set_is_order_dialog_open', true);
    },
    close_order_dialog({ commit }) {
      commit('set_selected_order', null);
        commit('set_feedback', null);
        commit('set_is_order_dialog_open', false);
    },
  },
  modules: {},
});
