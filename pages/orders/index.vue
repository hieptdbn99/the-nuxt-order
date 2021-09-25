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
                        v-model="editedItem.total_price"
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
    headers_product: [
      {
        text: 'Name',
        value: 'name',
      },
      {text: 'Total Product', value: 'total_product'},
      {text: 'Price', value: 'price'},
      {text: 'Total', value: 'total_price_pr'},
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
    ...mapState('order', ['listOrder', 'listProduct'])
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
    deleteProduct(item){
      this.editedProductIndex = this.listProductOrder.indexOf(item)
      this.editedItem.total_price -= this.listProductOrder[this.editedProductIndex].total_price_pr
      this.listProductOrder.splice(this.editedProductIndex , 1)

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
        const order = {
          orderInfo: this.editedItem,
          index: this.editedIndex
        }
        this.$store.dispatch('order/updateOrder', order)
      } else {
        this.editedItem.arrayProduct.push(this.listProductOrder);
        this.$store.dispatch('order/addOrder', this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
