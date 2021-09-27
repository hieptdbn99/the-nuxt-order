export const state = () => ({
    listOrder: [],
    listProduct: [],
    listProductOrderApi: [],
    edited: false,
})

export const mutations = {
    setListOrder(state, orders) {
        state.listOrder = orders
    },
    pushOrder(state, order) {
        state.listOrder.unshift(order)
    },
    updateOrder(state, order) {
        Object.assign(state.listOrder[order.index], order.orderUpdate)
    },
    deleteOrder(state, index) {
        state.listOrder.splice(index, 1)
    },
    getListProduct(state, products) {
        state.listProduct = products.data
    },
    getListProductOrder(state, products) {
        state.listProductOrderApi = products
    },

}
export const getters = {
    getListProductOrder (state) {
        return state.listProductOrderApi
    }
}

export const actions = {
    async getListOrder({commit}) {
        await this.$axios.get('api/orders').then((res) => {
            console.log(res)
            commit('setListOrder', res.data)
        }).catch((err) => {
            console.log(err)
        })
    },
    async addOrder({commit}, order) {
        console.log(order)
        await this.$axios.post('api/orders', order).then((res) => {
            console.log(res.data)
            commit('pushOrder', res.data)
        }).catch((err) => {
            console.log(err)
        })
    },
    async updateOrder({commit}, order) {
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
    async deleteOrder({commit}, order) {
        console.log(order.orderInfo)
        await this.$axios.delete('api/orders/' + order.orderInfo.id).then((res) => {
            const updateItem = {
                orderUpdate: res.data,
                index: order.index
            }
            commit('deleteOrder', order.index)
        }).catch((err) => {
            console.log(err)
        })
    },
    async getListProduct({commit}) {
        await this.$axios.get('api/products').then((res) => {
            commit('getListProduct', res.data || [])
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    },
    async getListProductOrder({commit},idOrder) {
        await this.$axios.get('api/products-order/'+idOrder).then((res) => {
            console.log(res.data)
            commit('getListProductOrder', res.data || [])
        })
    }

}
