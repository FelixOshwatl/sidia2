<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-2" style="font-size: unset">
        SETUP / JENIS NASKAH
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mr-2 mb-2" v-bind="attrs" v-on="on" @click="getData">
              mdi-refresh
            </v-icon>
          </template>
          <span>Refresh</span>
        </v-tooltip>
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.naskahInisial"
                        label="Inisial"
                        :rules="rules.inisial"
                        @input="checkInisial"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="editedItem.namaJenisNaskah"
                        label="Nama"
                        :rules="rules.required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-select
                        v-model="editedItem.font"
                        :items="[{ value: 'ARIAL', text: 'ARIAL' }]"
                        label="Font"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        type="number"
                        min="11"
                        max="20"
                        v-model="editedItem.fontSize"
                        label="Font Size"
                        :rules="rules.required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.keterangan"
                        box
                        label="Keterangan"
                        rows="4"
                        :rules="rules.required"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

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
        :headers="headers"
        :items="rows"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        no-data-text="Tidak ada data jenis naskah"
        no-results-text="Pencarian data jenis naskah tidak ditemukan"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-row no-gutters align="end">
            <v-spacer />
          </v-row>
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
export default {
  data: () => ({
    isLoading: false,
    overlay: false,
    dialog: false,
    headers: [
      { text: "Kode", value: "kodeJenisNaskah" },
      { text: "Inisial", value: "naskahInisial" },
      { text: "Nama", value: "namaJenisNaskah" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rows: [],
    editedIndex: -1,
    editedItem: {
      naskahInisial: "",
      namaJenisNaskah: "",
      font: 11,
      fontSize: "",
      keterangan: "",
    },
    defaultItem: {
      naskahInisial: "",
      namaJenisNaskah: "",
      font: 11,
      fontSize: "",
      keterangan: "",
    },
    valid: false,
    rules: {
      required: [(v) => !!v || "Field is required"],
      inisial: [
        (v) =>
          !v
            ? "Field is required"
            : /^\S[A-Z]+$/.test(v) || "Only uppercase letters (min 2)",
      ],
    },
    kodeUser: "",
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
    this.getData();
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
    checkInisial() {
      if (
        this.rows.some(
          (x) =>
            x.naskahInisial === this.editedItem.naskahInisial &&
            x.id !== this.editedIndex
        )
      ) {
        this.rules.inisial = ["Inisial sudah digunakan"];
      } else {
        this.rules.inisial = [
          (v) =>
            !v
              ? "Field is required"
              : /^\S[A-Z]+$/.test(v) || "Only uppercase letters (min 2)",
        ];
      }
    },
    async getData() {
      this.isLoading = true;
      await this.$axios
        .get("/master/naskah-jenis")
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
    async editItem(item) {
      this.overlay = true;
      this.editedIndex = item.id; //this.rows.indexOf(item);
      await this.$axios
        .get("/master/naskah-jenis/" + item.id)
        .then((response) => {
          if (response.data.ret === "0" && response.data.data) {
            this.overlay = false;
            console.log(response.data.data[0]);
            this.editedItem.naskahInisial = response.data.data[0].naskahInisial;
            this.editedItem.namaJenisNaskah =
              response.data.data[0].namaJenisNaskah;
            this.editedItem.font = response.data.data[0].font;
            this.editedItem.fontSize = response.data.data[0].fontSize;
            this.editedItem.keterangan = response.data.data[0].keterangan;
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
            url: "/master/naskah-jenis/" + item.id,
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
        .post("/master/naskah-jenis", {
          namaJenisNaskah: this.editedItem.namaJenisNaskah,
          naskahInisial: this.editedItem.naskahInisial,
          font: this.editedItem.font,
          fontSize: this.editedItem.fontSize,
          keterangan: this.editedItem.keterangan,
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Jenis Naskah berhasil ditambahkan", "success");
            this.close();
            this.getData();
          } else {
            this.overlay = false;
            this.$swal("", "Data Jenis Naskah gagal ditambahkan", "error");
          }
        })
        .catch((err) => {
          // handle error
          this.overlay = false;
          this.$swal(
            "Galat",
            "Proses tambah data jenis naskah gagal!",
            "error"
          );
          console.log(err);
        });
    },
    async updateData() {
      this.overlay = true;
      await this.$axios
        .put("/master/naskah-jenis/" + this.editedIndex, {
          namaJenisNaskah: this.editedItem.namaJenisNaskah,
          naskahInisial: this.editedItem.naskahInisial,
          font: this.editedItem.font,
          fontSize: this.editedItem.fontSize,
          keterangan: this.editedItem.keterangan,
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Jenis Naskah berhasil diubah", "success");
            this.close();
            this.getData();
          } else {
            this.overlay = false;
            this.$swal("", "Data Jenis Naskah gagal diubah", "error");
          }
        })
        .catch((err) => {
          // handle error
          this.overlay = false;
          this.$swal(
            "Galat",
            "Proses tambah data jenis naskah gagal!",
            "error"
          );
          console.log(err);
        });
    },
  },
};
</script>