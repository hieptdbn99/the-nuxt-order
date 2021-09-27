<template>
  <v-data-table
      :headers="headers"
      :items="listOrder"
      class="elevation-1"
  >
    <template #top>
      <v-toolbar
          flat
      >
        <v-toolbar-title>ORDERS LIST</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        />
        <v-spacer/>

        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template #activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >
              New Item
            </v-btn>
          </template>
            <v-card>
              <v-form ref="form">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="12"
                    >
                      <v-text-field
                          v-model="editedItem.name_customer"
                          label="Name Customer"
                      />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.phone"
                          label="Phone"
                      />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="8"
                    >
                      <v-text-field
                          v-model="editedItem.email"
                          :rules="[rules.required, rules.email]"
                          label="Email"

                      />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="12"
                    >
                      <v-text-field
                          v-model="editedItem.address"
                          label="Address"
                      />
                    </v-col>
                    <v-col
                        class="d-flex"
                        cols="12"
                        sm="4"
                    >
                      <v-select
                          v-model="newProductSelect"
                          :items="listProduct"
                          item-text="name"
                          item-value="id"
                          label="Select Product"
                          persistent-hint
                          return-object
                          single-line
                      ></v-select>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="newProductAmount.total_product"
                          label="Total Products"
                          type="number"
                          hide-details
                          single-line
                          min="0"
                      />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="1"
                        class="mt-3"
                    >
                      <v-btn
                          icon
                          color="pink"
                          @click="addProductOrder"
                      >

                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                    <template>
                      <v-col
                          cols="12"
                          sm="12"
                          md="12">
                        <v-data-table
                            :headers="headers_product"
                            :items="listProductOrder"
                            hide-default-footer
                        >
                          <template v-slot:item.price="{ item }">
                          <span>{{
                              new Intl.NumberFormat('vi-VI', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(item.price)
                            }}</span>
                          </template>
                          <template v-slot:item.total_price_pr="{ item }">
                          <span>{{
                              new Intl.NumberFormat('vi-VI', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(item.total_price_pr)
                            }}</span>
                          </template>
                          <template #item.actions="{ item }">
                            <v-icon
                                small
                                @click="deleteProduct(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                      </v-col>

                    </template>
                    <v-col
                        class="text-right"
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="totalPrice"
                          label="Total Price"
                          disabled
                      >
                        />
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer/>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
              </v-form>
            </v-card>


        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="blue darken-1" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.total_price="{ item }">
      <span>{{
          new Intl.NumberFormat('vi-VI', {
            style: 'currency',
            currency: 'VND',
          }).format(item.total_price)
        }}</span>
    </template>
    <template #item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template #no-data>
      <v-btn
          color="primary"
          @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {mapState} from 'vuex'

export default {

  async asyncData({store}) {
    await Promise.all([
      store.dispatch('order/getListProduct')
    ])

  },
  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
    formHasErrors: false,
    headers_product: [
      {
        text: 'Name',
        value: 'name',
      },
      {text: 'Total Product', value: 'total_product', sortable: false},
      {text: 'Price', value: 'price', sortable: false},
      {text: 'Total', value: 'total_price_pr', sortable: false},
      {text: 'Actions', value: 'actions', sortable: false},
    ],

    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Name customer',
        align: 'start',
        sortable: false,
        value: 'name_customer'
      },
      {text: 'Phone', value: 'phone'},
      {text: 'Email', value: 'email'},
      {text: 'Address', value: 'address'},
      {text: 'Total Price', value: 'total_price'},
      {text: 'Actions', value: 'actions', sortable: false}
    ],
    editedProductIndex: -1,
    editedIndex: -1,
    editedItem: {
      name_customer: '',
      phone: '',
      email: '',
      address: '',
      arrayProduct: [],
      total_price: 0,
    },
    defaultItem: {
      name_customer: '',
      phone: '',
      email: '',
      address: '',
      total_product: 0,
      price: 0,
      total_price: 0
    },
    newProductSelect: {
      id: 0,
      name: '',
      price: '',
    },
    newProductAmount: {
      total_product: 0,
      total_price_pr: 0,
    },
    listProductOrder: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    ...mapState('order', ['listOrder', 'listProduct']),
    listProductOrderCpt() {
      // console.log(this)
      return [...this.$store.state.order.listProductOrderApi]
    },
    totalPrice() {
      return new Intl.NumberFormat('vi-VI', {
        style: 'currency',
        currency: 'VND',
      }).format(this.editedItem.total_price)
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.$store.dispatch('order/getListOrder')
    },
    editItem(item) {
      this.editedIndex = this.listOrder.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$store.dispatch('order/getListProductOrder', this.editedItem.id).then(() => {
        this.listProductOrder = this.listProductOrderCpt
        console.log(this.listProductOrder)
      })

      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.listOrder.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    addProductOrder() {
      this.newProductAmount.total_price_pr = parseInt(this.newProductAmount.total_product) * parseInt(this.newProductSelect.price)
      this.listProductOrder.push(Object.assign(this.newProductSelect, this.newProductAmount))
      this.editedItem.total_price += this.newProductAmount.total_price_pr
      this.newProduct = {
        id: 0,
        name: '',
        price: '',
      }
      this.newProductAmount = {
        total_product: 0,
        total_price_pr: '',
      }
      console.log(this.listProductOrder)
    },
    deleteProduct(item) {
      this.editedProductIndex = this.listProductOrder.indexOf(item)
      this.editedItem.total_price -= this.listProductOrder[this.editedProductIndex].total_price_pr
      this.listProductOrder.splice(this.editedProductIndex, 1)

    },
    deleteItemConfirm() {
      const order = {
        orderInfo: this.editedItem,
        index: this.editedIndex
      }
      this.$store.dispatch('order/deleteOrder', order)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.listProductOrder = []
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        console.log(this.listProductOrder)
        this.editedItem.arrayProduct = this.listProductOrder;
        console.log(this.editedItem.arrayProduct)
        const order = {
          orderInfo: this.editedItem,
          index: this.editedIndex
        }
        if(this.$refs.form.validate()) {
          this.$store.dispatch('order/updateOrder', order).then(() => {
            this.$toast.success('Successfully saved', {
              type: 'success',
              duration: 1000
            })
          })
          this.close()
        }

      } else {
        if(this.$refs.form.validate()){
          this.editedItem.arrayProduct = this.listProductOrder;
          this.$store.dispatch('order/addOrder', this.editedItem).then(() => {
            this.$toast.success('Successfully saved', {
              type: 'success',
              duration: 1000
            })
          })
          this.close()
        }

      }
    }
  }
}
</script>

<style scoped>
.inputPrice input[type='number'] {
  -moz-appearance: textfield;
}

.inputPrice input::-webkit-outer-spin-button,
.inputPrice input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

</style>
