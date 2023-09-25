<template>
  <v-container fluid>
    <v-row>
      <v-breadcrumbs large :items="breadcrumbItems">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.href">
            {{ item.text.toUpperCase() }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <!-- <v-btn @click="back" class="mr-2" medium outlined color="blue white--text darken-2"> 
          <v-icon class="mr-2" >mdi-arrow-left</v-icon>
        KEMBALI
      </v-btn> -->
    </v-row>
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="6">
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
        <!-- <v-btn-toggle dense>
            <v-btn @click="$refs.pdf.print()"><v-icon>mdi-printer</v-icon></v-btn>
            <v-btn @click="zoom = '50%'">0.5x</v-btn>
            <v-btn @click="zoom = '100%'">1x</v-btn>
            <v-btn :href="pdfViewSrc" target="_blank">View</v-btn>
        </v-btn-toggle> -->
        <v-row class="ma-auto">
          <!-- <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            :rotate="rotate"
            :style="{inline:'',width:zoom}"
          ></pdf> -->
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
        <!-- <v-row class="" v-if="viewMasal">	
              <v-col cols="12" sm="12" md="12">	
                <v-card>	
                    <v-toolbar color="blue" dark>	
                        <v-col cols="5" class="text-left">
                          <v-toolbar-title  cols="5" class="text-h8">Daftar File Massal</v-toolbar-title>	
                        </v-col>
                        <v-col cols="7" class="text-right">	
                          <v-btn	
                            small	
                            color="green"	
                            class="ma-2 white--text"	
                            @click="downloadAll(rows)"	
                          >	
                            Download All	
                            <v-icon	
                              right	
                              dark	
                            >	
                              mdi-cloud-download	
                            </v-icon>	
                          </v-btn>	
                        </v-col>	
                    </v-toolbar>	
                        <v-data-table	
                          :headers="headers"	
                          :items="rows"	
                          :options.sync="options"	
                          :hide-default-footer="false"	
                          :server-items-length="totalData"	
                          :footer-props="{'items-per-page-options':[15,50,100],'show-current-page':true,'show-first-last-page':true}"
                          class="elevation-1"	
                          dense	
                        >	
                          <template v-slot:item="{ item }">	
                            <tr>	
                              <td align="start">	
                                {{ item.no }}.	
                              </td>	
                              <td :class="item.fontStyle">{{ item.noNaskah===null?'-':item.noNaskah }}</td>	
                              <td :class="item.fontStyle">{{ item.tujuan===null?'-':item.tujuan  }}</td>	
                              <td align="center">	
                                <v-btn class="mr-2" color="info" small :href="item.pathUrl" target="_blank" >	
                                      Lihat	
                                </v-btn>	
                              </td>	
                            </tr>	
                          </template>	
                          <template v-slot:footer.prepend>
                            <v-col cols="1">
                                <v-text-field
                                  v-model="options.page"
                                  label="Go to page"
                                  type="number"
                                  min="1"
                                  :max="Math.ceil(totalData/options.itemsPerPage)"
                                  hide-spin-buttons
                                  hide-details
                                  dense
                                ></v-text-field>
                              </v-col>
                          </template>
                        </v-data-table>	
                </v-card>	
              </v-col>	
        </v-row> -->
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6">
        <div style="padding-top:10px;">
        <v-timeline
          v-if="jenisMonitoringNaskah=='NASKAH KELUAR'"
          align-top
          dense
          >
          <v-timeline-item
            v-for="(list, i) in rowsMonitoringNaskah"
            :key="i"
            small
            :color="list.color"
            :icon="list.icon"
            fill-dot
          >
                <div class="py-4 font-weight-black">
                    {{list.namaTl}}
                </div>
                  <div>
                    {{updateStatus(list.namaTl,list.status)}}
                  </div>
                <div>
                    {{list.npk}}
                  <div>
                  {{list.namaUser}}
                  </div>
                  <div v-if="list.keteranganPps=='-'">
                  {{list.namaJabatan}}
                  </div>
                  <div v-if="list.keteranganPps!='-'">
                  {{list.keteranganPps}}
                  </div>
                  <div>
                  {{list.tanggalTl}}
                  </div>
                  <div v-if="kodeJenisNaskah=='NKH0015'">
                  Tujuan :
                  </div>
                  <div v-if="kodeJenisNaskah=='NKH0015'">
                  {{list.tujuan}}
                  </div>
                </div>

          </v-timeline-item>
        </v-timeline>
        <v-card
        v-if="jenisMonitoringNaskah!='NASKAH KELUAR'"
        >
  <v-list three-line>
    <template v-for="(item) in filterByKodeTL">
      <v-subheader
        v-if="item.header"
        :key="item.header"
        v-text="item.header"
      ></v-subheader>
<!-- 
      <v-divider
        v-else-if="item.divider"
        :key="index"
        :inset="item.inset"
      ></v-divider> -->

      <v-list-item
        v-else
        :key="item.title"
      >
        <v-avatar
            color="white"
            size="30"
            class="mx-4 pa-2"
          >
            <v-icon :color="item.color">{{item.icon}}</v-icon>
          </v-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.from"></v-list-item-title>
          <v-list-item-subtitle v-if="item.assignor!='-'" v-text="(item.assignor)"></v-list-item-subtitle>
          <v-list-item-subtitle v-if="item.assignor=='-'" v-text="(item.jabatan)"></v-list-item-subtitle>
          <!-- <v-list-item-subtitle v-if="item.currPosition==undefined" v-text="item.jabatan"></v-list-item-subtitle> -->
          <!-- <v-list-item-subtitle v-if="item.currPosition!=undefined" v-text="item.currPositio.keteranganPpsn"></v-list-item-subtitle> -->
          <v-list-item-subtitle v-text="'Receipt: '+parseDate(item.tanggalTerima)"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="'Sent/Tindak Lanjut: '+parseDate(item.tanggalTl)"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="parseSent(item.to)"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="parsePps(item.keteranganPps)"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="parseMsg(item.keterangan)"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</v-card>
        <!-- <v-timeline
          v-if="jenisMonitoringNaskah!='NASKAH KELUAR'"
          align-top
          dense
          >
          <v-timeline-item
            v-for="(list, i) in rowsMonitoringNaskah"
            :key="i"
            small
            :color="list.color"
            :icon="list.icon"
            fill-dot
          >
                <div class="py-4 font-weight-black">
                    {{list.namaTl}}
                </div>
                  <div>
                    {{updateStatus(list.namaTl,list.status)}}
                  </div>
                <div>
                    {{list.npk}}
                  <div>
                  {{list.namaUser}}
                  </div>
                  <div>
                  {{list.namaJabatan}}
                  </div>
                  <div>
                  {{list.namaUserTerdisposisi}}
                  </div>
                  <div>
                  {{list.keterangan}}
                  </div>
                  <div>
                  {{list.tanggalTl}}
                  </div>
                </div>

          </v-timeline-item>
        </v-timeline> -->
        </div>

      </v-col>
    </v-row> 
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
// import Btn from '../../client/src/views/pages/components/Btn.vue';
import helper from "@/helpers/index";
import pdf from "vue-pdf-signature";

export default {
    middleware: "path",
    components: {
      pdf
    },
    data(){
      return {
        idNaskah: this.$route.params.id,
        kodeJenisNaskah: "",
        jenisMonitoringNaskah: "",
        statusMassal:"",
        viewMasal : false,
        listPps: [],
        filterByKodeTLDisposisi: [],
        filterByKodeTLFeedback: [],
        filterByKodeTLSekretaris: [],
        filterByKodeTL: [],
        rowsMonitoringNaskah:[],
        urlMonitoringNaskah:'',
        dataUser: {},
        noNaskah: "",
        kodeTl: '',
        rows: [],
        pdfViewSrc: "",
        overlay: false,
        options:{	
          page: 1,	
          itemsPerPage:15	
        },
        totalData:0,
        headers: [	
          { text: "No.", value: "no", sortable: false },	
          { text: "Nomor Naskah", value: "noNaskah", sortable: false, },	
          { text: "Tujuan", value: "tujuan", sortable: false, },	
          // { text: "Id Naskah", value: "idNaskah", sortable: false, },	
          { text: "Action", value: "action", sortable: false, align: 'center' }	
          ],

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
        recentPageData:"",
        breadcrumbItems: [
        ],
      }
    },
    
    watch: {
      ketHapus(val){
        if(val.length>=3){
              this.submitPermission = false
          } else {
              this.submitPermission = true
          }
      },
      // "$route.query.f": function () {
      //   this.getInfoNaskahMasal();
      // },
      // options: {
      //   handler() {
      //     this.getInfoNaskahMasal();
      //   },
      // },
      deep: true,
    },
    methods: {
      downloadAll: async function (fulldata) {	
        try {	
          this.overlay = true;	
          let { data } = await this.$axios.post(`/naskah/tr/documentMasal`,	
            {	
                
              data : fulldata	
            }	
          );	
          const byteCharacters = atob(data.zipBase64);	
              const byteArrays = [];	
              for (	
                let offset = 0;	
                offset < byteCharacters.length;	
                offset += 512	
              ) {	
                const slice = byteCharacters.slice(offset, offset + 512);	
                const byteNumbers = new Array(slice.length);	
                for (let i = 0; i < slice.length; i++) {	
                  byteNumbers[i] = slice.charCodeAt(i);	
                }	
                const byteArray = new Uint8Array(byteNumbers);	
                byteArrays.push(byteArray);	
              }	
              const blob = new Blob(byteArrays, { type: "application/zip" });	
              const url = window.URL.createObjectURL(blob);	
              const link = document.createElement("a");	
              link.href = url;	
              link.setAttribute("download", Date.now() + ".zip");	
              document.body.appendChild(link);	
              link.click();	
          this.overlay = false;	
        } catch (error) {	
          this.overlay = false;	
          this.$swal("Error", "Gagal request ke server!", "error");	
          console.log(error.message.toString());	
        }	
      },
      // getInfoNaskahMasal: async function () {	
      // // this.overlay = true; 	
      // // await this.getDataKaryawan();	
      // let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;	
      // const { page, itemsPerPage } = this.options;	
      // this.$axios.post(`/naskah/tr/masal`,{	
      //               page  :page,	
      //               length:itemsPerPage,	
      //               idNaskah    :this.idNaskah	
      //     })	
      //     .then((res)=>{	
      //     console.log(res.data)	
      //     if(res.data.rowCount >=0){	
      //       const items = [];	
      //       let seq = noIndex-1	
      //       console.log(this.filterTab)	
      //       res.data.data.forEach(item => {	
      //         seq++	
      //         items.push({	
      //         no: seq,	
      //         pathUrl: process.env.baseURL2 + "/arsip/pdf?path=" + this.$encrypt(item.namaFile),	
      //         ...item,	
      //         })	
      //       });	
      //        console.log(items)	
          	
      //       this.rows = items	
      //       this.totalData = Number(res.data.rowCount);	
      //     }	
      //     else {	
      //       this.rows = [];	
      //     }	
      //     this.overlay = false;	
      //     this.isLoaded = true;	
      //   })	
      //   .catch((error) => {	
      //     this.rows = [];	
      //     console.error(error);	
      //     this.overlay = false;	
      //     this.isLoaded = true;	
      //     // this.$swal(	
      //     //   "Galat",	
      //     //   "Gagal Request Ke Server",	
      //     //   "error"	
      //     // );	
      //   });	
      // },
      parseTanggalTerima(val){
        return this.$moment(val).format('DD-MM-YYYY') 
      },
      parsePps(val){
        if(val != '-'){
          return val
        } else {
          return ''
        }
      },
      parseSent(val){
        if(val){
          return 'To: '+val
        } else {
          return ''
        }

      },
      parseMsg(val){
        if(val){
          return 'Msg: '+val
        } else {
          return ''
        }

      },
      parseDate(val){
        if(val){
          return this.$moment(val).format('DD/MM/YYYY')
        } else {
          return '-'
        }
        
      },
      updateStatus(namaTl,statusTl){
        if(namaTl == 'PERSETUJUAN PENGONSEP' && statusTl =='Ditolak'){
          return 'Pending'
        } else {
          return statusTl
        }
      },
      async getMonitoringNaskah(){
        
        if(this.jenisMonitoringNaskah=='NASKAH MASUK'){
          this.urlMonitoringNaskah = '/naskah/tr/naskah-masuk'
        } else {
          this.urlMonitoringNaskah = '/naskah/tr/naskah-keluar'
        }
        // console.log('kode kantor')
        // console.log(this.dataUser.kodeKantorRole)
        const params = {
          idNaskah    : this.idNaskah,
          kodeKantor  : this.dataUser.kodeKantorRole,
          npk         : this.dataUser.npk,
          kodeRole    : this.dataUser.kodeRole,
          positionLevel : this.dataUser.positionLevel
        }
        this.overlay = true
        await this.$axios.post(this.urlMonitoringNaskah,params)
        .then((res)=>{
          this.overlay = false
          if(res.data.ret== '0'){
            const items = [];
            let seq = 0;
            res.data.data.forEach(item => {
              seq++
              items.push({
              no: seq,
              ...item,
              tanggalTl: item.tglTl ==null?'-': this.parseDate(item.tglTl),
              // color: item.stTl=='Y' && item.status=='Ditolak'?'red':(item.stTl=='T')?'red':'green',
              // icon:item.stTl=='T'?'mdi-checkbox-blank-circle':(item.status=='Disetujui')?'mdi-checkbox-marked-circle':(item.status=='Ditolak')?'mdi-close-circle':'mdi-checkbox-marked-circle'
              icon:item.status=='Disetujui'?'mdi-checkbox-marked-circle':(item.status=='Ditolak')?'mdi-timer-sand':(item.stTl=='Y')?'mdi-checkbox-marked-circle':'mdi-checkbox-blank-circle',
              color:item.status=='Disetujui'?'green':(item.status=='Ditolak')?'red':(item.stTl=='Y')?'green':'red',
              assignor: item.keteranganPpsPengirim,
              })
              
            });
            console.log('ini dia')
            this.rowsMonitoringNaskah = items
            console.log(this.rowsMonitoringNaskah)

            this.filterByKodeTLSekretaris = this.rowsMonitoringNaskah.filter(item=>item.kodeTl=='TL004').map(item=>({
              jabatan: item.namaJabatan,
              from: item.nama,
              to: item.namaTerdisposisi,
              icon: item.stTl=='Y'?'mdi-checkbox-marked-circle':'mdi-timer-sand',
              tanggalTerima: item.tglTerima,
              tanggalTl: item.tglTl,
              color: item.color,
              statusTl: item.stTl,
              keteranganPps: item.keteranganPps,
              assignor: item.assignor
            }))
            // console.log(this.filterByKodeTLSekretaris)
            if(this.filterByKodeTLSekretaris.length != 0){
              this.filterByKodeTLSekretaris.unshift({
                header: "Sekretaris"
              })
            } else {
              
            }
            this.filterByKodeTLDisposisi = this.rowsMonitoringNaskah.filter(item=>item.kodeTl=='TL003'  && item.npkTerdisposisi != null).map(item=>({
              jabatan: item.namaJabatan,
              from: item.nama,
              to: item.namaTerdisposisi,
              icon: item.stTl=='Y'?'mdi-checkbox-marked-circle':'mdi-timer-sand',
              tanggalTerima: item.tglTerima,
              tanggalTl: item.tglTl,
              color: item.color,
              statusTl: item.stTl,
              keterangan: (item.stTl =='Y' && item.npkTerdisposisi == null) ? item.keteranganFeedback:item.keteranganDisposisi,
              keteranganPps: item.keteranganPps,
              assignor: item.assignor
            }))
            if(this.filterByKodeTLDisposisi.length != 0){
              this.filterByKodeTLDisposisi.unshift({
                header: "Disposisi"
              })
            } else {
              
            }

            this.filterByKodeTLFeddback = this.rowsMonitoringNaskah.filter(item=>item.kodeTl=='TL003' && item.stTl =='Y' && item.npkTerdisposisi == null ).map(item=>({
              jabatan: item.namaJabatan,
              from: item.nama,
              to: item.namaTerdisposisi,
              icon: item.stTl=='Y'?'mdi-checkbox-marked-circle':'mdi-timer-sand',
              tanggalTerima: item.tglTerima,
              tanggalTl: item.tglTl,
              color: item.color,
              statusTl: item.stTl,
              keterangan: (item.stTl =='Y' && item.npkTerdisposisi == null) ? item.keteranganFeedback:item.keteranganDisposisi,
              keteranganPps: item.keteranganPps,
              assignor: item.assignor
            }))
            if(this.filterByKodeTLFeddback.length != 0){
              this.filterByKodeTLFeddback.unshift({
                header: "Feedback"
              })
            } else {
              
            }
            this.filterByKodeTL = this.filterByKodeTLSekretaris.concat(this.filterByKodeTLDisposisi,this.filterByKodeTLFeddback)
          }
          else {
            this.rowsMonitoringNaskah = [];
            this.overlay = false;
            
          }
        })
        .catch((error) => {
          this.rowsMonitoringNaskah = [];
          // console.error(error);
        });

      },
      back(){
        this.$router.push({ path: "/monitoring" });
      },
      async getPdfMonitoringNaskah(){
        this.overlay = true;
        this.$axios
        .get("/naskah/monitoring/" + this.idNaskah )
        .then((response) => {
          this.overlay = false;
          const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path=" 
          + this.$encrypt(response.data.lastFile[0].lastFile);
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
          this.noNaskah = response.data.data[0].noNaskah
          this.pdfViewSrc =naskahUrl
              
          this.getMonitoringNaskah();
          
        })
        .catch((error) => {
          this.overlay = false;
          console.error(error);
          this.$router.push({ path: "/monitoring" });
          this.$swal("Error", "Tidak dapat memuat naskah!", "error");
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
    async created() {
      this.recentPageData = sessionStorage.getItem("recentPage");
      this.breadcrumbItems.push({
                    text: "Monitoring",
                    href: this.recentPageData,
                  })
      console.log(this.recentPageData)
      if (localStorage.hasOwnProperty("authSikd")) {
        var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
        this.dataUser = JSON.parse(dataLoginDecrypted);
        if (this.dataUser.kodeUser == 0) {
          this.$router.push({ path: "/login" });
          this.overlay = false;
        } else if (!this.dataUser.setRole) {
          this.$router.push({ path: "/role" });
          this.overlay = false;
        } else {
          this.kodeUser = this.dataUser.kodeUser;
          if (localStorage.hasOwnProperty("authPage")) {
            var dataPage = helper.decrypt(localStorage.authPage);
            var listPage = JSON.parse(dataPage);
            if(listPage.includes(this.$route.path.split("/")[1])){
              if(this.$route.query.obj){
                let dataObjDecrypted = helper.decrypt(this.$route.query.obj);
                let dataObj = JSON.parse(dataObjDecrypted);
                if(dataObj.jenisMonitoringNaskah && dataObj.kodeJenisNaskah){
                  this.jenisMonitoringNaskah = dataObj.jenisMonitoringNaskah;
                  this.kodeJenisNaskah = dataObj.kodeJenisNaskah;
                  this.statusMassal = dataObj.statusMassal;
                  // if(this.statusMassal == 'Y'){
                  //   this.viewMasal = true
                  //   this.getInfoNaskahMasal()
                  // }
                  this.getPdfMonitoringNaskah()

                  this.breadcrumbItems.push({
                    text: this.jenisMonitoringNaskah,
                    href: "",
                  })
                }else{
                  this.$router.push({ path: "/monitoring" });
                }
              }else{
                this.$router.push({ path: "/monitoring" });
              }
            }else{
              this.$router.push({ path: "/error" });
            }
          }else{
            this.$router.push({ path: "/error" });
          }
        }
      } else {
        this.overlay = false;
        this.$router.push({ path: "/login" });
      }
  },
}
</script>
