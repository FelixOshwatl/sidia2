<template>
  <div>
    <v-data-table dense :headers="headers" :items="rows" class="elevation-1">
      <template v-slot:top>
        <v-toolbar text dark style="background: #eee; color: #000">
          <v-toolbar-title></v-toolbar-title>SETUP / PENUGASAN SEKRETARIS
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px" scrollable>
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
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                          v-model="editedItem.npk"
                          :rules="rules.required"
                          :items="dataKaryawan"
                          :item-text="(item) => item.val + ' - ' + item.name"
                          item-value="val"
                          @change="mappingForm()"
                          label="Sekretaris*"
                          placeholder="Search Sekretaris"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.namaJobtitle"
                          label="Nama Jobtitle*"
                          :rules="rules.required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-autocomplete
                          v-model="editedItem.unitKantor"
                          :rules="rules.required"
                          :items="dataKantor"
                          item-text="namaKantor"
                          item-value="kodeKantor"
                          label="Kantor*"
                          placeholder="Search Kantor"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          ref="menuMulai"
                          v-model="menuMulai"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              :value="computedDateFormattedMomentjs1"
                              label="Tanggal Mulai"
                              readonly
                              v-on="on"
                              :rules="rules.required"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="tanggalMulai"
                            :min="minDateStart"
                            color="success"
                            @input="setenddate"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          ref="menuAkhir"
                          v-model="menuAkhir"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              :value="computedDateFormattedMomentjs2"
                              label="Tanggal Akhir"
                              readonly
                              v-on="on"
                              :rules="rules.required"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="tanggalAkhir"
                            :min="minDateEnd"
                            color="success"
                            @input="menuAkhir = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
                <v-btn
                  color="green dark darken-1"
                  @click="save"
                  :disabled="!valid"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="290">
            <v-card>
              <v-card-title class="headline">Konfirmasi hapus</v-card-title>

              <v-card-text
                >Yakin ingin menghapus data yang dipilih?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" @click="closeDelete">Batal</v-btn>
                <v-btn color="success" @click="deleteData()">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.namaPegawai }}</td>
          <td>{{ item.namaJobtitle }}</td>
          <td>{{ item.unitKantor }}</td>
          <td>{{ $moment(item.tglMulai).format("DD/MM/YYYY") }}</td>
          <td>{{ $moment(item.tglAkhir).format("DD/MM/YYYY") }}</td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
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
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<style scoped>
.v-application .elevation-1 {
  box-shadow: 0px 0px 0px 0px !important;
}
</style>

