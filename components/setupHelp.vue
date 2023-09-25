<template>
  <v-data-table
    dense
    :headers="headers"
    :items="rows"
    :options.sync="options"
    :hide-default-footer="false"
    :footer-props="{ 'items-per-page-options': [15, 50, 100] }"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="750px" persistent>
        <template v-slot:activator="{ on, attrs }"> </template>
        <v-card>
          <v-card-title>
            <span class="headline">Entry Content FAQ</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" :lazy-validation="false">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="entryItem.namaKonten"
                      label="Judul Konten"
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="1" md="12">
                    <v-select
                      v-model="entryItem.jenisKonten"
                      :rules="rules.required"
                      :disabled="!readOnly"
                      :items="[
                        {
                          value: '1',
                          text: 'Gambar',
                        },
                        {
                          value: '2',
                          text: 'Video',
                        },
                        { value: '3', text: 'File PDDF' },
                      ]"
                      @change="getFormTipeKonten()"
                      label="Tipe Konten"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-tabs v-model="tab" left @change="getTabIndex">
                  <v-tab>Input</v-tab>
                  <!-- <v-tab>Upload </v-tab> -->
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item key="input" class="2">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="entryItem.fileKonten"
                          label="Link/Url"
                          :rules="[
                            (v) => (!!v && tab == 0) || 'Field is required',
                          ]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item key="upload" class="2"
                    ><v-file-input
                      v-model="entryItem.fileKonten"
                      label="File input"
                      :rules="[(v) => (!!v && tab == 1) || 'Field is required']"
                    ></v-file-input>
                  </v-tab-item>
                </v-tabs-items>
                <v-textarea
                  v-model="entryItem.deskripsiKontent"
                  label="Deskripsi Konten"
                  auto-grow
                ></v-textarea>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
            <v-btn
              color="green darken-1"
              @click="save"
              v-text="entryItem.kontentId == '' ? 'Simpan' : 'Perbarui'"
            />
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
      <v-dialog v-model="dialogCutoffDetil" max-width="1000px">
        <template>
          <v-card text dark style="background: #eee; color: #000">
            <v-card-title>
              <span class="headline">{{ formTitleCutOff }}</span>
            </v-card-title>
          </v-card>
          <v-data-table
            dense
            :headers="headersCutOffDetil"
            :items="rows1"
            class="elevation-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <!-- <td>{{ index + 1 }}</td> -->
                <td>{{ item.noNaskah }}</td>
                <td>{{ item.kodeJenisNaskah }}</td>
                <td>{{ $moment(item.tglNaskah).format("DD/MM/YYYY") }}</td>
              </tr>
            </template>
          </v-data-table>
          <v-card>
            <v-card-actions>
              <v-btn color="red darken-1" text @click="closeCutOffDetil"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      <v-row no-gutters>
        <v-col cols="12" sm="12" md="12" lg="8" class="text-right d-flex">
          <v-btn
            color="success"
            @click="formHelpEntry"
            :disabled="isDisabled"
            outlined
            clearable
            rounded
            class="pa-md-4 lighten-4 mx-4 mt-2"
            dense
            >New Entry</v-btn
          >
        </v-col>
        <v-col lg="4" class="text-right">
          <!-- <v-text-field
            v-model="filter.keyword"
            type="text"
            outlined
            rounded
            class="pa-1"
            placeholder="Search"
            v-on:keyup.enter="doSearchFilter()"
            dense
          >
          </v-text-field> -->
        </v-col>
      </v-row>
    </template>
    <template v-slot:item="{ item, index }">
      <tr>
        <td>{{ index + 1 }}</td>
        <td>{{ item.contentTitle }}</td>
        <td>
          {{
            item.contentType == 1
              ? "IMG"
              : item.contentType == 2
              ? "VIDEO"
              : "PDF FILE"
          }}
        </td>
        <td>{{ item.content }}</td>
        <td>{{ item.contentDesc }}</td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="viewItem(item.contentId)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>edit</span>
          </v-tooltip>
          <!-- <v-tooltip bottom>
                <template  v-slot:activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
              </template>
                  <span>Edit</span>
              </v-tooltip> -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-bind="attrs"
                v-on="on"
                @click="deleteItem(item)"
                :disabled="isDisabled"
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
      <v-btn text color="default" @click="doResetFilter">Reload</v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.v-application .elevation-1 {
  box-shadow: 0px 0px 0px 0px !important;
}
</style>

