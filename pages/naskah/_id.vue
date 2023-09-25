<template>
  <v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-btn @click="recentPage" class="mr-2" medium outlined color="blue white--text darken-2" > <v-icon class="mr-2" > mdi-arrow-left </v-icon> KEMBALI </v-btn>
          <v-btn :to="{ path: '/naskah-edit/'+this.idNaskah }"  medium outlined  color="blue white--text darken-2" v-if="(this.kodeTlSelected==='TL001' || this.kodeTlSelected==='TL007') && this.stTl=='T'" >Edit Naskah</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="pa-5">
              <v-form ref="form" v-model="valid" :lazy-validation="false">
                <v-row>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-textarea
                      outlined
                      :rules="required"
                      v-model="keterangan"
                      dense
                      label="Keterangan"
                      placeholder="Isi Keterangan"
                    ></v-textarea>
                    <v-checkbox
                        v-if="!hidePps"
                        class="mr-4"
                        id="st_pps"
                        v-model="st_pps" 
                        hide-details
                        true-value="Y"
                        label="PPS Jabatan"
                        false-value="T">
                    </v-checkbox>
                    <!-- <v-autocomplete
                      v-if="st_pps=='T' || st_pps==''"  
                      v-model="ppsJabatan"
                      :items="noData"
                      item-text="namaJabatan"
                      item-value="val"
                      disabled
                    ></v-autocomplete> -->
                    <v-autocomplete
                      v-if="st_pps=='Y'"  
                      :rules="required"
                      v-model="pps_jabatan"
                      :items="dataJabatan"
                      item-text="namaJabatan"
                      item-value="val"
                      placeholder="Pilih Job Title"
                      label="PPS Jabatan"
                    ></v-autocomplete>
                    <v-radio-group :rules="required" v-model="status">
                      <v-radio
                        label="Disetujui"
                        color="success"
                        value="Y"
                      ></v-radio>
                      <v-radio
                        label="Dikoreksi/ Dikembalikan"
                        color="red"
                        value="T"
                      ></v-radio>
                    </v-radio-group>
                    <v-col></v-col>
                    <v-btn color="success darken-1" :disabled="!valid" @click="submit">Submit</v-btn>
                    <v-col>
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
                        <div style="display:none;">
                          <ejs-documenteditorcontainer 
                            ref='documenteditor' 
                            height='100px' 
                            id='container' 
                            :enableSfdtExport='true'
                            :enableWordExport='true'
                            :enableSelection='true'
                            :enableEditor='true'
                          >
                          </ejs-documenteditorcontainer>
                        </div>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card  elevation="2" outlined>
                    <v-card-title>Catatan Pembuatan Naskah :</v-card-title>
                    <v-card-text>
                    <div>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th scope="col" class="text-left">
                                Date
                              </th>
                              <th scope="col" class="text-left">
                                Status
                              </th>
                              <th scope="col" class="text-left">
                                Catatan
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in catatanTable" :key="item.date">
                              <td>{{ item.tglLog }}</td>
                              <td>{{ item.stLog }}</td>
                              <td>{{ item.keterangan }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                    </v-card-text>
                    </v-card>
                    <v-col></v-col>
                    <v-card  elevation="2" outlined>
                    <v-card-title>Atribut Naskah :</v-card-title>
                    <v-card-text>
                    <div>
                      <v-simple-table>
                        <template v-slot:default>
                          <tbody>
                            <tr v-for="item in penerimaTable" :key="item.date">
                              <td>{{ item.namaAtribut }}</td>
                              <td>{{ item.objectValue }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                    </v-card-text>
                    </v-card>
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

<style>
.annotationLayer {
  border: 1px solid black;
}
</style>

<script>
import { EventBus } from '@/eventBus.js'
import Vue from "vue";
import helper from "@/helpers/index";

import { DocumentEditorContainerPlugin } from '@syncfusion/ej2-vue-documenteditor';
Vue.use(DocumentEditorContainerPlugin)
import pdf from "vue-pdf-signature";

export default {
  middleware: "path",
  components: { pdf },
  data() {
    return {
      hidePps: false,
      show: true,
      pdfData: {
        doc: [],
        docDetil: []
      },
      catatanTable: [],
      penerimaTable: [],
      valid: false,
      required: [v => !!v || "Field is required"],
      keterangan: "",
      status: "",
      overlay: false,
      indexTl:'',
      kodeKantorTl:'',
      users: [],
      ppsPosId:'',
      dataJabatan: [],
      st_pps:'T',
      pps_jabatan:'',
      docx:'',
      formData:'',
      kodeTlSelected: '',
      stTl: '',
      dataObj: [],
      kodeUser: '',
      dataUser: null,

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
      recentPageData:"",
      stMasal:"T",
      jmlApproveNaskah:'0'
    };
  },
  async created() {
    this.overlay = true;
    this.recentPageData = sessionStorage.getItem("recentPage");
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      console.log(229,dataUser)
      console.log(this.recentPageData)
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
        this.overlay = false;
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
        this.overlay = false;
      } else {
        this.kodeUser = dataUser.kodeUser;
        this.dataUser = dataUser
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          console.log(242,listPage)
          if (listPage.includes('inbox')){
            if (this.$route.query.obj){
              let dataObjDecrypted = helper.decrypt(this.$route.query.obj);
              this.dataObj = JSON.parse(dataObjDecrypted);
              console.log(247,dataObjDecrypted)  
              this.kodeTlSelected = this.dataObj.kodeTlSelected ?? ''
              this.stTl = this.dataObj.stTl ?? ''
              this.hidePps = this.dataObj.kodeTl=='TL005'? true : false

              //stTL
              if (this.stTl=='Y') {
                this.$swal("", 'Naskah sudah ditindaklanjuti',"error").then((okay) => {
                  if (okay) { this.$router.push("/inbox"); }
                });
                return
              }

              //auth
              const checkNpkTl = await this.$axios.get('/naskah/tl/'+this.$route.params.id)
              const arrCheckNpkTl = checkNpkTl.data.data.map(person => (person.npk.trim()));
              // console.log('auth:',arrCheckNpkTl, this.dataUser.npk)
              if (!arrCheckNpkTl.includes(this.dataUser.npk) ) {
                this.$swal("", 'Tidak memiliki akses tindak lanjut',"error").then((okay) => {
                  if (okay) { this.$router.push("/inbox"); }
                });
                return
              }
              console.log(checkNpkTl.data, checkNpkTl.data.data[0].jmlApproveNaskah,'xxxxx')
              this.jmlApproveNaskah = checkNpkTl.data.data[0].jmlApproveNaskah

              const promise1 = await this.getDataCatatan()
              const promise2 = await this.getDataNaskah()
              const promise3 = await this.getListPenerima()
              Promise.all([promise1, promise2, promise3]).then((values) => {
                this.overlay = false;
              })
            } else{
              this.$router.push({ path: "/inbox" });
            }
          } else{
            this.$router.push({ path: "/error" });
          }
        } else {
          this.$router.push({ path: "/error" });
        }
        
      }
    } else {
      this.overlay = false;
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    recentPage: async function(){
      this.$router.push({ path: this.recentPageData });
    },
    getDataCatatan: async function () {
      const { data } = await this.$axios.get("/naskah/naskah-konseptor-log/"+ this.$route.params.id);
      this.catatanTable = data.data;
       console.log(this.catatanTable);
    },
    getListPenerima: async function () {
      const { data } = await this.$axios.get("/naskah/naskah-konseptor-info/"+ this.$route.params.id);
       this.penerimaTable = data.data;
    },
    getDataNaskah: async function () {
      let self = this
      this.indexTl = this.dataObj.indexTl
      this.$axios
      .get("/naskah/detail/"+ this.$route.params.id, {
        params:{
          indexTl            : this.indexTl
        }
      })
      .then((response) => {
        let res = response.data.data.filter((item,index) => item.indexTl == self.indexTl)
        let dataNaskah = res[0]
        // console.log('auth:',dataNaskah, this.indexTl, this.dataUser)
        this.stMasal = dataNaskah.stMasal
        //auth
        if ( this.indexTl!=dataNaskah.indexTl 
            && this.dataUser.npk!=dataNaskah.npk  
            && this.dataUser.kodeKantorRole!=dataNaskah.kodeKantor
          ) {
          this.$swal("", 'Tidak memiliki akses naskah',"error").then((okay) => {
            if (okay) { this.$router.push("/inbox"); }
          });
          return
        }
        if (dataNaskah.stTl == 'Y') {
          this.$swal("", 'Naskah sudah ditindak lanjut',"error").then((okay) => {
            if (okay) { this.$router.push("/inbox"); }
          });
          return
        }
        const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path=" 
        + this.$encrypt(dataNaskah.namaFile);
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
        this.kodeJenisNaskah = dataNaskah.kodeJenisNaskah
        this.noUrut = dataNaskah.noUrut
        this.kodeTl = dataNaskah.kodeTl
        this.idNaskah = dataNaskah.idNaskah
        this.npk = dataNaskah.npk
        this.noNaskah = dataNaskah.noNaskah
        this.kodeKantorTl= dataNaskah.kodeKantor
        this.formData = dataNaskah.formData
        this.pdfViewSrc = naskahUrl
        this.getListJabatan()
        //sfdt
        this.$refs.documenteditor.ej2Instances.documentEditor.open(res[0].sfdt);
      })
      .catch((error) => {
        console.error(error);
        this.$swal("Error", "Tidak dapat memuat naskah!", "error");
      });
    },
    getListJabatan: async function () {
      const { data } = await this.$axios.get("/hcis/getListJabatan",{
        params:{
          filterIsi:this.kodeKantorTl+'|(1,2)',
          filterColumn:'UNIT_KANTOR|POSITION_LEVEL_RANK',
        }
      });
      // console.log(data.data, 'YYYYYYYY')
      this.dataJabatan = data.data;
      this.overlay = false;
    },
    approvalKonseptor: async function () {
      try {
          this.overlay = true;
          const id = this.editedItem.id
          var params = {
            idNaskah: this.idNaskah,
            noUrut: this.noUrut,
            kodeTl: this.kodeTl,
            npk:this.npk,
            stApproval: this.status,
            keterangan: this.keterangan,
            petugasUbah: this.kodeUser 
          };
          //console.log(params)
          let { data } = await this.$axios.put("/naskah/naskah-konseptor", params);
          this.result = data;
          //console.log(this.recentPageData)
          if (this.result.ret == 0) {
            this.overlay = false;
        
           if (this.recentPageData!=null){
            this.$router.push({ path: this.recentPageData });
            } else {
               this.$router.push({ path: "/inbox" });
            }
            this.$swal("", "Proses Berhasil.", "success");
            } else {
            this.overlay = false;
            this.$swal("", this.result.msg, "error");
            }
          
      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },
    async submit() {
      this.overlay = true
      let self = this
      function getDocx() {
        return new Promise((resolve, reject) => {
            self.$refs.documenteditor.ej2Instances.documentEditor.saveAsBlob('Docx').then( (blob) => {
              let reader = new FileReader()
              reader.readAsDataURL(blob)
              reader.onloadend = () => resolve(reader.result)
            })
        })
      }
          
      const reqBody = {
        idNaskah: this.idNaskah,
        noUrut: this.noUrut,
        kodeTl: this.kodeTl,
        npk:this.npk,
        stApproval: this.status,
        keterangan: this.keterangan,
        petugasUbah: this.kodeUser,
        kodeKantorTl : this.kodeKantorTl,
        ppsJabatan : this.pps_jabatan||'',
        stPps : this.st_pps,
        docx : await getDocx(),
        formData: this.formData,
        stMasal : this.stMasal
      };
      let url = '/naskah/approve2'
      if(this.stMasal == 'Y' && this.status == 'Y' && (this.kodeTl == 'TL001' || this.kodeTl == 'TL007') && this.jmlApproveNaskah == '1'){
        url = '/naskah/approve2Masal'
      }
      this.$axios({
        url: url,
        method: "POST",
        data: reqBody,
        baseURL:process.env.baseURL2
      })
        .then(response => {
          //console.log(response);
          //console.log(this.recentPageData);
          if (response.data.ret == 0) {
            this.overlay = false;
            if (this.recentPageData!=null){
            this.$router.push({ path: this.recentPageData });
            } else {
               this.$router.push({ path: "/inbox" });
            }
            // trigger update notif badges inbox
            //EventBus.$emit('updateNotifBadgesEvent');
            this.$swal("", response.data.msg, "success");
            } else {
            this.overlay = false;
            this.$swal("", response.data.msg, "error");
            }
        })
        .catch(error => {
          this.overlay = false;
          if (error.response) {
            this.$swal("Gagal", error.response.data.error, "error");
          } else {
            this.$swal("Galat", "Persetujuan Konseptor Naskah gagal!", "error");
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
