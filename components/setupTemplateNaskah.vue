<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-2" style="font-size: unset">
        SETUP / TEMPLATE NASKAH
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mr-2 mb-2" v-bind="attrs" v-on="on" @click="getData">
              mdi-refresh
            </v-icon>
          </template>
          <span>Refresh</span>
        </v-tooltip>
        <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
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
                        v-model="editedItem.kodeJenisNaskah"
                        :items="jenisNaskah"
                        label="Jenis Naskah*"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="editedItem.namaAtribut"
                        label="Nama Atribut*"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      :md="
                        editedItem.objType === 'SELECT' ||
                        editedItem.objType === 'SELECT-MULTIPLE'
                          ? 3
                          : 4
                      "
                    >
                      <v-select
                        v-model="editedItem.objType"
                        :items="objType"
                        label="Object Type*"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      :md="3"
                      v-if="
                        editedItem.objType === 'SELECT' ||
                        editedItem.objType === 'SELECT-MULTIPLE'
                      "
                    >
                      <v-select
                        v-model="editedItem.objFunction"
                        :items="objFunction"
                        label="Select Data Function*"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      :md="
                        editedItem.objType === 'SELECT' ||
                        editedItem.objType === 'SELECT-MULTIPLE'
                          ? 3
                          : 4
                      "
                    >
                      <v-text-field
                        v-model="editedItem.objLengthMin"
                        label="Object Length Min*"
                        v-mask="'##'"
                        min="10"
                        max="99"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      :md="
                        editedItem.objType === 'SELECT' ||
                        editedItem.objType === 'SELECT-MULTIPLE'
                          ? 3
                          : 4
                      "
                    >
                      <v-text-field
                        v-model="editedItem.objLengthMax"
                        label="Object Length Max*"
                        v-mask="'######'"
                        min="0"
                        max="999999"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.objLabel"
                        label="Object Label*"
                        :rules="rules.required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.objModel"
                        label="Object Model*"
                        :rules="rules.model"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.objPlaceholder"
                        label="Object Placeholder"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.objHint"
                        label="Object Hint"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-select
                        v-model="editedItem.objTl"
                        :items="objTl"
                        label="Object TL"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.keterangan"
                        label="Keterangan"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-checkbox
                        v-model="editedItem.objRequired"
                        label="Object Required"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-checkbox
                        v-model="editedItem.objFeatured"
                        label="Object Featured"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-checkbox
                        v-model="editedItem.objReadonly"
                        label="Object Readonly"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-checkbox
                        v-model="editedItem.objDisabled"
                        label="Object Disabled"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-checkbox
                        v-model="editedItem.objHidden"
                        label="Object Hidden"
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
                v-model="kodeJenisNaskah"
                :items="jenisNaskahSearch"
                label="Jenis Naskah"
                hide-details
                @change="getData"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.objRequired="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objRequired === 'Y'"
          >
            mdi-check
          </v-icon>
          <v-icon small color="error" class="mr-2" v-else> mdi-close </v-icon>
        </template>
        <template v-slot:item.objFeatured="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objFeatured === 'Y'"
          >
            mdi-check
          </v-icon>
          <v-icon small color="error" class="mr-2" v-else> mdi-close </v-icon>
        </template>
        <template v-slot:item.objReadonly="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objReadonly === 'Y'"
          >
            mdi-check
          </v-icon>
          <v-icon small color="error" class="mr-2" v-else> mdi-close </v-icon>
        </template>
        <template v-slot:item.objDisabled="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objDisabled === 'Y'"
          >
            mdi-check
          </v-icon>
          <v-icon small color="error" class="mr-2" v-else> mdi-close </v-icon>
        </template>
        <template v-slot:item.objHidden="{ item }">
          <v-icon
            small
            color="success"
            class="mr-2"
            v-if="item.objHidden === 'Y'"
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
      { text: "Kode", align: "start", value: "kodeAtribut", sortable: false },
      { text: "Type", align: "start", value: "objType", sortable: false },
      // {
      //   text: "Type Input",
      //   align: "start",
      //   value: "objTypeInput",
      //   sortable: false,
      // },
      {
        text: "Length Min",
        align: "start",
        value: "objLengthMin",
        sortable: false,
      },
      {
        text: "Length Max",
        align: "start",
        value: "objLengthMax",
        sortable: false,
      },
      {
        text: "Required",
        align: "center",
        value: "objRequired",
        sortable: false,
      },
      { text: "Label", align: "start", value: "objLabel", sortable: false },
      { text: "Model", align: "start", value: "objModel", sortable: false },
      {
        text: "Placeholder",
        align: "start",
        value: "objPlaceholder",
        sortable: false,
      },
      {
        text: "Featured",
        align: "center",
        value: "objFeatured",
        sortable: false,
      },
      {
        text: "Readonly",
        align: "center",
        value: "objReadonly",
        sortable: false,
      },
      {
        text: "Disabled",
        align: "center",
        value: "objDisabled",
        sortable: false,
      },
      {
        text: "Hidden",
        align: "center",
        value: "objHidden",
        sortable: false,
      },
      { text: "Hint", align: "start", value: "objHint", sortable: false },
      {
        text: "Tindak Lanjut",
        align: "start",
        value: "objTl",
        sortable: false,
      },
      { text: "Actions", align: "start", value: "actions", sortable: false },
    ],
    rows: [],
    jenisNaskahSearch: [],
    jenisNaskah: [],
    objType: [
      { value: "TEXT", text: "Text" },
      { value: "DATE", text: "Date" },
      { value: "DATETIME", text: "Datetime" },
      { value: "EMAIL", text: "Email" },
      { value: "SELECT", text: "Select" },
      { value: "SELECT-MULTIPLE", text: "Select Multiple" },
    ],
    objTl: [],
    objFunction: [
      { value: "KODEKARYAWAN", text: "Kode Karyawan" },
      { value: "KODEKANTOR", text: "Kode Kantor" },
      { value: "KODEJABATAN", text: "Kode Jabatan" },
      { value: "KODEKLASIFIKASI", text: "Kode Klasifikasi" },
    ],
    objTypeInput: [
      { value: "DATE", text: "Date" },
      { value: "NUMBER", text: "Number" },
      { value: "TEXT", text: "Text" },
      { value: "LOV", text: "Lov" },
      { value: "FILE", text: "File" },
      { value: "PDF", text: "Pdf" },
    ],
    editedIndex: -1,
    editedItem: {
      vKodeJenisNaskah: "",
      kodeJenisNaskah: "",
      kodeAtribut: "",
      namaAtribut: "",
      objType: "",
      objLengthMax: "",
      objRequired: "",
      objTypeInput: "",
      objFunction: "",
      objLabel: "",
      objModel: "",
      objLengthMin: "",
      objPlaceholder: "",
      objFeatured: "",
      objReadonly: "",
      objDisabled: "",
      objHint: "",
      keterangan: "",
      objHidden: "",
      objTl: "",
    },
    defaultItem: {
      vKodeJenisNaskah: "",
      kodeJenisNaskah: "",
      kodeAtribut: "",
      namaAtribut: "",
      objType: "",
      objLengthMax: "",
      objRequired: "",
      objTypeInput: "",
      objFunction: "",
      objLabel: "",
      objModel: "",
      objLengthMin: "",
      objPlaceholder: "",
      objFeatured: "",
      objReadonly: "",
      objDisabled: "",
      objHint: "",
      keterangan: "",
      objHidden: "",
      objTl: "",
    },
    kodeJenisNaskah: "",
    valid: false,
    isLoading: false,
    search: "",
    overlay: false,
    kodeUser: "",
    rules: {
      required: [(v) => !!v || "Field is required"],
      model: [
        (v) =>
          !v ? "Field is required" : /^\S[A-z]+$/.test(v) || "Only letters",
      ],
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Atribut" : "Edit Atribut";
    },
  },

  watch: {
    editedItem: {
      deep: true,
      handler(val) {
        if (val.objType !== "SELECT" && val.objType !== "SELECT-MULTIPLE") {
          // console.log(val.objType);
          this.editedItem.objFunction = "";
        }
      },
    },
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getData();
    this.getNaskahJenis();
    this.getMasterNaskahTl();

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
          "/master/naskah-atribut?kodeJenisNaskah=" + this.kodeJenisNaskah || ""
        )
        .then((response) => {
          console.log("tess", response.data);
          this.rows = [];
          if (response.data.ret === "0" && response.data.data) {
            response.data.data.forEach((item) => {
              this.rows.push(item);
            });
          } else {
            this.rows = [];
          }

          this.getNaskahJenis();
          this.isLoading = false;
        })
        .catch((error) => {
          this.rows = [];
          this.isLoading = false;
          console.error(error);
        });
    },
    async getNaskahJenis() {
      await this.$axios
        .get("/master/naskah-jenis")
        .then((response) => {
          this.jenisNaskah = [];
          this.jenisNaskahSearch = [];
          if (response.data.ret === "0" && response.data.data.length > 0) {
            this.jenisNaskahSearch.push({
              value: "",
              text: "ALL",
            });
            response.data.data.forEach((item) => {
              this.jenisNaskahSearch.push({
                value: item.kodeJenisNaskah,
                text: item.namaJenisNaskah,
              });
              this.jenisNaskah.push({
                value: item.kodeJenisNaskah,
                text: item.namaJenisNaskah,
              });
            });
          } else {
            this.jenisNaskah = [];
            this.jenisNaskahSearch = [];
          }
        })
        .catch((error) => {
          this.jenisNaskah = [];
          this.jenisNaskahSearch = [];
          console.error(error);
        });
    },
    async getMasterNaskahTl() {
      await this.$axios
        .get("/master/naskah-tl")
        .then((response) => {
          this.objTl = [];
          if (response.data.ret === "0" && response.data.data.length > 0) {
            this.objTl.push({
              value: null,
              text: "-",
            });
            response.data.data.forEach((item) => {
              this.objTl.push({
                value: item.kodeTl,
                text: item.namaTl,
              });
            });
          } else {
            this.objTl = [];
          }
        })
        .catch((error) => {
          this.objTl = [];
          console.error(error);
        });
    },
    async editItem(item) {
      this.overlay = true;
      this.editedIndex = item.id; //this.rows.indexOf(item);
      await this.$axios
        .get("/master/naskah-atribut/" + item.id)
        .then((response) => {
          if (response.data.ret === "0" && response.data.data) {
            this.overlay = false;
            // console.log(response.data.data[0]);
            this.editedItem.vKodeJenisNaskah =
              response.data.data[0].vKodeJenisNaskah;
            this.editedItem.kodeJenisNaskah =
              (this.jenisNaskah.some(
                (e) => e.value === response.data.data[0].kodeJenisNaskah
              ) &&
                response.data.data[0].kodeJenisNaskah) ||
              "";
            this.editedItem.kodeAtribut = response.data.data[0].kodeAtribut;
            this.editedItem.namaAtribut = response.data.data[0].namaAtribut;
            this.editedItem.objType =
              (this.objType.some(
                (e) => e.value === response.data.data[0].objType
              ) &&
                response.data.data[0].objType) ||
              "";
            this.editedItem.objFunction =
              (this.objFunction.some(
                (e) => e.value === response.data.data[0].objFunction
              ) &&
                response.data.data[0].objFunction) ||
              "";
            this.editedItem.objLengthMax = response.data.data[0].objLengthMax;
            this.editedItem.objRequired =
              response.data.data[0].objRequired === "Y" ? true : false;
            this.editedItem.objTypeInput =
              (this.objTypeInput.some(
                (e) => e.value === response.data.data[0].objTypeInput
              ) &&
                response.data.data[0].objTypeInput) ||
              "";
            this.editedItem.objTl =
              (this.objTl.some(
                (e) => e.value === response.data.data[0].objTl
              ) &&
                response.data.data[0].objTl) ||
              "";
            this.editedItem.objLabel = response.data.data[0].objLabel;
            this.editedItem.objModel = response.data.data[0].objModel;
            this.editedItem.objLengthMin = response.data.data[0].objLengthMin;
            this.editedItem.objPlaceholder =
              response.data.data[0].objPlaceholder;
            this.editedItem.objFeatured =
              response.data.data[0].objFeatured === "Y" ? true : false;
            this.editedItem.objReadonly =
              response.data.data[0].objReadonly === "Y" ? true : false;
            this.editedItem.objDisabled =
              response.data.data[0].objDisabled === "Y" ? true : false;
            this.editedItem.objHidden =
              response.data.data[0].objHidden === "Y" ? true : false;
            this.editedItem.objHint = response.data.data[0].objHint;
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
            url: "/master/naskah-atribut/" + item.id,
            data: { petugas: this.kodeUser },
          })
            .then((res) => {
              // console.log(res.data);
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
        // console.log(this.editedItem);
        // console.log("this.kodeUser", this.kodeUser);
        this.updateData();
      } else {
        // console.log(this.editedItem);
        // console.log("this.kodeUser", this.kodeUser);
        this.submitData();
      }
    },
    async submitData() {
      this.overlay = true;
      await this.$axios
        .post("/master/naskah-atribut", {
          kodeJenisNaskah: this.editedItem.kodeJenisNaskah,
          namaAtribut: this.editedItem.namaAtribut,
          objType: this.editedItem.objType,
          objFunction: this.editedItem.objFunction || "",
          objLengthMax: this.editedItem.objLengthMax,
          objRequired: this.editedItem.objRequired === true ? "Y" : "T",
          objTypeInput: this.editedItem.objTypeInput,
          objLabel: this.editedItem.objLabel,
          objModel: this.editedItem.objModel,
          objLengthMin: this.editedItem.objLengthMin,
          objPlaceholder: this.editedItem.objPlaceholder,
          objFeatured: this.editedItem.objFeatured === true ? "Y" : "T",
          objReadonly: this.editedItem.objReadonly === true ? "Y" : "T",
          objDisabled: this.editedItem.objDisabled === true ? "Y" : "T",
          objHidden: this.editedItem.objHidden === true ? "Y" : "T",
          objHint: this.editedItem.objHint,
          objTl: this.editedItem.objTl || "",
          keterangan: this.editedItem.keterangan,
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Atribut berhasil ditambahkan", "success");
            this.kodeJenisNaskah = this.editedItem.kodeJenisNaskah;
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
        .put("/master/naskah-atribut/" + this.editedIndex, {
          kodeJenisNaskah: this.editedItem.kodeJenisNaskah,
          namaAtribut: this.editedItem.namaAtribut,
          objType: this.editedItem.objType,
          objFunction: this.editedItem.objFunction || "",
          objLengthMax: this.editedItem.objLengthMax,
          objRequired: this.editedItem.objRequired === true ? "Y" : "T",
          objTypeInput: this.editedItem.objTypeInput,
          objLabel: this.editedItem.objLabel,
          objModel: this.editedItem.objModel,
          objLengthMin: this.editedItem.objLengthMin,
          objPlaceholder: this.editedItem.objPlaceholder,
          objFeatured: this.editedItem.objFeatured === true ? "Y" : "T",
          objReadonly: this.editedItem.objReadonly === true ? "Y" : "T",
          objDisabled: this.editedItem.objDisabled === true ? "Y" : "T",
          objHidden: this.editedItem.objHidden === true ? "Y" : "T",
          objHint: this.editedItem.objHint,
          objTl: this.editedItem.objTl || "",
          keterangan: this.editedItem.keterangan,
          petugas: this.kodeUser,
        })
        .then((response) => {
          // handle success
          if (response.data.ret === "0") {
            this.overlay = false;
            this.$swal("", "Data Atribut berhasil diubah", "success");
            this.kodeJenisNaskah = this.editedItem.kodeJenisNaskah;
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
