<style lang="scss" scoped>
.elevation-1 {
  text-align: center;
}
thead {
  background: #e7e7e7;
}
</style>
<template>
  <v-layout column justify-center align-center>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm12 md12 v-if="false">
          <v-layout wrap>
            <v-flex xs12 sm4 md4>
              <v-select
                :items="dropdown_kantor"
                :rules="requiredRules"
                v-model="kodeKantorJajaran"
                label="Kantor"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12>
          <v-layout wrap>
            <v-flex xs12 sm3 md3>
              <v-select
                :items="dropdown_filter"
                :rules="requiredRules"
                v-model="filterBy"
                label="Filter by"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
              <v-select
                :items="dropdown_jenis_arsip"
                :rules="requiredRules"
                v-model="jenisArsip"
                label="Jenis Arsip"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3 md3 v-if="filterBy == 'idarsip'">
              <v-text-field
                :rules="requiredRules"
                v-model="kataKunci"
                label="Search"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
              <v-menu
                v-model="menutm"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="computedDateFormattedMomentjs1"
                    label="Tanggal Awal"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :rules="requiredRules"
                  v-model="tanggalMasuk"
                  color="success"
                  @input="setenddate"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
              <v-menu
                v-model="menuts"
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
                  ></v-text-field>
                </template>
                <v-date-picker
                  :rules="requiredRules"
                  v-model="tanggalKeluar"
                  :min="minDateEnd"
                  color="success"
                  @input="menuts = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex v-if="jenisArsip == 'N00000001'">
              <v-select
                :items="dropdown_kode_klasifikasi"
                :rules="requiredRules"
                v-model="kodeKlasifikasi"
                label="Kode Klasifikasi"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm3 md3>
          <v-btn
            :disabled="!formIsValid"
            color="primary"
            left
            @click="pencarian"
            >Cari</v-btn
          >
        </v-flex>
        <v-flex xs12 sm12 md12 v-if="showTable">
          <div>
            <v-data-table
              :headers="headers"
              :search="search"
              :items="items"
              item-key="name"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  label="Filter"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:item.aksi="{ item }">
                <v-btn
                  class="px-2 ml-1"
                  color="primary"
                  min-width="0"
                  small
                  @click="getRecentPage(item.idArsip)"
                  >Lihat</v-btn
                >
              </template>
              <template v-slot:no-data>
                <span>Tidak ada data arsip</span>
              </template>
            </v-data-table>
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-card
          style="background-color: transparent"
          class="pa-4 v-sheet rounded"
        >
          <div>Keterangan :</div>
          <div>
            1. Surat Dinas dan Produk Hukum dipindahkan ke Pengelola Arsip untuk
            jangka waktu >= 1 Tahun (by sistem)
          </div>
          <div>
            2. Dokumen LPK Jaminan dipindahkan ke Pengelola Arsip untuk jangka
            waktu >= 2 bulan (by sistem)
          </div>
        </v-card>
      </v-layout>
    </v-container>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
import helper from "@/helpers/index";

