export const state = () => ({
  listOrder: [],
  listProduct: []
})

export const mutations = {
  setListOrder (state, orders) {
    state.listOrder = orders
  },
  pushOrder (state, order) {
    state.listOrder.push(order.data)
  },
  updateOrder (state, order) {
    Object.assign(state.listOrder[order.index], order.orderUpdate.data)
  },
  deleteOrder (state, index) {
    state.listOrder.splice(index, 1)
  },
  getListProduct (state, products) {
    state.listProduct = products
  }

}

export const actions = {
  async getListOrder ({ commit }) {
    await this.$axios.get('api/orders').then((res) => {
      console.log(res)
      commit('setListOrder', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  async addOrder ({ commit }, order) {
    console.log(order)
    await this.$axios.post('api/orders', order).then((res) => {
      commit('pushOrder', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  async updateOrder ({ commit }, order) {
    console.log(order.orderInfo)
    await this.$axios.put('api/orders/' + order.orderInfo.id, order.orderInfo).then((res) => {
      const updateItem = {
        orderUpdate: res.data,
        index: order.index
      }
      commit('updateOrder', updateItem)
    }).catch((err) => {
      console.log(err)
    })
  },
  async deleteOrder ({ commit }, order) {
    console.log(order.orderInfo)
    await this.$axios.delete('api/orders/' + order.orderInfo.id).then((res) => {
      const updateItem = {
        orderUpdate: res.data,
        index: order.index
      }
      commit('deleteOrder', updateItem)
    }).catch((err) => {
      console.log(err)
    })
  },
  async getListProduct ({ commit }) {
    await this.$axios.get('api/products').then((res) => {
      commit('getListProduct', res.data || [])
    }).catch((err) => {
      console.log(err)
    })
  }

}
