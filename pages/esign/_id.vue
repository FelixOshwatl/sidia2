<template>
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
        <v-breadcrumbs large :items="breadcrumbItems">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="item.href">
                {{ item.text.toUpperCase() }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="8">
        <v-card>
          <v-card-text>
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
            <pdf
              :src="src"
              :page="page"
              @page-size="function (a, b, c) { pageScale=c }"
              @num-pages="pageCount = $event"
              @page-loaded="currentPage = $event"
              @link-clicked="page = $event"
            ></pdf>
            <v-text-field
              v-model.number="page"
              type="number"
              :min="1"
              :max="pageCount"
              style="width: 5em"
              outlined
              dense
              class="pt-2"
            />
            <input v-model.number="pageScale" type="hidden" id="pageScale" />
            <input v-model="imageTtdBase64" type="hidden" id="imageTtdBase64" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xs="12" sm="12" md="6" lg="4">
        <v-card>
          <v-tabs v-model="tab" background-color color="success" center-active grow>
            <!-- <v-tab>Invisible</v-tab> -->
            <!-- <v-tab v-if="nik && imageTtdBase64">QR Data</v-tab> -->
            <!-- <v-tab>Visible</v-tab> -->
            <v-tab>E-Sign</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <!-- <v-tab-item>
              <v-card flat>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-col >
                    <v-btn
                      :disabled="!nik"
                      color="success darken-1"
                      block
                      @click="openDialog('1')"
                    >Tandatangan</v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-tab-item> -->
            <!-- <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row class="pa-0">
                    <v-col cols="12">
                      <v-checkbox
                        v-model="cbPps"
                        label="Pps"
                        hide-details
                        @change="inPps=''"
                      ></v-checkbox>
                      <v-autocomplete class="pt-2"
                        outlined
                        dense
                        v-model="inPps"
                        v-show="cbPps"
                        :items="ppsItems"
                        label="Pps Jabatan"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        :min="1"
                        type="number"
                        v-model.number="page"
                        dense
                        :max="src?pageCount:1"
                        label="Page"
                        id="inputPage"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-btn
                        color="default"
                        block
                      @click="clearTtd"
                    >Clear</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="width"
                        dense
                        label="Upper-Right X"
                        id="inputWidth"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="height"
                        dense
                        label="Upper-Right Y"
                        id="inputHeight"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="xAxis"
                        dense
                        label="Lower-Left X"
                        id="inputX"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="yAxis"
                        dense
                        label="Lower-Left Y"
                        id="inputY"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-col>
                    <v-btn
                      :disabled="!nik"
                      color="success darken-1"
                      block
                      @click="openDialog('3')"
                    >Tandatangan</v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-tab-item> -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row class="pa-0">
                    
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        :min="1"
                        type="number"
                        v-model.number="page"
                        dense
                        :max="src?pageCount:1"
                        label="Page"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-btn color="default" block @click="cancelSign('4')">Batalkan</v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="cbPps"
                        label="Pps"
                        hide-details
                        @change="inPps='';ppsChange();"
                      ></v-checkbox>
                      <v-autocomplete class="pt-2"
                        outlined
                        dense
                        v-model="inPps"
                        v-show="cbPps"
                        :items="ppsItems"
                        label="Pps Jabatan"
                        @change="ppsChange"
                      />
                    </v-col>
                    <!-- <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="width"
                        dense
                        label="Width"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="height"
                        dense
                        label="Height"
                        hide-details
                      />
                    </v-col> -->
                    <v-col cols=12>
                      <v-img max-width="200" :src="'data:image/png;base64,'+imageTtdBase64"></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="pa-1">
                  <v-col>
                    <v-btn
                      :disabled="!nik"
                      color="success darken-1"
                      block
                      @click="openDialog('4')"
                    >Tandatangan</v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <div class="text-center justify-center">
            <img alt="BSRE" src="/logo_bsre.png" style="margin-bottom:4px;" />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline grey lighten-2 center">
          Passphrase
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <form @submit.prevent="sign">
                  <v-text-field
                    autocomplete="off"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPass = !showPass"
                    :type="showPass ? 'text' : 'password'"
                    v-model="passphrase"
                    :rules="rules.password"
                    color="success"
                    label="Passphrase"
                    prepend-icon="mdi-account-lock"
                  ></v-text-field>
                </form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default darken-1" text @click="dialog = false">
            Tutup
          </v-btn>
          <v-btn color="success darken-1"  @click="sign" :disabled="!passphrase || passphrase===''">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cancelDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline grey lighten-2 center">
          Pembatalan Naskah
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                v-model="ketBatal"
                :rules="rules.ketBatal"
                > <template v-slot:label> Keterangan Batal*
                </template>
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*wajib diisi</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default darken-1" text @click="cancelDialog = false">
            Tutup
          </v-btn>
          <v-btn color="error darken-1"  @click="batalNaskah" :disabled="!ketBatal || ketBatal===''">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
.annotationLayer {
  border: 1px solid black;
}
</style>
<script>
import { EventBus } from '@/eventBus.js'
import Vue from 'vue'
import VueMask from 'v-mask'
Vue.use(VueMask)
import pdf from "vue-pdf-signature";
import helper from "@/helpers/index";

export default {
  components: { pdf },
  data() {
    return {
      files: [],
      tab: 1,
      overlay: false,
      petugas: "",

      breadcrumbItems: [
        {
          text: "E-sign",
          disabled: false,
          href: "/esign/",
        },
        {
          text: "Naskah",
          disabled: true,
          href: "",
        },
      ],
      rules: {
        password: [
          (val) =>
            (val || "").length > 0 || "Kata sandi passphrase harus dimasukkan",
        ],
        ketBatal: [
          (val) =>
            (val || "").length > 0 || "Keterangan batal harus diisi",
        ],
      },
      src: "",
      pdfViewSrc: "",
      zoom: "100%",
      loadedRatio: 0,
      //page: 0,
      numPages: 0,
      rotate: 0,
      currentPage: 0,
      pageCount: 0,
      pageScale: 1,
      dialog: false,
      cancelDialog:false,
      showPass: false,
      //selectedVisual: "1",
      cbPps: false,
      inPps:'',
      ppsItems: [],

      idNaskah: "",
      lastFile: "",
      stMasal:"T",
      fileBase64: "",
      imageTtdBase64: "",
      npk: "",
      kodeUser: "",
      kodeKantorUser: "",
      kodeKantorInduk: "",
      nik: "",
      idTl:"",
      passphrase: "", //"Bsr3mantap",
      ketBatal: "",
      page: 1,
      linkQR: "http://bpjsketenagakerjaan.go.id",
      width: 100,
      height: 100,
      xAxis: 0,
      yAxis: 0,
      tagKoordinat: '#',
      tagItems: [
          { value:'#',text:'#'},
          { value:'£',text:'£'},
          { value:'€',text:'€'},
          { value:'¢',text:'¢'},
          { value:'¥',text:'¥'},
          { value:'§',text:'§'},
        ],
      indexTtd:"1",
      msgArsip:"",
      recentPageData:""
    };
  },
  created: async function () {
     this.recentPageData = sessionStorage.getItem("recentPage");
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
          if(listPage.includes("esign")){
            this.npk = dataUser.npk;
            this.kodeUser = dataUser.kodeUser;
            this.kodeKantorUser = dataUser.kodeKantorRole;
            this.kodeKantorInduk = dataUser.kodeKantorIndukRole;

            this.idTl = this.$route.params.id

            this.overlay = true;

            this.$axios
              .get("/esign/nik", { params: {npk:dataUser.npk} } )
              .then((response) => {
                console.log("NIK: " + response.data.data[0].nik);
                this.nik = response.data.data[0].nik;
              })
              .catch((error) => {
                console.error(error);
                this.$swal("Error", "NIK tidak ditemukan!", "error").then(okay => {
                  if (okay) {
                    this.$router.push('/inbox');
                  }
                });
              });
            this.$axios
              .get("/naskah/" + this.$route.params.id )
              .then((response) => {
                this.lastFile = response.data.lastFile[0].lastFile
                this.stMasal = response.data.data[0].stMasal
                const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path=" + this.$encrypt(this.lastFile)
                this.pdfViewSrc = naskahUrl;
                console.log(naskahUrl)

                this.$axios.get(naskahUrl, {baseURL:null, responseType: "arraybuffer", transformResponse: []})
                .then(async (res) => {
                  this.src = pdf.createLoadingTask({data:res.data});
                  if (this.src) {
                    this.src.promise.then((pdf) => {
                      this.numPages = pdf.numPages;
                    });
                  }
                  this.fileBase64 = Buffer.from(res.data, 'binary').toString('base64')
                })
                .catch(async (error) => {
                  console.error(error)
                });
            
                console.log(response)
                this.idNaskah = response.data.data[0].idNaskah
                this.kodeTl = response.data.tlDetil[0].kodeTl
                this.noUrut = response.data.tlDetil[0].noUrut
                this.stTl = response.data.data[0].stTl

                switch (response.data.data[0].kodeJenisNaskah) {
                  case 'NKH021':
                  case 'NKH022':
                  case 'NKH026':
                  case 'NKH027':
                    if (this.noUrut==1) {
                      this.tagKoordinat = '#'
                    } else if (this.noUrut==2) {
                      this.tagKoordinat = '$'
                    } else if (this.noUrut==3) {
                      this.tagKoordinat = '%'
                    } else if (this.noUrut==4) {
                      this.tagKoordinat = '&'
                    } else if (this.noUrut==5) {
                      this.tagKoordinat = '!' 
                    } else if (this.noUrut==6) {
                      this.tagKoordinat = '@'
                    } else if (this.noUrut>6) {
                      this.$swal("Error", "Saat ini SIDIA belum mendukung TTD >6!", "error");
                    }  
                    break;
                  case 'NKH0023':
                    if (this.noUrut==1) {
                      this.tagKoordinat = '€'
                    } else if (this.noUrut==2) {
                      this.tagKoordinat = '#'
                    } else if (this.noUrut==3) {
                      this.tagKoordinat = '£'
                    } else if (this.noUrut==4) {
                      this.tagKoordinat = '¢'
                    } else if (this.noUrut==5) {
                      this.tagKoordinat = '§' 
                    } else if (this.noUrut==6) {
                      this.tagKoordinat = '¥'
                    } else if (this.noUrut>6) {
                      this.$swal("Error", "Saat ini SIDIA belum mendukung TTD >6!", "error");
                    } 
                    break;
                  default:
                    if (this.noUrut==1) {
                      this.tagKoordinat = '#'
                    } else if (this.noUrut==2) {
                      this.tagKoordinat = '€'
                    } else if (this.noUrut==3) {
                      this.tagKoordinat = '£'
                    } else if (this.noUrut==4) {
                      this.tagKoordinat = '¢'
                    } else if (this.noUrut==5) {
                      this.tagKoordinat = '§' 
                    } else if (this.noUrut==6) {
                      this.tagKoordinat = '¥'
                    } else if (this.noUrut>6) {
                      this.$swal("Error", "Saat ini SIDIA belum mendukung TTD >6!", "error");
                    } 
                    break;
                }

                this.ppsChange()
              })
              .catch((error) => {
                console.error(error);
                this.$swal("Error", "Tidak dapat memuat naskah!", "error");
              });
            
            /*
            Pengkondisian tidak bisa PPS Dirut untuk sementara semua unit dibuka untuk pps seluruh pejabat kantor pusat
            */

            // this.$axios.get("/hcis/getListJabatan?filterColumn=unit_kantor&filterIsi=" + dataUser.kodeKantor )
            //   .then((response) => {
            //     let arr=[]
            //     response.data.data.forEach(el => {
            //       arr.push({ value:el.namaJabatan, text:el.namaJabatan })
            //     })
            //     this.ppsItems=arr
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
            if(this.kodeKantorInduk == 'P'){ // KONDISI KANTOR PUSAT
              this.$axios.get("/hcis/getListJabatan?filterColumn=KELAS|POSITION_LEVEL_RANK&filterIsi=PUSAT|(1,2)" )
                .then((response) => {
                  let arr=[]
                  response.data.data.forEach(el => {
                    arr.push({ value:el.namaJabatan, text:el.namaJabatan })
                  })
                  this.ppsItems=arr
                })
                .catch((error) => {
                  console.error(error);
                });

              this.overlay = false;

            }else if(this.kodeKantorInduk == ''){ // KONDISI TIDAK MENDAPATKAN KANTOR INDUK
               this.$axios.get("/hcis/getListJabatan?" )
                .then((response) => {
                  let arr=[]
                  response.data.data.forEach(el => {
                    arr.push({ value:el.namaJabatan, text:el.namaJabatan })
                  })
                  this.ppsItems=arr
                })
                .catch((error) => {
                  console.error(error);
                });

              this.overlay = false;
            }else{ // UNTUK KANTOR DAERAH
               this.$axios.get("/hcis/getListJabatan?filterColumn=KELAS|UNIT_KANTOR&filterIsi=!PUSAT|"+this.kodeKantorUser)
                .then((response) => {
                  let arr=[]
                  response.data.data.forEach(el => {
                    arr.push({ value:el.namaJabatan, text:el.namaJabatan })
                  })
                  this.ppsItems=arr
                })
                .catch((error) => {
                  console.error(error);
                });

              this.overlay = false;
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
  methods: {
    recentPage: async function(){
      this.$router.push({ path: this.recentPageData });
    },
    ppsChange() {
      const self = this
      this.$axios
        .get("/esign/image",
        {
          params: { npk:this.npk, pps:this.inPps, kodeKantor:this.kodeKantorUser, idNaskah:this.idNaskah } ,
          responseType: "arraybuffer"
        })
        .then((response) => {
          let b64 = Buffer.from(response.data, "binary").toString("base64");
          this.imageTtdBase64 = b64

          let myImage = new Image()
          myImage.src = 'data:image/png;base64,'+b64
          myImage.onload = function() {
            self.width = 120
            self.height = Math.ceil( 120 / (this.width/this.height))
            return true
          }
          return true
        })
        .catch((error) => {
          console.error(error);
          return false
        });
    },
    changeImg(file) {
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load", function () {
          self.imageTtdBase64 = reader.results;
        }, false
      );
      if (file) reader.readAsDataURL(file);
    },
    clearTtd() {
      const currentPage = this.page;
      this.width = 0;
      this.height = 0;
      this.xAxis = 0;
      this.yAxis = 0;
      this.page = 0;
      this.$nextTick().then(() => {
        this.page = currentPage;
      })
    },
    openDialog(index){
      this.indexTtd=index
      this.dialog=true
    },
    cancelSign(index){
      this.indexTtd=index
      this.cancelDialog=true
    },
    arsipkan(){
      this.$axios.post('/arsip/uploadArsipEkores',
      {
        idNaskah: this.idNaskah, 
        petugas: this.kodeUser
      })
      .then((res)=>{
          console.log(res.data)
          if (res.data.ret=='0') {
            this.msgArsip = res.data.msg
          } else {
            this.msgArsip = ''
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    batalNaskah(){
      this.$axios.post('/naskah/batal',
      {
        idNaskah: this.idNaskah, 
        petugasRekam: this.kodeUser,
        ketBatal: this.ketBatal, 
        noUrut: this.noUrut, 
        kodeTl: this.kodeTl
      })
      .then((res)=>{
          console.log(res.data)
          if (res.data.ret=='0') {
            this.overlay = false;
            this.$swal("", "Data berhasil dibatalkan", "success");
            this.$router.push({ path: this.recentPageData });
          } else {
            this.overlay = false;
            this.$swal("", "Data gagal dibatalkan", "error");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async sign() {
      if(!this.passphrase) return;

      this.overlay = true;

      let reqBody = {
        fileBase64: this.fileBase64,
        imageTtdBase64: this.imageTtdBase64,
        npk: this.npk,
        nik: this.nik,
        passphrase: this.passphrase,
        page: this.page,
        width: this.width,
        height: this.height,
        tagKoordinat: this.tagKoordinat,

        idNaskah: this.idNaskah,
        lastFile: this.lastFile,
        kodeTl: this.kodeTl,
        noUrut: this.noUrut,
        stTl: 'Y',
        petugas:this.kodeUser,
        stMasal:this.stMasal
      };

      if ( imageTtdBase64=='' && (this.indexTtd==3 || this.indexTtd==4) ) {
        this.overlay = false;
        this.dialog=false;
        this.passphrase="";
        this.$swal("", "Data tanda tangan tidak ditemukan!", "info");
        return;
      }
      let url = '/esign/upload-naskah'
      if(this.stMasal == 'Y'){
        url = '/esign/upload-naskah-masal'
      }
      this.$axios({
        url: url,
        method: 'POST',
        data: reqBody
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.ret=='0') {
          if(this.stMasal != 'Y'){
            if(response.data.jmlbelumttd =='0'){
              this.arsipkan()
            }
          }
          this.overlay = false;
          this.dialog=false;
          this.passphrase="";
          this.$swal("", response.data.msg, "success").then(okay => {
            if (okay) {
              this.$router.push({ path: this.recentPageData });
              //trigger update notif badges inbox
              //EventBus.$emit('updateNotifBadgesEvent');
            }
          });
        } else {
          this.overlay = false;
          this.dialog=false;
          this.passphrase="";
          if (response.data.msg && response.data.msg.error) {
            if (response.data.msg.img) {
              console.log(response.data)
              this.$swal({
                icon: 'error',
                html:
                  `<p>${response.data.msg.error}</p><img style="width: 100%; margin-left: auto; margin-right: auto;" src='${response.data.msg.img}'/>`,
                width: 900,
              });
            } else {
              this.$swal("", response.data.msg.error, "error");
            }
          } else {
            this.$swal("", "Tandatangan elektronik gagal!", "error");
          }
        }
      })
      .catch((error) => {
        this.overlay = false;
        this.dialog=false;
        this.passphrase="";
        if (error.response) {
          this.$swal("Gagal", error.response.data.error, "error");
        } else {
          this.$swal("", "Proses tandatangan elektronik gagal!", "error");
        }
      });
    },
    async disapprove() {
      this.$swal({
        title: "Tolak/Kembalikan",
        input: "text",
        inputPlaceholder: "Keterangan",
        inputAttributes: {
          maxlength: 128,
          required: "required",
          autocapitalize: "off",
          autocorrect: "off",
          autocomplete: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Batal",
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          this.overlay = true;
          this.$axios({
            url: '/naskah/disapprove',
            method: 'POST',
            data:  {
              petugas: this.kodeUser,
              keterangan: login,
              idNaskah: this.idNaskah,
              noUrut: this.noUrut,
              kodeTl: this.kodeTl,
              npk: this.npk,
              idTl: this.idTl
            }
          })
            .then((response) => {
              if (response.data.ret === "0") {
                  this.overlay = false;
                  this.$swal("", "Naskah berhasil dikembalikan!", "success").then(okay => {
                    if (okay) {
                      this.$router.push({ path: this.recentPageData });
                    }
                  });
              } else {
                this.overlay = false;
                this.$swal("",  "Proses gagal!","error");
              }
            })
            .catch((error) => {
              this.overlay = false;
              if (error.response) {
                this.$swal("Galat", error.response.data.error, "error");
              } else {
                this.$swal("",  "Proses gagal!","error");
              }
            });
        },
        allowOutsideClick: () => !this.$swal.isLoading(),
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
  },
};
</script>