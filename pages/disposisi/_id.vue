<template>
  <v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-btn
         @click="recentPage"
          class="mr-2"
          medium
          outlined
          color="blue white--text darken-2"
          > <v-icon
          class="mr-2"
          >
            mdi-arrow-left
            </v-icon>
            KEMBALI
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="pa-5">
              <v-form ref="form" v-model="valid" :lazy-validation="false">
                <v-row>
                  <v-col cols="12" sm="12" md="6" lg="5">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                          <v-btn class="mb-1" text small @click="page > 1 ? page-- : 1">
                            <v-icon small>mdi-arrow-left</v-icon>
                          </v-btn>
                          <v-btn class="mb-1" text small @click="page < pageCount ? page++ : 1">
                            <v-icon small>mdi-arrow-right</v-icon>
                          </v-btn>
                          <v-btn class="ml-8 mb-1" text small @click="openFullPdf()">Full PDF</v-btn>
                          <v-btn disabled class="mb-1" text small>{{page+"/"+pageCount}}</v-btn>
                      </v-col>
                    </v-row>
                    <v-row class="ma-auto">
                      <pdf
                        :src="src"
                        :page="page"
                        @page-size="function (a, b, c) { pageScale=c }"
                        @num-pages="pageCount = $event"
                        @page-loaded="currentPage = $event"
                        @link-clicked="page = $event"
                        :style="{inline:'',width:'100%'}"
                      ></pdf>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="7">
                    <v-col></v-col>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" lg="12">
                        <v-autocomplete
                              ref="filterKaryawanVal"
                              outlined
                              v-model="selectedNpk"
                              :items="dataKaryawan"
                              :item-text="item=>item.name+'-'+item.namaJobtitle"
                              clearable
                              item-value="valKey"
                              return-object
                              dense
                              chips
                              small-chips
                              :label="labelTl"
                              multiple
                          >
                            <template v-slot:prepend-item>
                                <v-list-item
                                  ripple
                                  @click="toggle"
                                >
                                  <v-list-item-action>
                                    <v-icon :color="selectedNpk.length > 0 ? 'indigo darken-4' : ''">
                                      {{ icon }}
                                    </v-icon>
                                  </v-list-item-action>
                                  <v-list-item-content>
                                      Select All
                                  </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-2"></v-divider>
                              </template>
                              <template v-slot:selection="data">
                                <v-chip
                                  v-bind="data.attrs"
                                  :input-value="data.selected"
                                  close
                                  @click="data.select"
                                  @click:close="removeSelectedNPK(data.item)"
                                >
                                  {{ data.item.name }}
                                </v-chip>
                              </template>
                            </v-autocomplete>
                      </v-col>
                    </v-row>
                    <div v-if="this.kodeTl=='TL004'">
                    <div v-for="(users, index) in users" :key="index">
                    <v-row>
                    <v-col cols="12" sm="6" md="9">
                    <v-autocomplete
                      outlined
                      disabled
                      :rules="required"
                      v-model="users.npkDisposisi"
                      :items="dataKaryawan"
                      :item-text="item=>item.name+'-'+item.namaJobtitle"
                      item-value="valKey"
                      clearable
                      return-object
                      :label="labelTl"
                      placeholder="Pilih Nama"
                    >
                    </v-autocomplete>
                    <v-row>
                      <v-checkbox 
                        class="mr-4"
                        id="st_dispo"
                        v-model="users.st_dispo" 
                        hide-details
                        true-value="Y"
                        label="PPS Jabatan"
                      :disabled="disableStPpsJabatan"

                        false-value="T">
                    </v-checkbox>
                    <v-autocomplete
                      for="st_dispo"
                      v-if="users.st_dispo=='T' || users.st_dispo==''"  
                      v-model="users.ppsJabatan"
                      :items="noData"
                      item-text="namaJabatan"
                      item-value="val"
                      disabled
                    ></v-autocomplete>
                    <v-autocomplete
                      for="st_dispo"
                      v-if="users.st_dispo=='Y'"  
                      :rules="required"
                      v-model="users.ppsJabatan"
                      :items="dataJabatan"
                      :disabled="disablePpsJabatan"
                      item-text="namaJabatan"
                      item-value="val"
                      placeholder="Pilih Job Title"
                      label="PPS Jabatan"
                    ></v-autocomplete>
                    </v-row>
                    </v-col>
                        <v-col cols="12" sm="6" md="1">
                          <v-btn color="red darken-1" @click="deleteUser(index)">
                            Del
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                    <v-row>
                    </v-row>
                </div>
                  <div v-else>
                    <div v-for="(users, index) in users" :key="index">
                    <v-row>
                    <v-col cols="12" sm="6" md="6">
                    <v-autocomplete
                      outlined
                      dense
                      :rules="required"
                      v-model="users.npkDisposisi"
                      :items="dataKaryawan"
                      :item-text="item=>item.name+'-'+item.namaJobtitle"
                      item-value="valKey"
                      return-object
                      disabled
                      label="Disposisi Kepada"
                      placeholder="Pilih Nama"
                    >
                    </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-btn  color="red darken-1" @click="deleteUser(index)">
                        Del
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn class="pa-2" v-if="index==0" color="primary darken-1" @click="copyKetDispo(users)">
                        Copy Keterangan
                      </v-btn>
                    </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="10" md="6">
                        <v-textarea
                          outlined
                          :rules="required"
                          v-model="users.ketDisposisi"
                          dense
                          label="Disposisi"
                          placeholder="Isi Disposisi"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="10" md="6">
                        <v-checkbox
                          id="st_dispo"
                          v-model="users.st_dispo" 
                          hide-details
                          dense
                          label="PPS Jabatan"
                          true-value="Y"
                          false-value="T">
                        </v-checkbox>
                        <v-autocomplete
                          for="st_dispo"
                          v-if="users.st_dispo=='T' || users.st_dispo==''"  
                          v-model="users.ppsJabatan"
                          :items="noData"
                          item-text="namaJobtitle"
                          item-value="namaJobtitle"
                          disabled
                          dense
                        ></v-autocomplete>
                        <v-autocomplete
                          for="st_dispo"
                          class="pt-6"
                          v-if="users.st_dispo=='Y'"  
                          :rules="required"
                          v-model="users.ppsJabatan"
                          :items="dataJabatan"
                          item-text="namaJabatan"
                          item-value="val"
                          label="Job Title"
                          placeholder="Pilih Job Title"
                          dense
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-divider class="mb-4"/>
                    </div>
                </div>
                <v-col></v-col><v-col></v-col>
                    <v-btn
                    v-if="this.kodeTl=='TL004'" 
                    style="" color="success darken-1" :disabled="disableDispo || !valid" @click="submit"
                    >Teruskan</v-btn>
                    <v-btn
                    v-if="this.kodeTl=='TL003'" 
                    style="" color="success darken-1" :disabled="disableDispo || !valid" @click="submit"
                    >Disposisi</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { EventBus } from '@/eventBus.js'
