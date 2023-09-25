<template>
<div>
      <v-breadcrumbs large :items="breadcrumbItems">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="item.href">
                {{ item.text.toUpperCase() }}
              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
      </v-breadcrumbs>
      <v-col v-show="isLoaded">
        <v-data-table
          dense
          :headers="headers"
          :items="rows"
          :hide-default-footer="false"
          :options.sync="options"
          :server-items-length="totalData"
          :footer-props="{'items-per-page-options':[15,50,100]}"
          class="elevation-1"
        >
        <template v-slot:top>
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              class="text-right d-flex"
            >
            <v-text-field
                v-model="filter.keyword"
                type="text"
                outlined
                clearable
                rounded
                class="pa-2"
                placeholder="Search"
                dense
            >
            <template v-slot:append>
              <v-icon @click="doSearchFilter" class="mr-4">mdi-magnify</v-icon>
              <v-icon @click="doRefresh">mdi-refresh</v-icon>
            </template>
            <template v-slot:prepend-inner>
            <v-menu
                :close-on-content-click="false"
                offset-y
                offset-overflow

            >
              <!--<template v-slot:activator="{ on }">
                 <v-icon v-on="on" left>mdi-arrow-down-drop-circle-outline</v-icon>
              </template>-->
              <v-card
                min-width="400"
              >
                <v-card-text class="pa-6">
              <template>
                <form>
                  <!--<v-text-field
                    v-model="filter.noNaskah"
                    label="Masukkan Kata Kunci Pencarian"

                  />-->
                  <!--<v-select
                    v-model="filter.jenisNaskah"
                    label="Jenis Naskah"
                    :items="itemsJenisNaskah"
                  />
                  <v-select
                    v-model="filter.jenisMonitoringNaskah"
                    label="Jenis Monitoring Naskah"
                    :items="itemsJenisMonitoringNaskah"
                  />-->
                </form>
              </template>
                </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      @click="doResetFilter"
                    >
                      Reset
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="getListApproval"
                    >
                      Search
                    </v-btn>
                  </v-card-actions>
              </v-card>
            </v-menu>
          </template>
            </v-text-field>

            </v-col>
          </v-row>
        </template>
        <template v-slot:item="{ item, index }">
            <tr>
              <td align="center" >
              </td>
              <td v-if="item.stApproval==='Y'">{{ item.no }}.</td> <td v-else class="font-weight-bold">{{ item.no }}.</td>
              <td v-if="item.stApproval==='Y'" >
                        <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <td align="left"
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                              >
                                {{truncate(item.arsipId)}}
                              </td>
                            </template>
                            <span>{{item.arsipId}}</span>
                          </v-tooltip></td>
              <td v-else class="font-weight-bold">
                <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <td align="left"
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                              >
                                {{truncate(item.arsipId)}}
                              </td>
                            </template>
                            <span>{{item.arsipId}}</span>
                          </v-tooltip></td>
              <td v-if="item.stApproval==='Y'">{{ item.namaPengolah==null?'-':item.namaPengolah }}</td> <td v-else class="font-weight-bold">{{ item.namaPengolah==null?'-':item.namaPengolah }}</td>
              <td v-if="item.stApproval==='Y'">{{ item.kodeKantor }}</td><td v-else class="font-weight-bold">{{ item.kodeKantor }}</td>
              <td v-if="item.stApproval==='Y'">{{ item.tglPemindahan==null?'-':item.tglPemindahan}}</td><td v-else class="font-weight-bold">{{ item.tglPemindahan==null?'-':item.tglPemindahan}}</td>
              <td> 
                <v-dialog
                    v-model="menu[index]"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    max-width="800px"
                    @input="closeOutsideMenuStatus"
                  >
                    <template v-slot:activator="{ attrs }">
                      <v-btn
                          color="success"
                          @click="onClickRow(item,index)"
                          icon
                          small
                          v-bind="attrs"
                        >
                          <v-icon left small>
                            mdi-eye
                          </v-icon>
                        </v-btn>
                    </template>
                    <pemindahan-status-view-app :id-pemindahan="item.idPemindahan" v-if="itemOnHoverID===item.ID"/>
                  </v-dialog>     
                  <v-btn v-if="item.stApproval!='Y' && item.stApproval!='T'" icon @click="doApproval(item)"
                    class="mr-2" color="info"  small >
                      <v-icon>mdi-pencil</v-icon>
                  </v-btn>
              </td>
            </tr>
      </template>
     
        </v-data-table>
        <v-dialog v-model="dialog" max-width="700">
          <v-card>
            <v-card-text style="padding-top:20px">
              <strong>Dari</strong> : <br/>
              <div v-if="typeof dari === 'object' && dari !== null && dari.length == 1">{{dari[0].name}}</div>
              <div v-if="typeof dari === 'object' && dari !== null">{{dari.name}}</div>
              <ol v-if="dari.length>1">
                <li v-for="item in dari" :key="item.val">
                  {{item.name}}
                </li>
              </ol>
              <strong>Kepada</strong> : <br/>
              <div v-if="kepada.length==1">{{kepada[0].name}}</div>
              <ol v-if="kepada.length>1">
                <li v-for="item in kepada" :key="item.val">
                  {{item.name}}
                </li>
              </ol>
            </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="340">
          <v-card>
            <v-card-title class="headline">Konfirmasi hapus</v-card-title>
            <v-card-text>Apakah Anda yakin menghapus data yang dipilih?</v-card-text>
          <v-textarea
                v-model="ketHapus"
                outlined
                class="pa-8"
                placeholder="Masukkan Keterangan"
                dense
            >
              </v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="grey" class="mr-2 white--text" @click="closeDelete">Batal</v-btn>
              <v-btn :disabled="submitPermission" color="red" class="mr-2 white--text" @click="deleteData()">Hapus</v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogApproval" max-width="500px">
          <v-card>
              <v-card-title> <v-icon class="mr-4">mdi-pencil</v-icon>
                Proses Approval
              </v-card-title>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                  <v-textarea
                    v-model="Catatan"
                    outlined
                    class="pa-8"
                    placeholder="Masukkan Catatan Approval"
                    dense
                  >
                  </v-textarea>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer/>
                <v-btn
                  color="primary"
                  outlined
                  min-width="100px"
                  @click="closeDialogApproval()"
                >
                  Tutup
                </v-btn>
                  <v-btn
                  :disabled="submitPermission"
                  min-width="100px"
                  color="primary"
                  @click="doProcessApp('Y')"
                >
                  Setuju
                </v-btn>
                 <v-btn
                  :disabled="submitPermission"
                  min-width="100px"
                  color="error"
                  @click="doProcessApp('T')"
                >
                  Tolak
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
      </v-col>
