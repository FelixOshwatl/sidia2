<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="!isLoaded">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col v-show="isLoaded">
        <v-tabs v-model="tab" background-color="none" left>
              <!-- <v-tab>All</v-tab> -->
              <v-tab>Draft</v-tab>
              <!-- <v-tab>Koreksi</v-tab> -->
              <v-tab>Koreksi
                <v-badge
                v-if = "item.notifKoreksi"
                  bordered
                  color="success"
                  :content="item.notifKoreksi"
                    >
                </v-badge>
              </v-tab>
              <v-tab>Terkirim</v-tab>
              <v-tab>Batal</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <!-- <v-tab-item class="2">
              <monitoring :filterTab="all"></monitoring>
          </v-tab-item> -->
          <v-tab-item class="2">
              <monitoring :filterTab="draft"></monitoring>
          </v-tab-item>
          <v-tab-item class="2">
              <monitoring :filterTab="koreksi"></monitoring>
          </v-tab-item>
          <v-tab-item class="2">
              <monitoring :filterTab="terkirim"></monitoring>
          </v-tab-item>
          <v-tab-item class="2">
              <monitoring :filterTab="batal"></monitoring>
          </v-tab-item>
        </v-tabs-items>
        
        
      </v-col>
    </v-row>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
// import Btn from '../../client/src/views/pages/components/Btn.vue'
import { EventBus } from '@/eventBus.js';
import monitoring from "~/components/monitoring";
import helper from "@/helpers/index";

export default {
    data(){
      return {
        tab: 0,
        all:"all",
        draft:"draft",
        koreksi:"koreksi",
        terkirim:"terkirim",
        batal:"batal",
        memoEksternal: "NKH0002",
        memoInternal:"NKH0001",
        suratBiasa:"NKH0016",
        suratMasuk:"NKH0015",
        suratRahasia:"NKH0017",
        dialog:false,
        dari: [],
        submitPermission:true,
        kepada: [],
        category: ["SEMUA","CATEGORY"],
        headers: [
          { text: "", value: "jenisMonitoringNaskah", sortable: false },
          { text: "No.", value: "no", sortable: false },
          { text: "No. Naskah", value: "noNaskah", sortable: false },
          { text: "Jenis Naskah", value: "namaJenisNaskah", sortable: false },
          { text: "Perihal", value: "perihal", sortable: false },
          // { text: "Status Draft", value: "stDraft", sortable: false },
          { text: "Status", value: "stSend", sortable: false },
          { text: "Terakhir Diperbarui", value: "lastUpdated", sortable: false },
          { text: "Action", value: "action", sortable: false }
        ],
        item:[],
        kodeKantorUser: null,
        page: 0,
        numberOfPages: 0,
        dialogDelete: false,
        dialogForm: false,
        itemSelected: {},
        itemsJenisNaskah:[],
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
        isLoaded: true,
        overlay: false,
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
    "$route.query.f": function () {
      this.getBadgeTabMonitoring();
    },
      ketHapus(val){
        if(val.length>=3){
              this.submitPermission = false
          } else {
              this.submitPermission = true
          }
      },
      options: {
        handler() {
        this.getBadgeTabMonitoring();
          this.getListNaskah();
        },
      },
      deep: true,
    },
    components: {
     monitoring
    },
    mounted(){
      EventBus.$on('updateNotifBadgesEvent', () => {
        if(this.npk !=null && this.npk !='' ){ 
          this.getBadgeTab()
        }else{
          //do nothing
        }
      })
    },
    methods: {
      
    getBadgeTabMonitoring: async function () {
       console.log("getBadgeTabMonitoring",this.$route.query.f, this.npk, this.kodeKantorRole)
        this.$axios.post("/naskah/notifBadgeTabMonitoring", {
            npk : this.npk,
            kodeKantor : this.kodeKantorRole,
            kodeJenisNaskah: this.$route.query.f
        })
        .then((res)=>{
          console.log("getBadgeTabMonitoring",res.data)
          this.item = res.data
        })
        .catch((err) => {
          console.log(err)
            // this.overlay = false;
        });

        // this.itemsbadges = data.jml;
     
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
                  this.getListNaskah();
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
      async getListNaskah() {
        //this.overlay = true;
        this.isLoaded = false;
        const { page, itemsPerPage } = this.options;
        let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.$axios.get("/naskah/tr/list",{
          params:{
              page:page,
              length:itemsPerPage,
              npk: this.dataUser.npk,
              no_naskah: this.filter.noNaskah,
              kode_jenis_naskah: this.filter.jenisNaskah,
              keyword: this.filter.keyword,
              kodeKantor : this.dataUser.kodeKantorRole,
              positionLevel : this.dataUser.positionLevel,
              kodeFungsi: this.dataUser.kodeRole,
              monitoringNaskah: this.filter.jenisMonitoringNaskah
          }
        })
        .then((res)=>{
          console.log('getListNaskah',res.data.rowCount)
          if(res.data.rowCount >=0){
            const items = [];
            let seq = noIndex-1
            res.data.data.forEach(item => {
              seq++
              items.push({
              no: seq,
              iconDraft: item.stDraft=='D'?'mdi-pencil':item.stDraft=='Y'?'mdi-check':'mdi-timer-sand',
              colorDraft: item.stDraft=='Y'?'green':'orange',
              colorSend: (item.stSend=='D' && item.stBatal=='T')?'blue' : (item.stSend=='Y'&& item.stBatal=='T')?'green' : (item.stSend=='Y'&& item.stBatal=='Y')?'red' : 'orange',
              iconSend: (item.stSend=='D' && item.stBatal=='T')?'mdi-pencil': (item.stSend=='Y'&& item.stBatal=='T') ?'mdi-check': (item.stSend=='Y'&& item.stBatal=='Y') ?'batal' :'mdi-timer-sand',
              // colorSend: item.stSend=='Y'?'green':'orange',
              dari: item.formData != '-' ? JSON.parse(item.formData).OBJ005 : '-',
              kepada: item.formData != '-' ? JSON.parse(item.formData).OBJ004 : '-',
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
      this.kodeKantorRole = this.dataUser.kodeKantorRole
      this.npk = this.dataUser.npk;
      this.kodeRole = this.dataUser.kodeRole;
      this.kodeKantorIndukRole = this.dataUser.kodeKantorIndukRole;
        if (this.dataUser.kodeUser == 0) {
          this.$router.push({ path: "/login" });
        } else if (!this.dataUser.setRole) {
          this.$router.push({ path: "/role" });
        } else {
          if (localStorage.hasOwnProperty("authPage")) {
            var dataPage = helper.decrypt(localStorage.authPage);
            var listPage = JSON.parse(dataPage);
            if(listPage.includes(this.$route.path.split("/")[1])){
              this.getBadgeTabMonitoring();
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
