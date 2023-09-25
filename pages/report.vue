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
                :rules="requiredRules"
                :items="item_jenisArsip"
                label="Jenis Arsip"
                v-model="kode_jenisArsip"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3 md3 v-if="true">
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
            <v-flex xs12 sm3 md3 v-if="true">
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
            <v-flex xs12 sm3 md3 v-if="sementara">
              <v-select
                :rules="requiredRules"
                :items="item_pointerArsip"
                label="Pointer"
                v-model="kode_pointerArsip"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12></v-flex>
        <v-flex xs12 sm12 md12></v-flex>
        <v-flex xs12 sm12 md12>
          <v-btn
            color="primary darken-1"
            :disabled="!formIsValid"
            @click="getPdf"
            >Eksport PDF</v-btn
          >
          <v-btn
            color="success darken-1"
            :disabled="!formIsValid"
            @click="getExcel"
            >Eksport Excel</v-btn
          >
        </v-flex>
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
      sementara: false,
      kode_jenisArsip: "",
      item_jenisArsip: [],
      kode_pointerArsip: "",
      item_pointerArsip: [],
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      menutm: false,
      menuts: false,
      tanggalMasuk: new Date().toISOString().substr(0, 10),
      tanggalKeluar: new Date().toISOString().substr(0, 10),
      minDateEnd: new Date().toISOString().substr(0, 10),
      overlay: false,
      kodeKantorJajaran: "",
      dropdown_kantor: [],
    };
  },
  components: {},
  created: async function () {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if(listPage.includes(this.$route.path.split("/")[1])){
            // console.log(dataUser);
            this.kodeUser = dataUser.kodeUser;
            this.namaUser = dataUser.namaUser;
            this.npk = dataUser.npk;
            this.kodeKantor = dataUser.kodeKantor;
            this.email = dataUser.email;
            this.token = dataUser.token;
            this.kodeKantorRole = dataUser.kodeKantorRole;
            this.kodeKantorJajaran = dataUser.kodeKantorRole;
            await this.getListJenisArsip();
            await this.getListKantorJajaran();
            await this.getListPointer();
          }else{
            this.$router.push({ path: "/error" });
          }
        }else{
          this.$router.push({ path: "/error" });
        }
      }
    } else {
           this.$router.push({ path: "/login" });
    }
  },
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
      return this.kode_jenisArsip;
      // &&
      // this.kode_pointerArsip &&
      // this.tanggalMasuk &&
      // this.tanggalKeluar
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
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
            this.item_jenisArsip = [];
            for (var i = 0; i < dataListJenisArsip.length; i++) {
              this.item_jenisArsip.push({
                text: dataListJenisArsip[i].namaJenisArsip,
                value: dataListJenisArsip[i].kodeJenisArsip,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.item_jenisArsip = [];
          }
        } else {
          this.overlay = false;
          this.item_jenisArsip = [];
        }
      } catch (error) {
        this.overlay = false;
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
    getListPointer: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/master/arsip-pointer", {
          params: {},
        });
        this.resultPointer = data;
        // console.log(this.resultPointer);
        if (this.resultPointer.ret == 0) {
          var dataListPointer = this.resultPointer.data;
          if (dataListPointer != undefined && dataListPointer.length > 0) {
            this.item_pointerArsip = [];
            for (var i = 0; i < dataListPointer.length; i++) {
              this.item_pointerArsip.push({
                text: dataListPointer[i].namaPointerArsip,
                value: dataListPointer[i].kodePointerArsip,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.item_pointerArsip = [];
          }
        } else {
          this.overlay = false;
          this.item_pointerArsip = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getPdf: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/getPdf/" + this.kode_jenisArsip,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            baseURL:process.env.baseURL2, responseType: "blob",
            transformResponse: [],
            params: {
              jenis: this.kode_jenisArsip,
              kantor: this.kodeKantorJajaran,
              dateStart: this.tanggalMasuk,
              dateEnd: this.tanggalKeluar,
            },
          }
        );
        var url = await URL.createObjectURL(
          new Blob([data], { type: data.type })
        );
        //window.open(url);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        // link.setAttribute("download", Date.now() + data.type);
        // link.download = Date.now() + data.type;
        document.body.appendChild(link);
        link.click();

        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getExcel: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/getExcel/" + this.kode_jenisArsip,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            baseURL:process.env.baseURL2, responseType: "blob",
            transformResponse: [],
            params: {
              jenis: this.kode_jenisArsip,
              kantor: this.kodeKantorJajaran,
              dateStart: this.tanggalMasuk,
              dateEnd: this.tanggalKeluar,
            },
          }
        );
        var url = await URL.createObjectURL(
          new Blob([data], { type: data.type })
        );
        //window.open(url);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        // link.setAttribute("download", Date.now() + data.type);
        // link.download = Date.now() + data.type;
        document.body.appendChild(link);
        link.click();

        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
  },
};
</script>
