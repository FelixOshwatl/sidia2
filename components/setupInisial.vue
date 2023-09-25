<template>
  <v-data-table
    dense
    :headers="headers"
    :items="rows"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar text dark style="background: #eee; color: #000">
        <v-toolbar-title></v-toolbar-title>SETUP / INISIAL
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
                          v-model="editedItem.npk"
                          :rules="rules.required"
                          :disabled="!readOnly"
                          :items="dataKaryawan"
                          :item-text="item=> item.val + ' - ' + item.name " 
                          item-value="val"
                          @change="mappingForm()"
                          label="NPK*"
                          placeholder="Search NPK"
                        ></v-autocomplete>
                    </v-col>
                     <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="editedItem.kodeKantor"
                        label="Kode Kantor"
                        readonly
                        :disabled="!readOnly"
                        :rules="rules.required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="editedItem.kodeInisial"
                        label="Kode Inisial"
                        v-mask="'AA'"
                        counter
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
      </v-toolbar>
    </template>
    <template v-slot:item="{ item,index}">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.npk }}</td>
          <td>{{ item.kodeInisial }}</td>
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
import { VueMaskDirective } from 'v-mask'
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "No.", value: "noIndex" },
      { text: "NPK", value: "npk" },
      { text: "Kode Inisial", value: "kodeInisial" },
      { text: "Keterangan", value: "keterangan" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rows: [],
    editedIndex: -1,
    editedItem: {},
    dataKaryawan: [],
    defaultItem: {},
    valid: false,
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
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
    this.getDataKaryawan();
    this.initialize();
  },

  methods: {
    readOnly() {
      return this.editedIndex === -1
    },
    async initialize() {
      const { data } = await this.$axios.get("/master/naskah-inisial");
      this.rows = data.data;
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

    getDataKaryawan: async function () {
      const { data } = await this.$axios.get("/hcis/karyawan");
      this.dataKaryawan = data.data;
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

    mappingForm: async function() {
      let data = this.dataKaryawan.find((item) => item.val === this.editedItem.npk)
      this.editedItem.kodeKantor = data.unitKantor
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
            npk: this.editedItem.npk, 
            kodeKantor: this.editedItem.kodeKantor, 
            kodeInisial: this.editedItem.kodeInisial, 
            keterangan: this.editedItem.keterangan,
            petugasRekam: "FE171900",  
          };
          console.log(params)
          let { data } = await this.$axios.post("/master/naskah-inisial", params);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.$swal("", "Data berhasil ditambahkan", "success");
            this.close()
            this.initialize()
            this.overlay = false;
            } else {
            this.overlay = false;
            this.close()
            this.$swal("", "Data gagal ditambahkan", "error");
            }
          } else {
            this.overlay = false;
            this.$swal("", "Kesalahan Sistem", "error");
          }
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },
    updateData: async function () {
      try {
         if (this.$refs.form.validate()) {
          this.overlay = true;
          const id = this.editedItem.id
          var params = {
            npk: this.editedItem.npk, 
            kodeKantor: this.editedItem.kodeKantor, 
            kodeInisial: this.editedItem.kodeInisial, 
            keterangan: this.editedItem.keterangan,
            petugasUbah: "FE171900",  
          };
          console.log(params)
          let { data } = await this.$axios.put("/master/naskah-inisial/"+ id, params);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.close()
            this.initialize()
            this.overlay = false;
            this.$swal("", "Data berhasil di-update", "success");
            } else {
            this.overlay = false;
            this.close()
            this.$swal("", "Data gagal di-update", "error");
            }
          } else {
            this.overlay = false;
            this.$swal("", "Data gagal di-update", "error");
          }
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },
    deleteData: async function () {
      try {
          this.overlay = true;
          const id = this.editedItem.id
          var petugasUbah = "FE171900"
          let { data } = await this.$axios.delete("/master/naskah-inisial/"+ id +"/" + petugasUbah);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.closeDelete()
            this.initialize()
            this.overlay = false;
            this.$swal("", "Data berhasil dihapus", "success");
            } else {
            this.overlay = false;
            this.closeDelete()
            this.$swal("", "Data gagal dihapus", "error");
            }
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
        this.closeDelete()
      }
    },
  },
};
</script>