</div>      
</template>

<script>
// import Btn from '../../client/src/views/pages/components/Btn.vue'
import {debounce} from 'lodash';
import helper from "@/helpers/index";

export default {
  props: {
    filterTab: {
      type: String,
      required: true,
      default: null,
    },
  },
    data(){
      return {
        dialog:false,
        dari: [],
        itemTemp:[],
        confirmtext:"",
        confirmtextproses:"",
        breadcrumbItems: [
          {
            text: "Approval Pemindahan Arsip",
            disabled: false,
            href: "",
          },
        ],
        submitPermission:true,
        kepada: [],
        menu:new Array(15).fill(false),
        category: ["SEMUA","CATEGORY"],
        headers: [
          { text: "", value: "jenisMonitoringNaskah", sortable: false },
          { text: "No.", value: "no", sortable: false },
          { text: "ID Arsip", value: "arsipId", sortable: false },
          { text: "Nama Pengolah", value: "namaPengolah", sortable: false },
          { text: "Kode Kantor", value: "kodeKantor", sortable: false },
          // { text: "Status Draft", value: "stDraft", sortable: false },
          { text: "Tgl Pemindahan", value: "tglPemindahan", sortable: false },
          { text: "Action", value: "action", sortable: false }
        ],
        kodeKantorUser: null,
        page: 0,
        numberOfPages: 0,
        dialogDelete: false,
        dialogForm: false,
        dialogApproval:false,
        Catatan:'',
        itemSelected: {},
        itemsJenisNaskah:[],
        itemOnHoverID: null,
        itemsJenisMonitoringNaskah:
        [{
          value:'',
          text:'Semua Jenis Monitoring Naskah'
        },{
          value:'NASKAH MASUK',
          text:'Naskah Masuk'
        },{
          value:'NASKAH KELUAR',
          text:'Naskah Keluar'
        },{
          value:'NASKAH EKSTERNAL',
          text:'Naskah Eksternal'
        }],
        isLoaded: false,
        overlay: true,
        isDebouncing : false,
        rows:[],
        ketHapus:'',
        totalData: 0,
        dataUser: {},
        filter: {
          noNaskah:'',
          jenisNaskah:'',
          keyword:'',
          namatl:'',
          statusTl:'',
          jenisMonitoringNaskah:'',
          noUrut:'',
          kodeTl:'',
          PetugasRekam:''
        },

        options:{
          page: 1,
          itemsPerPage:15
        },
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
      Catatan(val){
        if(val.length>=3){
          this.submitPermission = false
        } else {
          this.submitPermission = true
        }
      },
      "$route.query.f": function () {
        this.getListApproval();
      },
      options: {
        handler() {
          this.getListApproval();
        },
      },
      deep: true,
    },
    methods: {
      cancelHover(){
        if(this.isDebouncing) this.isDebouncing= false
      },
      truncate(input) {
        console.log('input',input)
        if(input != null){
          if (input.length > 5) {
            return input.substring(0, 30) + '...';
          }
        }else{
          return input;
        }
      },
      doRefresh(){
        // console.log('do refresh')
        this.options.page = 1;
        this.doResetFilter();
      },
      doApproval(item){
        this.itemTemp=item
        if(item.stBa=='Y'){
        this.dialogApproval=true
        }else{
          alert("Approval tidak dapat dilakukan, karena Berita Acara belum selesai di tanda tangan elektronik")
        }
      },
      closeDialogApproval(){
        this.Catatan = '';
        this.itemTemp = [];
        this.dialogApproval = false;
      },
      viewDetil(val, index){
        //console.log(val)
        this.itemOnHoverID= val.ID
        this.menu.splice(index, 1, true)
      },
      async doSaveFeedBack(){
        this.overlay = true
        // console.log(this.noUrutTL)
        await this.$axios.put(`/naskah/tr/feedback/${this.idNaskah}`,{
                  petugas: this.dataUser.kodeUser,
                  kode_tl:'TL003',
                  keterangan:this.feedback,
                  npk: this.dataUser.npk,
                  no_urut_tl: this.noUrutTL
              })
              .then((res) => {
                this.overlay = false
                if(res.data.ret==="0"){
                    this.$swal(
                            "Success",
                            "Proses Feedback Berhasil",
                            "success"
                          );
                    this.showBtn = false
                    this.dialogFeedBack = false

                } else {
                        this.$swal(
                            "Galat",
                            "Gagal Simpan Feedback",
                            "error"
                          );
                    this.dialogFeedBack = false
                }
              })
        
      },
      async doProcessApp(st_app){
        console.log(this.Catatan)
        this.overlay = true
        if(st_app=='Y'){
          this.confirmtext="Menyetujui"
          this.confirmtextproses="Persetujuan"
        }else{
          this.confirmtext="Menolak"
          this.confirmtextproses="Penolakan"
        }
        this.$swal({
          title: "Apakah Anda yakin "+this.confirmtext+" pengajuan ini?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$axios.put(`/arsip/approvalPemindahan`,{
                      "id": this.itemTemp.id,
                      "statusApproval": st_app,
                      "npk": this.dataUser.npk,
                      "keterangan":this.Catatan
                })
                .then((res) => {
                  this.overlay = false
                  if(res.data.ret==="0"){
                      this.$swal(
                              "Success",
                              "Proses "+this.confirmtextproses+" Berhasil",
                              "success"
                            );
                      this.showBtn = false
                      this.dialogApproval = false
                      this.getListApproval();
                  } else {
                          this.$swal(
                              "Gagal",
                              "Gagal Simpan Proses Persetujuan",
                              "error"
                            );
                      this.dialogApproval = false
                  }
                })
          }
        });
        
        // console.log(this.noUrutTL)
        
        this.dialogApproval = false;
      },
      parseDate(val){
        if(val){
          if(this.$moment(val) < this.$moment().subtract(1, 'days')) {
            return this.$moment(val).format('DD/MM/YYYY HH:mm')
          } else {
            return this.$moment(val).fromNow()
          }
        } else {
          return '-'
        }
      },
      parseDateOnly(val){
        if(val){
          if(this.$moment(val) < this.$moment().subtract(1, 'days')) {
            return this.$moment(val).format('DD/MM/YYYY')
          } else {
            return this.$moment(val).fromNow()
          }
        } else {
          return '-'
        }
      },
      doResetFilter(){
        //this.filter.namatl = '';
        //this.filter.noNaskah = '';
        this.filter.keyword = '';
        //this.filter.jenisMonitoringNaskah = '';
        //this.filter.jenisNaskah = '';
        this.getListApproval()
      },
      doSearchFilter(){
        this.options.page = 1;
        this.getListApproval();
      },
      doDetilNaskahMonitoring(val){
        const dataobj = {
            'jenisMonitoringNaskah': val.jenisMonitoringNaskah,
            'kodeJenisNaskah': val.kodeJenisNaskah,
        }
        var obj = helper.encrypt(JSON.stringify(dataobj));
        this.$router.push({
            path: '/monitoring/'+val.idNaskah,
            query: {
                obj
            }
        })
      },
      doDetil(dari,ke){
        this.dialog = true;
        this.dari = dari;
        this.kepada = ke;
      },
      deleteItem(item) {
      this.deleteSelected = Object.assign({}, item)
      this.dialogDelete = true
      console.log(this.deleteSelected);
      },
      onHoverRow(val,index){
      this.isDebouncing = true
      this.debounceHover(val,index)
      },
      debounceHover: debounce(function (val,index) {
        if(!this.menu[val]) {
          if(this.isDebouncing){
            this.menu=new Array(this.options.itemsPerPage).fill(false)
            this.showDetilData(val,index)
          }
          this.isDebouncing= false
        }
      }, 500),
      onClickRow(val,index){
        this.isDebouncing = false
        this.viewDetil(val,index)
      },
      closeDelete: async function() {
      this.loader = false
      this.dialogDelete = false
      },
      doDelete: async function () {
      try {
          this.overlay = true;
          var params = {
           idNaskah: this.deleteSelected.idNaskah,
           ketHapus: this.ketHapus,
           noUrut: this.deleteSelected.no,
           kodeTl: "TL006",
           PetugasRekam: this.deleteSelected.petugasRekam
          };
          console.log(params)
          let { data } = await this.$axios.post("/naskah/hapus", params);
          this.result = data;
          console.log(this.result)
          if (this.result.ret == 0) {
            this.overlay = false;
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
    closeOutsideMenuStatus(val){
      if(!val) this.itemOnHoverID= null
    },
    async deleteData(){
      this.overlay = true
      // console.log(this.noUrutTL)
      await this.$axios.post(`/naskah/hapus`,{
           idNaskah: this.deleteSelected.idNaskah,
           ketHapus: this.ketHapus,
           noUrut: this.deleteSelected.no,
           kodeTl: "TL006",
           petugasRekam: this.deleteSelected.petugasRekam
            })
            .then((res) => {
              this.overlay = false
               if(res.data.ret==="0"){
                  this.$swal(
                          "Success",
                          "Data Telah Dihapus",
                          "success"
                        );
                  this.showBtn = false
                  this.dialogDelete = false
                  this.getListApproval();
                  this.ketHapus = '';
               } else {
                      this.$swal(
                          "Galat",
                          "Data gagal dihapus",
                          "error"
                        );
                  this.dialogDelete = false
               }
             })
      
    },
      async getListApproval() {
         //console.log(this.dataUser)
        //this.overlay = true
        console.log(this.filter)
        this.isLoaded = false;
        const { page, itemsPerPage } = this.options;
        let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.$axios.get("/arsip/getListApprovalArsipPemindahan",{
          params:{
              page:page,
              length:itemsPerPage,
              npk: this.dataUser.npk,
              kodeKantor : this.dataUser.kodeKantorRole,
              keyword: this.filter.keyword
          }
        })
        .then((res)=>{
          console.log(res.data.data)
          if(res.data.rowCount >=0){
            const items = [];
            let seq = noIndex-1
            res.data.data.forEach(item => {
              seq++
              items.push({
              no: seq,
              fontWeight: item.stApproval=='null'?'font-weight-regular':item.stApproval=='Y'?'font-weight-bold':'font-weight-regular',
              iconSend: (item.stSend=='D' && item.stBatal=='T')?'mdi-pencil': (item.stSend=='Y'&& item.stBatal=='T') ?'mdi-check': (item.stSend=='Y'&& item.stBatal=='Y') ?'batal' :'mdi-timer-sand',
              ...item,
              })

            });
            // console.log('data here');
            this.rows = items
            // console.log(this.rows)
            this.totalData = Number(res.data.rowCount);
          }
          else {
            this.rows = [];
          }
          this.overlay = false;
          this.isLoaded = true;
        })
        .catch((error) => {
          this.rows = [];
          this.isLoaded = true;
          console.error(error);
        });
      },
    },
    async created(){
      if (localStorage.hasOwnProperty("authSikd")) {
        var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
        this.dataUser = JSON.parse(dataLoginDecrypted);
        if (this.dataUser.kodeUser == 0) {
          this.$router.push({ path: "/login" });
        } else if (!this.dataUser.setRole) {
          this.$router.push({ path: "/role" });
        } else {
          if (localStorage.hasOwnProperty("authPage")) {
            var dataPage = helper.decrypt(localStorage.authPage);
            var listPage = JSON.parse(dataPage);
            if(listPage.includes(this.$route.path.split("/")[1])){
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
                  // console.log('ini dia bro')
                  // console.log(this.itemsJenisNaskah)

                })
                .catch((err) => {
                    // this.overlay = false;
                    console.log(err)
                });
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


    }
  }

</script>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: whitesmoke
}
</style>