export default {
  data() {
    return {
      resultDocKodeJenisArsip: "",
      search: "",
      resultList: [],
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      items: [],
      filterBy: "",
      jenisArsip: "",
      kodeKlasifikasi: "",
      kataKunci: "",
      dropdown_filter: [
        { text: "Jenis Arsip", value: "jenis" },
        { text: "ID Arsip", value: "idarsip" },
      ],
      dropdown_jenis_arsip: [],
      dropdown_kode_klasifikasi: [],
      headers: [],
      showTable: false,
      menutm: false,
      menuts: false,
      tanggalMasuk: new Date().toISOString().substr(0, 10),
      tanggalKeluar: new Date().toISOString().substr(0, 10),
      minDateEnd: new Date().toISOString().substr(0, 10),
      overlay: false,
      kodeKantorJajaran: "",
      dropdown_kantor: [],
      dataUserGlobal: {},
    };
  },
  components: {},
  created: async function () {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      this.dataUserGlobal = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if (listPage.includes(this.$route.path.split("/")[1])) {
            // console.log(dataUser);
            this.kodeUser = dataUser.kodeUser;
            this.namaUser = dataUser.namaUser;
            this.npk = dataUser.npk;
            this.kodeKantor = dataUser.kodeKantor;
            this.kodeKantorRole = dataUser.kodeKantorRole;
            this.kodeKantorJajaran = dataUser.kodeKantorRole;

            this.email = dataUser.email;
            this.token = dataUser.token;
            await this.getListJenisArsip();
            await this.getListKodeKlasifikasi();
            await this.getListKantorJajaran();
          } else {
            this.$router.push({ path: "/error" });
          }
        } else {
          this.$router.push({ path: "/error" });
        }
      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  watch: {},
  computed: {
    computedDateFormattedMomentjs1() {
      return this.tanggalMasuk
        ? this.$moment(this.tanggalMasuk).format("DD/MM/YYYY")
        : "";
    },
    computedDateFormattedMomentjs2() {
      return this.tanggalKeluar
        ? this.$moment(this.tanggalKeluar).format("DD/MM/YYYY")
        : "";
    },
    formIsValid() {
      if (this.filterBy == "jenis") {
        return this.filterBy && this.jenisArsip;
      } else {
        return this.filterBy && this.kataKunci;
      }
    },
  },
  methods: {
    setenddate() {
      this.menutm = false;
      this.minDateEnd = this.tanggalMasuk;
      if (this.tanggalMasuk > this.tanggalKeluar) {
        this.tanggalKeluar = this.tanggalMasuk;
      }
    },
    titleCase(string) {
      var sentence = string.toLowerCase().split("_");
      for (var i = 0; i < sentence.length; i++) {
        if (i == 0) {
          sentence[i] = sentence[i][0].toLowerCase() + sentence[i].slice(1);
        } else {
          sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
      }
      var kata = sentence.join("");
      return kata;
    },
    getListJenisArsip: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/master/arsip-jenis", {
          params: {},
        });
        this.resultJenisArsip = data;
        // console.log(this.resultJenisArsip);
        if (this.resultJenisArsip.ret == 0) {
          var dataListJenisArsip = this.resultJenisArsip.data;
          if (
            dataListJenisArsip != undefined &&
            dataListJenisArsip.length > 0
          ) {
            this.dropdown_jenis_arsip = [];
            for (var i = 0; i < dataListJenisArsip.length; i++) {
              this.dropdown_jenis_arsip.push({
                text: dataListJenisArsip[i].namaJenisArsip,
                value: dataListJenisArsip[i].kodeJenisArsip,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.dropdown_jenis_arsip = [];
          }
        } else {
          this.overlay = false;
          this.dropdown_jenis_arsip = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getListKodeKlasifikasi: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/master/arsip-kode-klasifikasi", {
          params: {},
        });
        this.resultKodeKlasifikasi = data;
        var dataListKodeKlasifikasi = this.resultKodeKlasifikasi;
        if (
          dataListKodeKlasifikasi != undefined &&
          dataListKodeKlasifikasi.length > 0
        ) {
          this.dropdown_kode_klasifikasi = [];
          for (var i = 0; i < dataListKodeKlasifikasi.length; i++) {
            this.dropdown_kode_klasifikasi.push({
              text: dataListKodeKlasifikasi[i].name,
              value: dataListKodeKlasifikasi[i].val,
            });
          }
          this.overlay = false;
        } else {
          this.overlay = false;
          this.dropdown_kode_klasifikasi = [];
        }
      } catch (error) {
        this.overlay = false;
        this.dropdown_kode_klasifikasi = [];
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getListKantorJajaran: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/getKodeKantorJajaran/" + this.kodeKantorRole,
          {
            params: {},
          }
        );
        this.resultKantorJajaran = data;
        console.log("this.resultKantorJajaran");
        if (this.resultKantorJajaran.ret == 0) {
          var dataListKantorJajaran = this.resultKantorJajaran.data;
          if (
            dataListKantorJajaran != undefined &&
            dataListKantorJajaran.length > 0
          ) {
            this.dropdown_kantor = [];
            for (var i = 0; i < dataListKantorJajaran.length; i++) {
              this.dropdown_kantor.push({
                text: dataListKantorJajaran[i].namaKantor,
                value: dataListKantorJajaran[i].kodeKantor,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.dropdown_kantor = [];
          }
        } else {
          this.overlay = false;
          this.dropdown_kantor = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getheader: async function () {
      let customSizeHeader = ["TGL SURAT", "NO SURAT", "PERIHAL", "KETERANGAN"];
      try {
        this.headers = [];
        let { data } = await this.$axios.get(
          "/arsip/header?jenis=" + this.jenisArsip
        );
        this.resultHeader = data;
        if (this.resultHeader.ret == 0) {
          var listHeader = this.resultHeader.data;
          if (listHeader != undefined && listHeader.length > 0) {
            for (var i = 0; i < listHeader.length; i++) {
              console.log("ini filter:", this.filterBy);
              this.headers.push({
                text: listHeader[i].text,
                value: this.titleCase(listHeader[i].value),
                align: "center",
                content: "center",
                width: customSizeHeader.includes(listHeader[i].text)
                  ? "115px"
                  : "",
              });
            }
            this.headers.push({
              text: "AKSI",
              value: "aksi",
              align: "center",
            });
            console.log(this.headers);
          } else {
            this.$swal("Error", "Gagal request headers!", "error");
          }
        } else {
          this.$swal("Error", "Gagal request headers!", "error");
        }
      } catch (error) {
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getRecentPage: async function (idArsip) {
      console.log("getRecent", idArsip);
      sessionStorage.setItem("recentPage", "archive");
      this.$router.push({ path: "/qr/" + idArsip });
    },
    pencarian: async function () {
      this.overlay = true;
      this.showTable = false;
      var kata = this.kataKunci ? this.kataKunci : "-1";

      if (this.filterBy == "idarsip") {
        let result = await this.$axios.get("/arsip/" + kata + "/doc", {
          params: { kantor: this.kodeKantorJajaran },
        });
        this.resultDoc = result.data;
        console.log(this.resultDoc);
        if (this.resultDoc.ret == 0 && this.resultDoc.data != undefined) {
          this.resultDocKodeJenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          this.jenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          await this.getheader();
        } else {
          this.overlay = false;
          this.$swal("Error", "Data tidak ditemukan!", "error");
          return;
        }
        // console.log(this.resultDocKodeJenisArsip);
      } else {
        //console.log('jenisArsip')
        //console.log(this.jenisArsip)
        await this.getheader(this.jenisArsip);
      }

      this.temp = this.filterBy == "jenis" ? "-1" : this.kataKunci;
      this.temp2 =
        this.filterBy == "jenis"
          ? this.jenisArsip
          : this.resultDocKodeJenisArsip;
      // console.log("----" + this.temp2);
      // let { data } = await this.$axios.get(
      //   "/arsip/" + this.temp + "/header?jenis=" + this.temp2
      // );
      let { data } = await this.$axios.get("/arsip/" + this.temp + "/header", {
        params: {
          jenis: this.temp2,
          kantor: this.kodeKantorJajaran,
          dateStart: this.tanggalMasuk,
          dateEnd: this.tanggalKeluar,
          kodeRole: this.dataUserGlobal.kodeRole,
          npk: this.dataUserGlobal.npk,
          kodeKlasifikasi: this.kodeKlasifikasi,
        },
      });
      this.resultList = data;
      //console.log(this.resultList);
      if (this.resultList.ret == 0) {
        this.items = [];
        var listArsip = this.resultList.data;
        if (listArsip != undefined && listArsip.length > 0) {
          for (var i = 0; i < listArsip.length; i++) {
            this.items.push(listArsip[i]);
          }
          this.overlay = false;
          this.showTable = true;
        } else {
          this.overlay = false;
          this.$swal("Error", "Data tidak ditemukan!", "error");
          this.items = [];
        }
      } else {
        this.overlay = false;
        this.$swal("Error", "Data tidak ditemukan!", "error");
        this.items = [];
      }
    },
  },
};
</script>
