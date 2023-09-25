/* eslint-disable */
<template>
  <v-data-table
    dense
    :headers="headers"
    :items="rows"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar text dark style="background: #eee; color: #000">
        <v-toolbar-title></v-toolbar-title>SETUP / KLASIFIKASI JENIS
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" class="mb-2" v-bind="attrs" v-on="on"
              >New Item</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid" :lazy-validation="false">
                  <v-row>
                     <v-col cols="12" sm="6" md="8">
                      <v-autocomplete
                          v-model="editedItem.kodePokokMasalah"
                          :rules="rules.required"
                          :items="dataPokokMasalah"
                          :item-text="item=> item.kodePokokMasalah + ' - ' + item.pokokMasalah " 
                          item-value="kodePokokMasalah"
                          label="Kode Pokok Masalah*"
                          placeholder="Search Pokok Masalah"
                        ></v-autocomplete>
                    </v-col>
                     <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.jenis"
                        label="Jenis"
                        :rules="rules.required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="1" md="12">
                      <v-text-field
                        v-model="editedItem.keterangan"
                        label="Keterangan"
                        :rules="rules.required"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="green darken-1" @click="save" :disabled="!valid"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="290">
        <v-card>
          <v-card-title class="headline">Konfirmasi hapus</v-card-title>

          <v-card-text>Yakin ingin menghapus data yang dipilih?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" @click="closeDelete">Batal</v-btn>
            <v-btn color="success" @click="deleteData()">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
      :timeout="3000"
      botton
      :color="snackbar.color"
      v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn dark text @click.native="snackbar.show = false" icon> 
        <v-icon>close</v-icon>
      </v-btn>
      </v-snackbar>
      </v-toolbar>
    </template>
    <template v-slot:item="{ item,index}">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.kodePokokMasalah }}</td>
          <td>{{ item.pokokMasalah }}</td>
           <td>{{ item.jenis }}</td>
          <td>{{ item.keterangan }}</td>
          <td>
        <v-tooltip bottom>
          <template  v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        </template>
             <span>Edit</span>
         </v-tooltip>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on" @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
             <span>Delete</span>
         </v-tooltip>
          </td>
        </tr>
      </template>
    <template v-slot:no-data>
      <v-btn text color="default" @click="initialize">Reload</v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.v-application .elevation-1 {
  box-shadow: 0px 0px 0px 0px !important;
}
</style>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "No.", value: "noIndex" },
      { text: "Kode Pokok Masalah", value: "kodePokokMasalah" },
      { text: "Pokok Masalah", value: "pokokMasalah" },
      { text: "Jenis", value: "jenis" },
      { text: "Keterangan", value: "keterangan" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rows: [],
    dataPokokMasalah: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    valid: false,
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
    snackbar: {
        show: false,
        text: '',
        color: '',
      },
      y: 'bottom',
      color: '',
      timeout: 2000,
      text: ''
  }),


  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.getDataPokokMasalah();
  },

  methods: {
    async initialize() {
      const { data } = await this.$axios.get("/master/klasifikasi-jenis");
      this.rows = data.data;
    },

    getDataPokokMasalah: async function () {
      const { data } = await this.$axios.get("/master/klasifikasi-masalah");
      this.dataPokokMasalah = data.data;
    },

    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    close() {
      this.dialogDelete = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {})
        this.$refs.form.reset()
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {})
        this.editedIndex = -1;
      });
    },

    save: async function() {
      if (this.editedIndex > -1) {
        await this.updateData()
      } else {
        await this.addData()
      }
    },
    addData: async function () {
      try {
         if (this.$refs.form.validate()) {
          this.overlay = true;
          var params = {
            kodePokokMasalah: this.editedItem.kodePokokMasalah, 
            jenis: this.editedItem.jenis, 
            keterangan: this.editedItem.keterangan,
            petugasRekam: "FE171900",  
          };
          console.log(params)
          let { data } = await this.$axios.post("/master/klasifikasi-jenis", params);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.close()
            this.initialize()
            this.overlay = false;
            this.snackbar.color = 'success'
            this.snackbar.text = 'Data Berhasil Ditambahkan'
            this.snackbar.show = true
            } else {
            this.overlay = false;
            this.close()
            this.snackbar.color = 'error'
            this.snackbar.text = 'Data Gagal Ditambahkan'
            this.snackbar.show = true
            }
          } else {
            this.overlay = false;
            this.snackbar.show = true;
            this.snackbar.text = this.result.msg;
            this.snackbar.color = "error";
          }
      } catch (error) {
        this.overlay = false;
        this.snackbar.show = true;
        this.snackbar.text = "Gagal request ke server!";
        this.snackbar.color = "error";
        console.log(error.message.toString());
      }
    },
    updateData: async function () {
      try {
         if (this.$refs.form.validate()) {
          this.overlay = true;
          const id = this.editedItem.id
          var params = {
            kodePokokMasalah: this.editedItem.kodePokokMasalah, 
            jenis: this.editedItem.jenis, 
            keterangan: this.editedItem.keterangan,
            petugasUbah: "FE171900",  
          };
          console.log(params)
          let { data } = await this.$axios.put("/master/klasifikasi-jenis/"+ id, params);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.close()
            this.initialize()
            this.overlay = false;
            this.snackbar.color = 'success'
            this.snackbar.text = 'Data Berhasil Di-Update'
            this.snackbar.show = true
            } else {
            this.overlay = false;
            this.close()
            this.snackbar.color = 'error'
            this.snackbar.text = 'Data Gagal Di-Update'
            this.snackbar.show = true
            }
          } else {
            this.overlay = false;
            this.snackbar.show = true;
            this.snackbar.text = this.result.msg;
            this.snackbar.color = "error";
          }
      } catch (error) {
        this.overlay = false;
        this.snackbar.show = true;
        this.snackbar.text = "Gagal request ke server!";
        this.snackbar.color = "error";
        console.log(error.message.toString());
      }
    },
    deleteData: async function () {
      try {
          this.overlay = true;
          const id = this.editedItem.id
          var petugasUbah = "FE171900"
          let { data } = await this.$axios.delete("/master/klasifikasi-jenis/"+ id +"/" + petugasUbah);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.closeDelete()
            this.initialize()
            this.overlay = false;
            this.snackbar.color = 'success'
            this.snackbar.text = 'Data Berhasil Dihapus'
            this.snackbar.show = true
            } else {
            this.overlay = false;
            this.closeDelete()
            this.snackbar.color = 'error'
            this.snackbar.text = 'Data Gagal Dihapus'
            this.snackbar.show = true
            }
      } catch (error) {
        this.overlay = false;
        this.snackbar.show = true;
        this.snackbar.text = "Gagal request ke server!";
        this.snackbar.color = "error";
        this.closeDelete()
        console.log(error.message.toString());
      }
    },
  },
};
</script>