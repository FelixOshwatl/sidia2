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
        <v-flex xs12 sm12 md12>
          <v-layout wrap>
            <v-flex xs12 sm4 md4>
              <v-text-field label="Keyword" placeholder="Filter berdasarkan Keyword" v-model="filter.keyword"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 v-if="false">
              <v-select 
                label="Unit Kerja" 
                :items="dropdown_kantor"
                placeholder="Filter berdasarkan Unit Kerja" 
                v-model="filter.unitKerja"></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md4 v-if="false">
            <v-select
                :items="item_jenisArsip"
                placeholder="Filter Jenis Arsip"
                label="Jenis Arsip"
                v-model="filter.jenisArsip"
              ></v-select>
        </v-flex>
        <v-flex xs12 sm3 md3 v-if="false">
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
                  v-model="tanggalMasuk"
                  color="success"
                  @input="setenddate"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm3 md3 v-if="false">
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
                  v-model="tanggalKeluar"
                  :min="minDateEnd"
                  color="success"
                  @input="menuts = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
        <v-flex xs12 sm12 md12 class="pt-4">
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-btn @click="doReset" outlined color="primary" class="mr-4 mb-4" min-width="150px">
                Reset
              </v-btn>
              <v-btn :disabled="!formIsValid" @click="doSearch" color="primary" class="mb-4" min-width="150px">
                Search
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12 v-if="resultList.data">
          <v-layout wrap>
            <v-flex xs12 sm4 md4 v-for="item in resultList.data" :key="item.idArsip">
              <v-card class="mx-auto" @click="localstorage(item.idArsip)" outlined >
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title>{{item.idArsip}}</v-list-item-title>
                    <v-list-item-subtitle>[{{item.namaJenisArsip}}] {{item.path}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-flex>
          </v-layout>
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
      q: this.$route.query.q || "",
      resultList: [],
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      resultJenisArsip: null,
      item_jenisArsip: [],
      dropdown_kantor:[],
      kode_jenisArsip:"",
      kodeKantorRole:"",
      menutm: false,
      filter: {
        unitKerja: '',
        keyword: '',
        jenisArsip:'',

      },
      menuts: false,
      tanggalMasuk: new Date().toISOString().substr(0, 10),
      tanggalKeluar: new Date().toISOString().substr(0, 10),
      minDateEnd: new Date().toISOString().substr(0, 10),
      overlay: false,
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
            console.log("true")
            this.kodeUser = dataUser.kodeUser;
            this.namaUser = dataUser.namaUser;
            this.npk = dataUser.npk;
            this.kodeKantor = dataUser.kodeKantor;
            this.kodeKantorRole = dataUser.kodeKantorRole;
            this.kodeKantorJajaran = dataUser.kodeKantorRole;

            this.email = dataUser.email;
            this.token = dataUser.token;
            await this.getListJenisArsip();
            await this.getListKantorJajaran();
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
  watch: {
    "$route.query.q": function () {
      this.search();
    },
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
      return this.filter.keyword;
      // &&
      // this.kode_pointerArsip &&
      // this.tanggalMasuk &&
      // this.tanggalKeluar
    },
  },
  methods: {
    doReset(){
      this.resultList = [];
      this.filter.keyword = '';
      this.filter.jenisArsip = ''
      this.filter.unitKerja = ''
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
        console.log(this.resultKantorJajaran);
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
            this.filter.unitKerja = this.kodeKantorRole
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
    doSearch: async function(){
      this.overlay = true;
       if(this.filter.keyword != ""){
        let { data } = await this.$axios.get("/arsip/searchByKodeKantor", {
            params: { q: this.filter.keyword,
                      kodeKantorJajaran: this.kodeKantorJajaran
                    },
          }); 
        this.resultList = data;
        console.log(this.resultList)
        if (this.resultList.ret == 0 && this.resultList.data != undefined) {
          this.overlay = false;
        } else {
          this.overlay = false;
          this.$swal("Info", "Data tidak ditemukan!", "warning");
        }
        
        // console.log(this.resultList);
      }

    },
    localstorage: async function(idArsip){
      console.log("getRecent",idArsip)
      sessionStorage.setItem("recentPage", "search");
      this.$router.push({ path: "/qr/"+idArsip });
    },
    setenddate() {
      this.menutm = false;
      this.minDateEnd = this.tanggalMasuk;
      if (this.tanggalMasuk > this.tanggalKeluar) {
        this.tanggalKeluar = this.tanggalMasuk;
      }
    },
    submit: function () {
      this.$router.push({ path: this.$route.path, query: { q: this.q } });
    },
    search: async function () {
      if (this.q != "") {
        let { data } = await this.$axios.get("/arsip/search?q=" + this.q);
        this.resultList = data;
        // console.log(this.resultList);
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
            this.item_jenisArsip = [{
              text: 'SEMUA JENIS ARSIP',
              value: '' 
            }];
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
  },
};
</script>