<script>
import { VueMaskDirective } from "v-mask";

import helper from "@/helpers/index";
export default {
  data: () => ({
    tahun: ["2020", "2021", "2022", "2023", "2024", "2025"],
    dialog: false,
    tab: 0,
    dialogDelete: false,
    dialogCutoffDetil: false,
    headers: [
      { text: "No.", value: "noIndex" },
      { text: "Judul Konten", value: "contentTitle" },
      { text: "Tipe Konten", value: "contentType" },
      { text: "Link/Url", value: "content" },
      { text: "Deskripsi", value: "contentDesc" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headersCutOffDetil: [
      // { text: "No.", value: "noIndex" },
      { text: "No Naskah", value: "NoNaskah" },
      { text: "Nama Naskah", value: "NamaNaskah" },
      { text: "Tanggal Naskah", value: "tglNaskah" },
    ],
    rows: [],
    rows1: [],
    rows2: [],
    dataKantor: [],
    viewedIndex: -1,
    editedIndex: -1,
    entryItem: {},
    noNaskahTerakhir: "",
    drNomor: "",
    smpNomor: "",
    isLoaded: false,
    dataJenisNaskah: [],
    defaultItem: {},
    valid: false,
    activePicker: null,
    year: null,
    date: null,
    menu: false,
    filter: {
      keyword: "",
    },
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
    options: {
      page: 1,
      itemsPerPage: 15,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Nomor Naskah Dinas" : "Edit Item";
    },
    formTitleCutOff() {
      // return this.viewedIndex === -1 ? "New Nomor Naskah Dinas" : "View Item";
      return this.editedIndex === -1 ? "View Nomor Naskah Dinas" : "Edit Item";
    },
    isDisabled() {
      return (
        this.entryItem.kodeKantor === "P" ||
        this.entryItem.kodeKantor === "0" ||
        this.entryItem.kodeKantor === "1" ||
        this.entryItem.kodeKantor === "2" ||
        this.entryItem.kodeKantor === "3" ||
        this.entryItem.kodeKantor === "4" ||
        this.entryItem.kodeKantor === "5" ||
        this.entryItem.kodeKantor === "6" ||
        this.entryItem.kodeKantor === "7" ||
        this.entryItem.kodeKantor === "8" ||
        this.entryItem.kodeKantor === "9" ||
        this.entryItem.kodeKantor === "10" ||
        this.entryItem.kodeKantor === "11"
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    menu(val) {
      // console.log(val && setTimeout)
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  async created() {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole;
      this.npk = this.dataUser.npk;
      // console.log("kodekantor:",this.dataUser.kodeKantorRole)
      this.getAllDataHelp();
      /*  if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!this.dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = "dataUser.kodeUser";
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          // console.log("listPage:", listPage, this.$route.path.split("/")[1])
          if (listPage.includes(this.$route.path.split("/")[1])) {
            this.getDataKantor();
          } else {
            this.$router.push({ path: "/error" });
          }
        } else {
          this.$router.push({ path: "/error" });
        }
      } */
    } else {
      this.$router.push({ path: "/login" });
    }
  },

  methods: {
    getTabIndex() {
      console.log(this.tab);
    },
    reloadPage() {
      window.location.reload();
    },
    savedate(date) {
      this.filter.date1 = date;
      this.menu = false;
      // console.log("date",this.filter.date1, date)
      // this.$refs.menu.savedate(date)
    },
    doSearchFilter() {
      // console.log("doSearchFilter", this.entryItem.kodeKantor, this.filter.kodeJenisNaskah, this.filter.tahun, this.filter.keyword)
      if (this.filter.kodeJenisNaskah != undefined) {
        const { page, itemsPerPage } = this.options;
        this.$axios
          .get("/master/naskah-cutoffallfilter", {
            params: {
              kodeKantor: this.entryItem.kodeKantor,
              kodeJenisNaskah: this.filter.kodeJenisNaskah,
              date: this.filter.tahun,
              keyword: this.filter.keyword,
            },
          })
          .then((res) => {
            // console.log("doSearchFilter-return:",res.data.data)
            this.rows = res.data.data;
          })
          .catch(() => {
            console.log("error");
          });
      } else {
        this.naskahDinasCutOff();
      }
    },
    getFormTipeKonten() {},
    doResetFilter() {
      this.filter.date1 = "";
      this.filter.namaJenisNaskah = "";
      this.filter.keyword = "";
      this.filter.kodeJenisNaskah = "";
      this.date = "";
      this.filter.tahun = "";
      this.entryItem.kodeKantor = "";
      this.rows = [];
      this.naskahDinasCutOff();
    },

    readOnly() {
      return this.viewedIndex === -1;
    },

    async naskahDinasCutOff(id) {
      // console.log("naskahDinasCutOff", id)
      if (id !== undefined) {
        this.$axios
          .get("/master/naskah-cutoffall", {
            params: {
              kodeKantor: id,
            },
          })
          .then((res) => {
            // console.log("naskahDinasCutOff-return:",res.data.data)
            this.rows = res.data.data;
            // console.log("naskahDinasCutOff", this.rows)
          })
          .catch(() => {
            console.log("error");
          });
      }
    },

    async detilFaq(id) {
      this.isLoaded = false;
      // console.log("naskahDinasCutOffDetil", this.rows)
      this.$axios
        .get("help/faq-id", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          this.isLoaded = true;
          let jdata = res.data.data;
          this.entryItem.kontentId = jdata[0].contentId;
          this.entryItem.namaKonten = jdata[0].contentTitle;
          this.entryItem.jenisKonten = jdata[0].contentType.toString();
          this.entryItem.fileKonten = jdata[0].content;
          this.entryItem.deskripsiKontent = jdata[0].contentDesc;
          this.dialog = true;
        })
        .catch(() => {
          console.log("error");
        });
    },

    viewItem(contentId) {
      this.detilFaq(contentId);
    },
    getAllDataHelp: async function () {
      console.log("getDataKantor", this.dataUser.kodeKantorRole);
      this.$axios
        .get("help/faq-all", {
          params: {},
        })
        .then((res) => {
          this.isLoaded = true;
          console.log(res.data.data);
          this.rows = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    },

    /* getDataKantor: async function () {
      // console.log("getDataKantor", this.dataUser.kodeKantorRole)
      this.$axios
        .get("/unit-kantor-konsolidasi-cutoff", {
          params: {
            kodeKantor: this.dataUser.kodeKantorRole,
          },
        })
        .then((res) => {
          console.log("data", res.data);
          this.dataKantor = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    }, */

    async getJenisNaskah(id) {
      // console.log("getJenisNaskah", id)
      this.$axios
        .get("/master/naskah-jenisCufOff", {
          params: {
            npk: this.dataUser.npk,
            kodeKantor: id,
            kodeUser: this.dataUser.kodeUser,
          },
        })
        .then((res) => {
          // console.log("getJenisNaskah-return",res.data.data)
          this.dataJenisNaskah = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    },

    close() {
      this.dialog = false;
    },

    closeCutOffDetil() {
      this.dialogCutoffDetil = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.entryItem = Object.assign({}, {});
        this.viewedIndex = -1;
        this.editedIndex = -1;
      });
    },

    mappingDataKantor() {
      console.log("this.entryItem.kodeKantor", this.entryItem.kodeKantor);
      if (this.entryItem.kodeKantor != null) {
        let data = this.dataKantor.find(
          (item) => item.kodeKantor === this.entryItem.kodeKantor
        );
        this.entryItem.namaKantor = data.namaKantor;
        let itemkodeKantor = this.entryItem.kodeKantor;

        this.getJenisNaskah(itemkodeKantor);
        this.naskahDinasCutOff(itemkodeKantor);
      } else {
        this.doResetFilter();
      }
    },

    mappingFormJenisNaskah() {
      let data1 = this.dataJenisNaskah.find(
        (item) => item.kodeJenisNaskah === this.entryItem.kodeJenisNaskah
      );
      // this.entryItem.kodeJenisNaskah = data1.kodeJenisNaskah
      this.entryItem.namaJenisNaskah = data1.namaJenisNaskah;
      this.$axios
        .get("/master/naskah-cutoffterakhir", {
          params: {
            npk: this.dataUser.npk,
            kodeKantor: this.entryItem.kodeKantor,
            kodeJenisNaskah: this.entryItem.kodeJenisNaskah,
          },
        })
        .then((res) => {
          // console.log("succsess",res.data.data[0].noNaskah)
          if (res.data.ret == 0) {
            this.noNaskahTerakhir = res.data.data[0].noNaskah;
            this.drNomor = this.noNaskahTerakhir.split("/")[1];
            // console.log("testing:",this.noNaskahTerakhir, this.drNomor)
          }
        })
        .catch(() => {
          console.log("error");
        });
    },

    save: async function () {
      try {
        if (this.entryItem.kontentId == "") {
          let params = {
            deskripsiKontent: this.entryItem.deskripsiKontent,
            fileKonten: this.entryItem.fileKonten,
            jenisKonten: this.entryItem.jenisKonten,
            namaKonten: this.entryItem.namaKonten,
            kodeUser: this.dataUser.kodeUser,
          };

          let { data } = await this.$axios.post("/help/faq-create", params);
          if (data.ret == "0") {
            this.$swal("", "Data berhasil simpan", "success");
            this.getAllDataHelp();
            this.dialog = false;
          } else {
          }
        } else {
          let params = {
            deskripsiKontent: this.entryItem.deskripsiKontent,
            fileKonten: this.entryItem.fileKonten,
            jenisKonten: this.entryItem.jenisKonten,
            kontentId: this.entryItem.kontentId,
            namaKonten: this.entryItem.namaKonten,
            kodeUser: this.dataUser.kodeUser,
          };
          let { data } = await this.$axios.put("/help/faq-update", params);
          if (data.ret == "0") {
            this.$swal("", "Data berhasil diubah", "success");
            this.getAllDataHelp();
            this.dialog = false;
          }
        }
        //let { data } = await this.$axios.post("/help/faq-create", params);
        //this.result = data;
        //console.log(this.result);
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },

    deleteItem: async function (item) {
      try {
        console.log(item);
        let params = {
          kontentId: item.contentId,
          kodeUser: this.dataUser.kodeUser,
        };
        this.$swal({
          title: "Apakah Anda Yakin Ingin Menghapus Konten tersbut?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.overlay = true;
            let { data } = await this.$axios.post("/help/faq-delete", params);
            if (data.ret == "0") {
              this.$swal("", "Data berhasil dihapus", "success");
              this.getAllDataHelp();
            } else {
              this.$swal("", "Data gagal dihapus", "danger");
              this.getAllDataHelp();
            }
          }
        });
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },
    async formHelpEntry() {
      this.entryItem.kontentId = "";
      this.entryItem.namaKonten = "";
      this.entryItem.jenisKonten = "";
      this.entryItem.fileKonten = "";
      this.entryItem.deskripsiKontent = "";
      this.dialog = true;
    },
  },
};
</script>
