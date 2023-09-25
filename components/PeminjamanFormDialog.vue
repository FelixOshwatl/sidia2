<template>
  <v-dialog
    :value="true"
    @input="$emit('close')"
    v-on="$attrs"
    v-bind="$listeners"
    max-width="700"
    persistent
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
        dense
      >
        Form Peminjaman Arsip
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-data-table
          dense
          :headers="headersFormPengajuan"
          :items="itemsFormPengajuan"
          :hide-default-footer="true"
          item-key="ID"
          class="elevation-1"
        >
          <template v-slot:item="{ item,index }">
              <tr>
                <td align="center">{{(options.page - 1) * options.itemsPerPage + index + 1}}</td>
                <td align="left">{{item.idArsip}}</td>
                <td align="left">{{item.kodeKantor}}</td>
                <td align="left">{{item.namaJenisArsip}}</td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <td align="left" v-bind="attrs" v-on="on" light>{{truncate(item.perihal)}}</td>
                  </template>
                  <span>{{item.perihal}}</span>
                </v-tooltip>
                <td align="center">
                  <v-btn icon @click="delArsip(index)">
                    <v-icon color="error" small >mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
        </v-data-table>
      </v-card-text>
      <v-card-text
            class="d-flex align-center pa-4 mx-auto"
            max-width="550"
            min-height="76"
            outlined
      >
      <div class="text-caption my-2" v-if="selectedDocument">
          Noted :Peminjaman hanya di Kantor yang sama 
          <v-btn
              x-small
              @click="resetData()"
              color="primary"
              light
              right
          > 
          <v-icon left>mdi-lock-reset</v-icon>
              Reset Data
          </v-btn>
      </div>
      </v-card-text>
      <v-card-actions>
        <v-container fluid  class="d-flex justify-space-between">
          <v-dialog
            v-model="menu"
            :close-on-content-click="false"
            max-width="1200px"
          >
            <template v-slot:activator="{ attrs }">
              <v-btn
                color="info"
                v-bind="attrs"
                @click="openLovArsip()"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                Tambah Arsip
              </v-btn>
            </template>

            <v-card>
              <!-- <v-data-table
                dense
                :headers="headersLovArsip"
                :items="itemsLovArsip"
                :options.sync="options"
                :hide-default-footer="false"
                :server-items-length="totalData"
                :footer-props="{'items-per-page-options':[15,50,100]}"
                item-key="ID"
                class="elevation-1"
                :loading="isLovLoading"
              >
                <template v-slot:top>
                    <v-text-field
                      v-model="filter.keyword"
                      type="text"
                      outlined
                      clearable
                      rounded
                      class="pa-2"
                      placeholder="Keyword"
                      v-on:keyup.enter="doSearchFilter()"
                      dense
                      hide-details
                  >
                    <template v-slot:append>
                      <v-icon @click="doSearchFilter" class="mr-4">mdi-magnify</v-icon>
                      <v-icon @click="doRefresh">mdi-refresh</v-icon>
                    </template>
                   
                  </v-text-field>
                </template>
                <template v-slot:item="{ item,index }">
                  <tr  style="cursor:pointer"  @click="tambahArsip(item)">
                    <td align="center">{{(options.page - 1) * options.itemsPerPage + index + 1}}</td>
                    <td align="left">{{item.idArsip}}</td>
                    <td align="left">{{item.kodeKantor}}</td>
                    <td align="left">{{item.namaJenisArsip}}</td>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <td align="left"
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{truncate(item.formData)}}
                          </td>
                        </template>
                        <span>{{item.formData}}</span>
                      </v-tooltip>
                  </tr>
                </template>
              </v-data-table> -->
              <v-col>
                <v-layout column justify-center align-center>
                  <v-container grid-list-md>
                    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
                      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
                    </v-overlay>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-layout wrap>
                          <!-- <v-flex xs12 sm3 md3>
                            <v-select
                              :items="dropdown_filter"
                              :rules="requiredRules"
                              v-model="filterBy"
                              label="Filter by"
                            ></v-select>
                          </v-flex> -->
                          <v-flex xs12 sm3 md3>
                            <v-select
                              :items="dropdown_jenis_arsip"
                              :rules="requiredRules"
                              v-model="jenisArsip"
                              label="Jenis Arsip"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 sm3 md3>
                            <!-- <v-select
                              :items="dropdown_kode_kantor"
                              v-model="kodeKantor"
                              label="Kode Kantor"
                            ></v-select> -->
                            <v-autocomplete
                                v-model="kodeKantor"
                                :items="dropdown_kode_kantor"
                                :rules="requiredRules"
                                :disabled="kodeKantorFilter"
                                hide-no-data
                                hide-details
                                label="kode kantor"
                            ></v-autocomplete>
                            
                          </v-flex>
                          <v-flex xs12 sm3 md3>
                            <v-text-field
                              v-model="kataKunci"
                              label="Kata Kunci"
                            ></v-text-field>
                          </v-flex>
                          <!-- <v-flex xs12 sm3 md3>
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
                          <v-flex xs12 sm3 md3>
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
                          </v-flex> -->
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 sm3 md3>
                        <v-btn
                          :disabled="!formIsValid"
                          left
                          color="primary"
                          @click="pencarian"
                          >Cari</v-btn
                      >
                      </v-flex>
                      <v-flex xs12 sm12 md12 v-if="showTable">
                        <br>
                        <div>
                          <v-data-table
                            v-model="selectedArsip"
                            :headers="headersDaftarArsip"
                            :search="searchDaftarArsip"
                            :items="itemsDaftarArsip"
                            item-key="idArsip"
                            :single-select="false"
                            class="elevation-1"
                          >
                          <template v-slot:[`item.aksi`]="{ item }">
                              <v-btn 
                                class="px-2 ml-1"
                                min-width="0"
                                small
                                color="primary"
                                @click="tambahArsip(item)"
                                >Pilih</v-btn
                              >
                            </template>
                            <template v-slot:top>
                              <v-text-field
                                v-model="searchDaftarArsip"
                                label="Filter"
                                class="mx-4"
                              ></v-text-field>
                            </template>
                            <template v-slot:no-data>
                              <span>Tidak ada data arsip</span>
                            </template>
                          </v-data-table>
                          <br>
                          <v-card-actions>
                            <v-btn
                              color="primary"
                              text
                              @click="menu = null"
                            >
                              Tutup
                            </v-btn>
                          </v-card-actions>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-layout>
              </v-col>
            </v-card>
          </v-dialog>
          <div>
            <v-btn
              color="success"
              @click="onSaveData"
              :loading="isFormSaving"
            >
              <v-icon left>
                mdi-content-save
              </v-icon>
              Submit
            </v-btn>
            <v-btn
              color="error"
              @click="$emit('close')"
            >
              <v-icon left>
                mdi-close-box
              </v-icon>
              Tutup
            </v-btn>
          </div>
        </v-container>   
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import helper from "@/helpers/index";
export default {
  name:'PeminjamanForm',
  data(){
    return {
      dropdown_filter: [
        { text: "Jenis Arsip", value: "jenis" },
        { text: "ID Arsip", value: "idarsip" },
      ],
      dropdown_jenis_arsip: [],
      dropdown_kode_kantor:[],
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      filterBy: "",
      headersDaftarArsip: [],
      showTable:false,
      jenisArsip: "",
      tanggalMasuk: new Date().toISOString().substr(0, 10),
      tanggalKeluar: new Date().toISOString().substr(0, 10),
      minDateEnd: new Date().toISOString().substr(0, 10),
      kodeKantorJajaran: "",
      kodeKantor:"",
      kodeKantorFilter:false,
      overlay: false,
      selectedArsip: [],
      searchDaftarArsip: "",
      itemsDaftarArsip: [],
      filterItemDaftarArsip:[],
      menutm: false,
      menuts: false,
      kataKunci: "",
      dataUser:{},
      selectedDocument: false,
      headersFormPengajuan: headersFormPengajuan,
      itemsFormPengajuan:[],
      itemDaftarArsipNew:[],
      menu: null,
      kodeJenis: "",
      headersLovArsip:headersLovArsip,
      itemsLovArsip: [],
      totalData: 0,
      options:{
        page: 1,
        itemsPerPage:5
      },
      isLovLoading: false,
      isFormSaving: false,
      dataArsip : [],
      filter: {
        status: null
      }
    }
  },
  watch: {
    options: {
      handler() {
           //if(!this.isLovLoading) this.getLovArsip(this.filter.keyword,this.kodeKantor)
      },
    },
    deep: true,
  },
  computed:{
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
      if (this.jenisArsip != "" && this.kodeKantor) {
        return this.jenisArsip && this.kodeKantor;
      }
    },
    isSelected() {
        return this.selectedArsip.length > 0;
    },
  },
  async created(){
    // console.log('sssssssssss')
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole
      // console.log(this.kodeKantorRole)
      if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!this.dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = "dataUser.kodeUser";
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if(listPage.includes(this.$route.path.split("/")[1])){
            this.getLovListTL();
            // this.getListNaskah();
            this.kodeKantorJajaran = this.dataUser.kodeKantorRole;
            await this.getListJenisArsip();
            await this.getListKodeKantor();
            this.getLovJenisNaskah();
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
  methods:{
    getLovListTL: async function(){
      // this.overlay = true
      this.$axios.get("/master/jenis-tl")
        .then((res)=>{
          // this.overlay = false;
          const itemKategoriTL = [{
            value:'',
            text:'Semua Kategori Tindak Lanjut'
          }];
          res.data.data.forEach(item=>{
            itemKategoriTL.push({
              value : item.namaTl,
              text : item.namaTl
            })
          })
          this.itemKategoriTL = itemKategoriTL;
          // console.log(this.itemKategoriTL);

        })
        .catch((err) => {
          console.log(err)
          // this.overlay = false;
        });

    },
    getLovJenisNaskah: async function(){
      // this.overlay = true
      this.$axios.get("/master/naskah-jenis")
        .then((res)=>{
          // this.overlay = false;
          const itemsJenisNaskah = [{
            value:'',
            text:'Semua Jenis Naskah'
          }];
          res.data.data.forEach(item=>{
            itemsJenisNaskah.push({
              value : item.kodeJenisNaskah,
              text : item.namaJenisNaskah
            })
          })
          this.itemsJenisNaskah = itemsJenisNaskah;
          // console.log(this.itemsJenisNaskah);
        })
        .catch((err) => {
            // this.overlay = false;
            console.log(err)
        });

    },
    setenddate() {
      this.menutm = false;
      this.minDateEnd = this.tanggalMasuk;
      if (this.tanggalMasuk > this.tanggalKeluar) {
        this.tanggalKeluar = this.tanggalMasuk;
      }
    },
    onSaveData(){
      // console.log('confirm save')
      this.saveData()
    },
    openLovArsip(keyword){
      this.menu=true
    },
    truncate(input) {
      // console.log('input',input)
      if(input != null){
        if (input.length > 5) {
          return input.substring(0, 10) + '...';
        }
      }else{
        return input;
      }
    
    },
    pencarian: async function () {
      // console.log("testing")
      this.overlay = true;
       this.showTable = false;
      var kata = this.kataKunci ? this.kataKunci : "-1";
      var paramKantor = this.kodeKantor ? this.kodeKantor : "-1"
      // console.log(this.kodeKantor,"paramkantor")
      if (this.filterBy == "idarsip") {
        let result = await this.$axios.get("/arsip/" + kata + "/doc", {
          params: { kantor: this.kodeKantorJajaran },
        });
        this.resultDoc = result.data;
        //  console.log(this.resultDoc);
        if (this.resultDoc.ret == 0 && this.resultDoc.data != undefined) {
          this.resultDocKodeJenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          this.jenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          await this.getheader();
        } else {
          this.overlay = false;
          this.$swal("Not Found", "Data tidak ditemukan!", "error");
          return;
        }
      } else {
        await this.getheader(this.jenisArsip);
      }

      this.temp = this.kataKunci == "" ? "-1" : this.kataKunci;
      this.temp2 = this.jenisArsip
        // this.filterBy == "jenis"
        //   ? this.jenisArsip
        //   : this.resultDocKodeJenisArsip;

      let { data } = await this.$axios.get("/arsipPeminjaman/" + this.temp + "/header", {
        params: {
          jenis: this.temp2,
          kantor: paramKantor,
          dateStart: this.tanggalMasuk,
          dateEnd: this.tanggalKeluar,
          kodeRole : this.dataUser.kodeRole,
          npk      : this.dataUser.npk
        },
      });
      this.resultList = data;
      //  console.log(this.resultList);
      if (this.resultList.ret == 0) {
        this.itemsDaftarArsip = [];
        var listArsip = this.resultList.data;
        if (listArsip != undefined && listArsip.length > 0) {
          for (var i = 0; i < listArsip.length; i++) {
            this.itemsDaftarArsip.push(listArsip[i]);
          }
          this.overlay = false;
          this.showTable = true;
        } else {
          this.overlay = false;
          this.$swal("Not Found", "Data tidak ditemukan!", "error");
          this.itemsDaftarArsip = [];
        }
      } else {
        this.overlay = false;
        this.$swal("Not Found", "Data tidak ditemukan!", "error");
        this.itemsDaftarArsip = [];
      }
    },
    getheader: async function () {
      let customSizeHeader=['TGL SURAT','NO SURAT','PERIHAL','KETERANGAN']
      try {
        this.headersDaftarArsip = [];
        let { data } = await this.$axios.get(
          "/arsip/header?jenis=" + this.jenisArsip
        );
        this.resultHeader = data;
        if (this.resultHeader.ret == 0) {
          var listHeader = this.resultHeader.data;
          this.headersDaftarArsip.push({
              text: "AKSI",
              value: "aksi",
              align:"center",
            });
          if (listHeader != undefined && listHeader.length > 0) {
            for (var i = 0; i < listHeader.length; i++) {
              // console.log('ini filter:',this.resultHeader)
              this.headersDaftarArsip.push({
                text: listHeader[i].text,
                value: this.titleCase(listHeader[i].value),
                align:'center',
                content: 'center',
                width:(customSizeHeader.includes(listHeader[i].text))?'115px':'',
              });
             
            }
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
    getListKodeKantor: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/arsipPeminjaman/getArsipFilterByKodeKantor", {
          params: {},
        });
        this.resultKodeKantor = data;
        // console.log(this.resultKodeKantor);
        if (this.resultKodeKantor.ret == 0) {
          var dataListKodeKantor = this.resultKodeKantor.data;
          if (
            dataListKodeKantor != undefined &&
            dataListKodeKantor.length > 0
          ) {
            this.dropdown_kode_kantor = [];
            for (var i = 0; i < dataListKodeKantor.length; i++) {
              this.dropdown_kode_kantor.push({
                text: dataListKodeKantor[i].kodeKantor +` - `+ dataListKodeKantor[i].namaKantor,
                value: dataListKodeKantor[i].kodeKantor,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.dropdown_kode_kantor = [];
          }
        } else {
          this.overlay = false;
          this.dropdown_kode_kantor = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getLovArsip(keyword,kodeKantor){
        this.isLovLoading=true
        this.itemsLovArsip=[]
        const { page, itemsPerPage } = this.options;
        let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.$axios.get("/arsipPeminjaman/getArsipPeminjaman",{
          params:{
            page:page,
            length:itemsPerPage,
            kodeKantor : kodeKantor,
            keyword   : keyword
          }
        })
        .then((res)=>{
          // console.log(res.data.data)
          this.totalData = Number(res.data.rowCount);
          this.isLovLoading=false
        })
        .catch(()=>{
          this.isLovLoading=false
        })
    },
    saveData(){
      // console.log("npk",this.dataArsip)
      // return;
      this.isFormSaving=true
      this.$axios.post("/arsip/submitPeminjamanArsip",{
            npk : this.dataUser.npk,
            dataArsip : this.dataArsip,
            kodeKantorPeminjam : this.dataUser.kodeKantorRole,
            kodeKantorPemilik : this.kodeKantor,
            petugas : this.dataUser.kodeUser,
            role : this.dataUser.kodeRole
      })
      .then((res)=>{
        // console.log(params)
        if(res.data.ret === "0") {
          // console.log(res.data)
          this.isFormSaving=false
          this.$emit('close')
          this.$emit('onSave')
            // handle success
          // this.overlay = false;
          this.$swal("Berhasil", "Peminjaman berhasil disubmit", "success");
        }else{
          this.isFormSaving=false
          this.$swal("Gagal", "Peminjaman gagal disubmit", "error");
        }
      })
      .catch(()=>{
        this.isFormSaving=false
      })
    },
    filterArr(arr,filterArr,filterKodektr){
      console.log(arr)
      this.itemDaftarArsipNew = arr.filter(function(item){
        return filterArr.indexOf(item.idArsip) === -1 && item.kodeKantor === filterKodektr;
      })
      // console.log(this.itemDaftarArsipNew)
      this.itemsDaftarArsip = this.itemDaftarArsipNew
    },
    tambahArsip(val,index){
      if(this.itemsFormPengajuan.findIndex((x)=> x.idArsip===val.idArsip)<0) {
        this.itemsFormPengajuan=[val,...this.itemsFormPengajuan]
        this.dataArsip.push({"idArsip" : val.idArsip})
        this.filterItemDaftarArsip.push(val.idArsip)
        this.selectedDocument = true;
        this.kodeKantor = val.kodeKantor;

        this.kodeKantorFilter =true
        this.filterArr(this.itemsDaftarArsip,this.filterItemDaftarArsip,this.kodeKantor)
        // console.log(this.filterItemDaftarArsip,"xxxxxxxxxxxxxxxx")
        // this.itemsDaftarArsip.splice(index,1)
      }else{
         this.$swal("", "sudah dipilih", "error"); 
      }
    },
    delArsip(index){
      this.itemsFormPengajuan.splice(index,1)
      this.dataArsip.splice(index,1)
      console.log(this.dataArsip)
    },
    doSearchFilter(){
      // console.log(this.filter.keyword,this.kodeKantor)
        if(!this.isLovLoading) this.getLovArsip(this.filter.keyword,this.kodeKantor)
    },
    doRefresh(){

    },
    doResetFilter(){

    },
    resetData(){
       this.kodeKantor = ""
       this.kataKunci = ""
       this.filter.keyword = ""
       this.itemsFormPengajuan = [];
       this.itemsDaftarArsip =[];
       this.dataArsip = [];
       this.itemsLovArsip=[];
       this.filterItemDaftarArsip=[];
       this.selectedDocument = false;
       this.kodeKantorFilter =false
    }
  } 
}
const headersFormPengajuan = [
  { text: "No.",  sortable: false, align: 'center' },
  { text: "ID Arsip", value:'ID_ARSIP', sortable: false},
  { text: "Kode Kantor", value:'Kode Kantor', sortable: false},
  { text: "Jenis Arsip", value:'ID_ARSIP', sortable: false},
  { text: "Keterangan", value:'FORM_DATA', sortable: false},
  { text: "aksi",  sortable: false, align: 'center' },
]
const headersLovArsip = [
  { text: "No.",  sortable: false, align: 'center' },
  { text: "ID Arsip", value:'ID_ARSIP', sortable: false},
  { text: "Kode Kantor", value:'Kode Kantor', sortable: false},
  { text: "Jenis Arsip", value:'JENIS_ARSIP', sortable: false},
  { text: "Meta Data", value:'FORM_DATA', sortable: false},
  { text: "",  sortable: false, align: 'center' },
]

</script>
