<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-2" style="font-size: unset">
        SETUP / ATRIBUT ARSIP
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mr-2 mb-2" v-bind="attrs" v-on="on" @click="getData">
              mdi-refresh
            </v-icon>
          </template>
          <span>Refresh</span>
        </v-tooltip>
        <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="success" v-bind="attrs" v-on="on">New Atribut</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text class="pt-6">
              <v-container>
                <v-form ref="form" v-model="valid" :lazy-validation="false">
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <v-select
                        v-model="editedItem.kodeJenisArsip"
                        :items="jenisArsip"
                        label="Jenis Arsip"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="editedItem.namaAtribut"
                        label="Nama Atribut"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.keterangan"
                        label="Keterangan"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="editedItem.objectType"
                        :items="objectType"
                        label="Object Type"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.objectLength"
                        label="Object Length"
                        v-mask="'####'"
                        min="0"
                        max="9999"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-checkbox
                        v-model="editedItem.objectRequired"
                        label="Object Required"
                        dense
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="success" @click="save" :disabled="!valid"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table
        dense
        :search="search"
        :headers="headers"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        no-data-text="Tidak ada data atribut"
        no-results-text="Pencarian data atribut tidak ditemukan"
        :items="rows"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-row no-gutters align="end">
            <v-spacer />
            <v-col cols="12" sm="6" md="4" class="pa-2">
              <v-select
                v-model="kodeJenisArsip"
                :items="jenisArsipSearch"
                label="Jenis Arsip"
                hide-details
                @change="getData"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.objectRequired="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objectRequired === 'Y'"
          >
            mdi-check
          </v-icon>
          <v-icon small color="error" class="mr-2" v-else> mdi-close </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
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
              <v-icon small v-bind="attrs" v-on="on" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <v-btn text color="default" @click="getData">Reset</v-btn>
        </template>
      </v-data-table>
    </v-card>

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
import helper from "@/helpers/index";
import Vue from "vue";
import VueMask from "v-mask";
Vue.use(VueMask);

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Nama Atribut",
        align: "start",
        value: "namaAtribut",
        sortable: false,
      },
      {
        text: "Keterangan",
        align: "start",
        value: "keterangan",
        sortable: false,
      },
      { text: "Type", align: "start", value: "objectType", sortable: false },
      {
        text: "Length",
        align: "center",
        value: "objectLength",
        sortable: false,
      },
      {
        text: "Required",
        align: "center",
        value: "objectRequired",
        sortable: false,
      },
      { text: "Actions", align: "start", value: "actions", sortable: false },
    ],
    rows: [],
    jenisArsipSearch: [],
    jenisArsip: [],
    objectType: [
      // { value: "button", text: "button" },
      // { value: "checkbox", text: "checkbox" },
      // { value: "color", text: "color" },
      { value: "DATE", text: "Date" },
      // { value: "datetime-local", text: "datetime-local" },
      // { value: "email", text: "email" },
      // { value: "file", text: "file" },
      // { value: "hidden", text: "hidden" },
      // { value: "image", text: "image" },
      // { value: "month", text: "month" },
      { value: "NUMBER", text: "Number" },
      // { value: "password", text: "password" },
      // { value: "radio", text: "radio" },
      // { value: "range", text: "range" },
      // { value: "reset", text: "reset" },
      // { value: "search", text: "search" },
      // { value: "submit", text: "submit" },
      // { value: "tel", text: "tel" },
      { value: "TEXT", text: "Text" },
      // { value: "time", text: "time" },
      // { value: "url", text: "url" },
      // { value: "week", text: "week" },
    ],
    editedIndex: -1,
    editedItem: {
      vKodeJenisArsip: "1",
      kodeJenisArsip: "",
      kodeAtribut: "",
      namaAtribut: "",
      keterangan: "",
      objectType: "",
      objectLength: "",
      objectRequired: "",
    },
    defaultItem: {
      vKodeJenisArsip: "1",
      kodeJenisArsip: "",
      kodeAtribut: "",
      namaAtribut: "",
      keterangan: "",
      objectType: "",
      objectLength: "",
      objectRequired: "",
    },
    kodeJenisArsip: "",
    valid: false,
    isLoading: false,
    search: "",
    overlay: false,
    kodeUser: "",
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Atribut" : "Edit Atribut";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getData();
    this.getArsipJenis();

    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        // this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        // this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = dataUser.kodeUser;
      }
    } else {
      // this.$router.push({ path: "/login" });
    }
  },

  methods: {
    async getData() {
      this.isLoading = true;
      await this.$axios
        .get(
          "/master/arsip-atribut?kodeJenisArsip=" + this.kodeJenisArsip || ""
        )
        .then((response) => {
          this.rows = [];
          if (response.data.ret === "0" && response.data.data) {
            response.data.data.forEach((item) => {
              this.rows.push(item);
            });
          } else {
            this.rows = [];
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.rows = [];
          this.isLoading = false;
          console.error(error);
        });
    },
    async getArsipJenis() {
      await this.$axios
        .get("/master/arsip-jenis")
        .then((response) => {
          this.jenisArsip = [];
          if (response.data.ret === "0" && response.data.data.length > 0) {
            this.jenisArsipSearch.push({
              value: "",
              text: "ALL",
            });
            response.data.data.forEach((item) => {
              this.jenisArsipSearch.push({
                value: item.kodeJenisArsip,
                text: item.namaJenisArsip,
              });
              this.jenisArsip.push({
                value: item.kodeJenisArsip,
                text: item.namaJenisArsip,
              });
            });
          } else {
            this.jenisArsip = [];
          }
        })
        .catch((error) => {
          this.jenisArsip = [];
          console.error(error);
        });
    },
    async editItem(item) {
      this.overlay = true;
      this.editedIndex = item.id; //this.rows.indexOf(item);
      await this.$axios
        .get("/master/arsip-atribut/" + item.id)
        .then((response) => {
          if (response.data.ret === "0" && response.data.data) {
            this.overlay = false;
            console.log(response.data.data[0]);
            this.editedItem.vKodeJenisArsip =
              response.data.data[0].vKodeJenisArsip;
            this.editedItem.kodeJenisArsip =
              (this.jenisArsip.some(
                (e) => e.value === response.data.data[0].kodeJenisArsip
              ) &&
                response.data.data[0].kodeJenisArsip) ||
              "";
            this.editedItem.kodeAtribut = response.data.data[0].kodeAtribut;
            this.editedItem.namaAtribut = response.data.data[0].namaAtribut;
            this.editedItem.keterangan = response.data.data[0].keterangan;
            this.editedItem.objectType =
              (this.objectType.some(
                (e) => e.value === response.data.data[0].objectType
              ) &&
                response.data.data[0].objectType) ||
              "";
            this.editedItem.objectLength =
              response.data.data[0].objectLength || 0;
            this.editedItem.objectRequired =
              response.data.data[0].objectRequired === "1" ? true : false;
            // this.editedItem = Object.assign({}, response.data.data[0]);
            this.dialog = true;
          } else {
            this.overlay = false;
            this.$swal("", "Data tidak ditemukan", "error");
          }
        })
        .catch((error) => {
          this.overlay = false;
          this.$swal("Galat", "Proses edit data gagal!", "error");
          console.error(error);
        });
    },

    deleteItem(item) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.overlay = true;
          await this.$axios({
            method: "delete",
            url: "/master/arsip-atribut/" + item.id,
            data: { petugas: this.kodeUser },
          })
            .then((res) => {
              console.log(res.data);
              if (res.data.ret === "0") {
                // handle success
                this.overlay = false;
                this.$swal("", "Data berhasil dihapus", "success");
                this.getData();
              } else {
                this.overlay = false;
                this.$swal("", "Data gagal dihapus", "error");
                this.getData();
              }
            })
            .catch((err) => {
              // handle error
              this.overlay = false;
              this.$swal("Galat", "Proses hapus data gagal!", "error");
              console.error(error);
            });
        }
      });
    },

    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        console.log(this.editedItem);
        console.log("this.kodeUser", this.kodeUser);
        this.updateData();
      } else {
        console.log(this.editedItem);
        console.log("this.kodeUser", this.kodeUser);
        this.submitData();
      }
    },
    async submitData() {
      this.overlay = true;
      await this.$axios
        .post("/master/arsip-atribut", {
          vKodeJenisArsip: "1",
          kodeJenisArsip: this.editedItem.kodeJenisArsip,
          kodeAtribut: "",
          namaAtribut: this.editedItem.namaAtribut,
          keterangan: this.editedItem.keterangan,
          objectType: this.editedItem.objectType,
          objectLength: this.editedItem.objectLength,
          objectRequired: this.editedItem.objectRequired === true ? "1" : "0",
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Atribut berhasil ditambahkan", "success");
            this.kodeJenisArsip = this.editedItem.kodeJenisArsip;
            this.close();
            this.getData();
          } else {
            this.overlay = false;
            this.$swal("", "Data Atribut gagal ditambahkan", "error");
          }
        })
        .catch((err) => {
          // handle error
          this.overlay = false;
          this.$swal("Galat", "Proses tambah data atribut gagal!", "error");
          console.log(err);
        });
    },
    async updateData() {
      this.overlay = true;
      await this.$axios
        .put("/master/arsip-atribut/" + this.editedIndex, {
          vKodeJenisArsip: this.editedItem.vKodeJenisArsip,
          kodeJenisArsip: this.editedItem.kodeJenisArsip,
          kodeAtribut: this.editedItem.kodeAtribut,
          namaAtribut: this.editedItem.namaAtribut,
          keterangan: this.editedItem.keterangan,
          objectType: this.editedItem.objectType,
          objectLength: this.editedItem.objectLength,
          objectRequired: this.editedItem.objectRequired === true ? "1" : "0",
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Atribut berhasil diubah", "success");
            this.kodeJenisArsip = this.editedItem.kodeJenisArsip;
            this.close();
            this.getData();
          } else {
            this.overlay = false;
            this.$swal("", "Data Atribut gagal diubah", "error");
          }
        })
        .catch((err) => {
          // handle error
          this.overlay = false;
          this.$swal("Galat", "Proses tambah data atribut gagal!", "error");
          console.log(err);
        });
    },
  },
};
</script>