import helper from "@/helpers/index";

import pdf from "vue-pdf-signature";

export default {
  middleware: "path",
  components: { pdf },
  watch: { 
    dataKaryawan(valKey){
      if (valKey==[]){
        console.log(valKey)
        this.disabledSelect = true
      } else {
        this.disabledSelect = false
      }
    },
    selectedNpk(val){
      if(val.length>0){
        console.log(val)
        this.showListDispo();
        this.disableDispo = false
      } else {
        this.users = []
        this.disableDispo = true

      }
    }

  },
  data() {
    return {
      labelTl:'',
      disableDispo:true,
      noData: [],
      selectAllListDisposisi: false,
      chooseUnique: false,
      uniqueKetDisposisi: '',
      show: true,
      pdfData: {
        doc: [],
        docDetil: []
      },
      //src: "",
      users: [],
      dataDisposisi: "",
      catatanTable: [],
      dataNaskah: [],
      dataKaryawan: [],
      dataJabatan: [],
      valid: false,
      required: [v => !!v || "Field is required"],
      npk: "",
      keterangan: "",
      status: "",
      overlay: false,
      disabledSelect: true,
      indexTl:'',
      kodeTl:'',
      kodeKantorTl:'',
      ppsPosId:'',
      kodeJenisNaskah:'',
      selectedNpk: [],
      dataObj:[],
      disablePpsJabatan:false,
      disableStPpsJabatan:false,

      //pdf
      numPages: 0,
      rotate: 0,
      currentPage: 1,
      pageCount: 1,
      pageScale: 1,
      zoom: "100%",
      loadedRatio: 0,
      page: 1,
      src: "",
      pdfViewSrc: "",
      recentPageData:""
    };
  },
  async created() {
    this.overlay = true;
    this.recentPageData = sessionStorage.getItem("recentPage");
    //console.log(this.kodeTl)
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = dataUser.kodeUser;
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if(listPage.includes('inbox')){
            if(this.$route.query.obj){
              let dataObjDecrypted = helper.decrypt(this.$route.query.obj);
              this.dataObj = JSON.parse(dataObjDecrypted);
              if(this.dataObj.npk && this.dataObj.kodeTl){
                this.npk = this.dataObj.npk;
                this.kodeTl = this.dataObj.kodeTl;
                this.labelTl = this.kodeTl=='TL004'?'Diteruskan Kepada':'Disposisi Kepada'
                const promise1 = await this.getDataCatatan();
                //const promise2 = await this.getDetailDataKonseptor()
                const promise3 = await this.getDataNaskah()
                const promise4 = await this.getDataKaryawan()
                const promise5 = await this.getListJabatan()
                Promise.all([promise1, promise3, promise4, promise5]).then((values) => {
                    this.overlay = false;
                })
              }else{
                this.$router.push({ path: this.recentPageData });
              }
            }else{
              this.$router.push({ path: this.recentPageData });
            }
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
  computed:{
    selectAllListNPK(){
      return this.selectedNpk.length === this.dataKaryawan.length
    },
    selectSomeListNPK(){
      return this.selectedNpk.length > 0 && !this.selectAllListNPK
    },
    icon () {
        if (this.selectAllListNPK) return 'mdi-close-box'
        if (this.selectSomeListNPK) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
  },
  methods: {
    copyKetDispo(val){
      let ketDispo = val.ketDisposisi;
      this.users.map(item=>{
        item.ketDisposisi = ketDispo
        return{
            ...item
          }
      })
    },

    removeSelectedNPK(item) {
        const index = this.selectedNpk.indexOf(item)
        if (index >= 0) this.selectedNpk.splice(index, 1)
    },
   recentPage: async function(){
      this.$router.push({ path: this.recentPageData });
    },
    toggle () {
        this.$nextTick(() => {
          if (this.selectAllListNPK) {
            this.selectedNpk = []
          } else {
            this.selectedNpk = this.selectedNpk .concat(this.$refs.filterKaryawanVal.filteredItems)
          }
        })
    },
    showListDispo: function () {
        const jumlahData = (this.selectedNpk.length)
        
        for(let i=0;i<jumlahData;i++){
          const items = []
          this.selectedNpk.forEach(item => {
            items.push({
              npkDisposisi: item,
              ketDisposisi: '',
              st_dispo:(this.kodeTl=='TL004' && this.ppsPosId!='T')?'Y':'',
              ppsJabatan:(this.kodeTl=='TL004' && this.ppsPosId!='T')?this.dataJabatan[0].val:''
            })
          });
          this.users = items
          // this.users.push({ npkDisposisi: this.selectedNpk[i].val,ketDisposisi:'',st_dispo:'',ppsJabatan:'' });
        }
        
    },

    deleteUser: function (index) {
        if (index >= 0) this.selectedNpk.splice(index, 1)
    },


    getDataCatatan: async function () {
      const { data } = await this.$axios.get("/naskah/naskah-konseptor-log/"+ this.$route.params.id);
      this.catatanTable = data.data;
    },

    getDataKaryawan: async function() {
      const { data } = await this.$axios.get("/hcis/karyawanDisposisi",{
          params:{
            npk: this.npk,
            kodeTl:this.kodeTl,
            kodeKantorTl:this.kodeKantorTl,
            ppsPosId:this.ppsPosId,
            kodeJenisNaskah:this.kodeJenisNaskah,
            reqJenis :  'DATA'
          }
        });
      console.log('get ata karyawan dan jabatan', data )
      
      if(data.length == 0){
        this.$swal("", data.msg, "error");
      }else{
        this.dataKaryawan = data.data;
      }
    },

    getListJabatan: async function() {
      const { data } = await this.$axios.get("/hcis/getListJabatanDispo",{
          params:{
            npk: this.npk,
            kodeTl:this.kodeTl,
            kodeKantorTl:this.kodeKantorTl,
            ppsPosId:this.ppsPosId,
            kodeJenisNaskah:this.kodeJenisNaskah,
            reqJenis :  'DATA'
          }
        });
      console.log('get data jabatan', data )
      
      if(data.length == 0){
        this.$swal("", data.msg, "error");
      }else{
        this.dataJabatan = data.data;
      }
    },

    getDetailDataKonseptor: async function () {
      const { data } = await this.$axios.get("/naskah/disposisiTl/"+ this.$route.params.id);
       if (data.ret!= 0){
        this.dataDisposisi = ""
      } else {
      this.dataDisposisi = data.data;
      }
      // this.overlay = false;
    },

    getDataNaskah: async function () {
      let dis = this
      this.indexTl = this.dataObj.indexTl
      await this.$axios
      .get("/naskah/detail-disposisi/"+ this.$route.params.id, {
        params:{
          indexTl            : this.indexTl
        }
        })
      .then((response) => {
            var res = response.data.data.filter((item,index) => item.indexTl == dis.indexTl)
            console.log('res',res)
            const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path=" 
            + this.$encrypt(res[0].namaFile);
            this.$axios.get(naskahUrl, {baseURL:null, responseType: "arraybuffer", transformResponse: []})
            .then(async (res) => {
                  this.src = pdf.createLoadingTask({data:res.data});
              if (this.src) {
                this.src.promise.then((pdf) => {
                  this.numPages = pdf.numPages;
                });
              }
            })
            .catch(async (error) => {
              console.error(error)
            });
            this.noUrut = res[0].noUrut
            this.kodeTl = res[0].kodeTl
            this.idNaskah = res[0].idNaskah
            this.npk = res[0].npk
            this.noNaskah = res[0].noNaskah
            this.kodeJenisNaskah = res[0].kodeJenisNaskah
            this.kodeKantorTl = res[0].kodeKantor
            this.ppsPosId = res[0].ppsPosId==''?'T':res[0].ppsPosId
            if(this.kodeTl=='TL004' && this.ppsPosId != 'T'){
              this.disablePpsJabatan=true
              this.disableStPpsJabatan=true
            }
            this.pdfViewSrc =naskahUrl
            

          })
          .catch((error) => {
            console.error(error);
            this.$swal("Error", "Tidak dapat memuat naskah!", "error");
          });
    },
    async submit() {
      this.overlay = true;
      const reqBody = {
        idNaskah: this.idNaskah,
        noUrut: this.noUrut,
        kodeTl: this.kodeTl,
        indexTl: this.indexTl,
        npk:this.npk,
        kodeKantorTl:this.kodeKantorTl,
        listTerdisposisi:this.users,
        petugasRekam: this.kodeUser,
      };
      console.log(reqBody)
      this.$axios({
        url: "/naskah/terdisposisi",
        method: "POST",
        data: reqBody
      })
        .then(response => {
          //console.log(response.data)
          if (response.data.ret == 0) {
            this.overlay = false;
            this.$router.push({ path: this.recentPageData });
            //trigger update notif badges inbox
            //EventBus.$emit('updateNotifBadgesEvent');

            this.$swal("", "Berhasil!", "success");
              
            } else {
            this.overlay = false;
            this.$swal("", "Gagal!"+response.data.msg, "error");
            }
        })
        .catch(error => {
          this.overlay = false;
          if (error.response) {
            this.$swal("Gagal", error.response.data.error, "error");
          } else {
            this.$swal("Galat", "Gagal!", "error");
          }
        });
    },
    openFullPdf () {
       this.$axios.get(this.pdfViewSrc, { baseURL:null, responseType: "blob", transformResponse: [] }        )
          .then(async (res) => {
            // new tab
            var blob = new Blob([res.data], { type: "application/pdf" });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
          })
      .catch(async (err) => {
        console.log(err)
        this.$swal("", "Lihat Full PDF gagal!", "error");
      });
    }
  }
};
</script>
