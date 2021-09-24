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
        <v-spacer />

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
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.total_product"
                      label="Total Products"
                      type="number"
                      @keyup="changeTotalPrice"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.price"
                      label="Price"
                      type="number"
                      @keyup="changeTotalPrice"
                    />
                  </v-col>
                  <v-col
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
              <v-spacer />
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
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer />
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
import { mapState } from 'vuex'
export default {

  async asyncData ({ store }) {
    await Promise.all([
      console.log('hello'),
      store.dispatch('order/getListProduct')
    ])
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Name customer',
        align: 'start',
        sortable: false,
        value: 'name_customer'
      },
      { text: 'Phone', value: 'phone' },
      { text: 'Email', value: 'email' },
      { text: 'Address', value: 'address' },
      { text: 'Total Product', value: 'total_product' },
      { text: 'Price', value: 'price' },
      { text: 'Total Price', value: 'total_price' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name_customer: '',
      phone: '',
      email: '',
      address: '',
      total_product: 0,
      price: 0,
      total_price: 0
    },
    defaultItem: {
      name_customer: '',
      phone: '',
      email: '',
      address: '',
      total_product: 0,
      price: 0,
      total_price: 0
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    ...mapState('order', ['listOrder', 'listProduct'])

  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.$store.dispatch('order/getListOrder')
    },
    changeTotalPrice () {
      this.editedItem.total_price = this.editedItem.total_product * this.editedItem.price
    },
    editItem (item) {
      this.editedIndex = this.listOrder.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.listOrder.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const order = {
        orderInfo: this.editedItem,
        index: this.editedIndex
      }
      this.$store.dispatch('order/deleteOrder', order)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        const order = {
          orderInfo: this.editedItem,
          index: this.editedIndex
        }
        this.$store.dispatch('order/updateOrder', order)
      } else {
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