<script>
import { VueMaskDirective } from "v-mask";
export default {
  props: {
    kodeUser: {
      type: String,
      required: true,
      default: null,
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "No.", value: "noIndex" },
      { text: "Nama Pegawai", value: "namaPegawai" },
      { text: "Jobtitle", value: "namaJobtitle" },
      { text: "Unit Kantor", value: "unitKantor" },
      { text: "Tanggal Mulai", value: "tglMulai" },
      { text: "Tanggal Akhir", value: "tglAkhir" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rows: [],
    editedIndex: -1,
    editedItem: {},
    dataKaryawan: [],
    dataKantor: [],
    defaultItem: {},
    valid: false,
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
    menuMulai: false,
    menuAkhir: false,
    tanggalMulai: new Date().toISOString().substr(0, 10),
    tanggalAkhir: new Date().toISOString().substr(0, 10),
    minDateStart: new Date().toISOString().substr(0, 10),
    minDateEnd: new Date().toISOString().substr(0, 10),
    overlay: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    computedDateFormattedMomentjs1() {
      return this.tanggalMulai
        ? this.$moment(this.tanggalMulai).format("DD/MM/YYYY")
        : "";
    },
    computedDateFormattedMomentjs2() {
      return this.tanggalAkhir
        ? this.$moment(this.tanggalAkhir).format("DD/MM/YYYY")
        : "";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getDataKaryawan();
    this.getDataKantor();
    this.initialize();
  },

  methods: {
    setenddate() {
      this.menuMulai = false;
      this.minDateEnd = this.tanggalMulai;
      if (this.tanggalMulai > this.tanggalAkhir) {
        this.tanggalAkhir = this.tanggalMulai;
      }
    },
    async initialize() {
      const { data } = await this.$axios.get("/master/penugasan-sekretaris");
      this.rows = data.data;
      this.datemulai = this.$moment(this.tanggalMulai).format("DD/MM/YYYY");
      this.dateakhir = this.$moment(this.tanggalAkhir).format("DD/MM/YYYY");
    },

    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.tanggalMulai =
        this.$moment(item.tglMulai).format("YYYY-MM-DD") === "Invalid date"
          ? null
          : this.$moment(item.tglMulai).format("YYYY-MM-DD");
      this.tanggalAkhir =
        this.$moment(item.tglAkhir).format("YYYY-MM-DD") === "Invalid date"
          ? null
          : this.$moment(item.tglAkhir).format("YYYY-MM-DD");
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    getDataKaryawan: async function () {
      const { data } = await this.$axios.get("/hcis/karyawan");
      const dataFilterSekretaris = data.data.filter((pilot) =>
        pilot.namaJobtitle.includes("Sekretaris")
      );
      this.dataKaryawan = dataFilterSekretaris;
    },

    getDataKantor: async function () {
      const { data } = await this.$axios.get("/unit-kerja");
      this.dataKantor = data.data;
    },

    close() {
      this.dialogDelete = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {});
        this.$refs.form.reset();
        this.editedIndex = -1;
      });
    },

    mappingForm: async function () {
      let data = this.dataKaryawan.find(
        (item) => item.val === this.editedItem.npk
      );
      this.editedItem.unitKantor = data.unitKantor;
      this.editedItem.namaJobtitle = data.namaJobtitle;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {});
        this.editedIndex = -1;
      });
    },

    save: async function () {
      if (this.editedIndex > -1) {
        await this.updateData();
      } else {
        await this.addData();
      }
    },
    addData: async function () {
      try {
        if (this.$refs.form.validate()) {
          this.overlay = true;
          let datafilter = this.dataKaryawan.find(
            (item) => item.val === this.editedItem.npk
          );

          var params = {
            npk: datafilter.val,
            namaPegawai: datafilter.name,
            namaJobtitle: this.editedItem.namaJobtitle,
            unitKantor: this.editedItem.unitKantor,
            tanggalMulai: this.tanggalMulai,
            tanggalAkhir: this.tanggalAkhir,
            petugasRekam: this.kodeUser,
          };
          console.log(params);
          let { data } = await this.$axios.post(
            "/master/penugasan-sekretaris",
            params
          );
          this.result = data;
          console.log(this.result);
          if (this.result.ret == 0) {
            this.$swal("", "Data berhasil ditambahkan", "success");
            this.close();
            this.initialize();
            this.overlay = false;
          } else {
            this.overlay = false;
            this.close();
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
          const id = this.editedItem.id;
          console.log(id);
          let datafilter = this.dataKaryawan.find(
            (item) => item.val === this.editedItem.npk
          );

          var params = {
            npk: datafilter.val,
            namaPegawai: datafilter.name,
            namaJobtitle: this.editedItem.namaJobtitle,
            unitKantor: this.editedItem.unitKantor,
            tanggalMulai: this.tanggalMulai,
            tanggalAkhir: this.tanggalAkhir,
            petugasUbah: this.kodeUser,
          };
          console.log(params);
          let { data } = await this.$axios.put(
            "/master/penugasan-sekretaris/" + id,
            params
          );
          this.result = data;
          console.log(this.result);
          if (this.result.ret == 0) {
            this.close();
            this.initialize();
            this.overlay = false;
            this.$swal("", "Data berhasil di-update", "success");
          } else {
            this.overlay = false;
            this.close();
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
        const id = this.editedItem.id;
        let { data } = await this.$axios.delete(
          "/master/penugasan-sekretaris/" + id + "/" + this.kodeUser
        );
        this.result = data;
        console.log(this.result);
        if (this.result.ret == 0) {
          this.closeDelete();
          this.initialize();
          this.overlay = false;
          this.$swal("", "Data berhasil dihapus", "success");
        } else {
          this.overlay = false;
          this.closeDelete();
          this.$swal("", "Data gagal dihapus", "error");
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
        this.closeDelete();
      }
    },
  },
};
</script>