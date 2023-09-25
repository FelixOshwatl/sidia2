<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="!isLoaded">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col v-show="isLoaded">
        <v-tabs v-model="tab" background-color="none" left>
              <v-tab v-show="kodeRole == '1926'">Pengecekan Tata Naskah  
                 <v-badge
                    v-if="item.notif1>0"
                    bordered
                    color="success"
                    :content="item.notif1"
                    >
                  </v-badge>
              </v-tab>
              <v-tab>Persetujuan Konseptor 
                <v-badge
                  v-if="item.notif2>0"
                    color="success"
                    :content="item.notif2"
                    >
                  </v-badge>
              </v-tab>
              <v-tab>Permintaan TTE 
                <v-badge
                    v-if="item.notif3>0"
                    color="success"
                    :content="item.notif3"
                    >
                  </v-badge>
              </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item class="2">
                <outbox :filterTab="pengecekanTataNaskah"></outbox>
          </v-tab-item>
          <v-tab-item class="2">
                <outbox :filterTab="persetujuanKonseptor"></outbox>
          </v-tab-item>
          <v-tab-item class="2">
                <outbox :filterTab="permintaanTTE"></outbox>
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
import { EventBus } from '@/eventBus.js'
import outbox from "~/components/outbox";
import helper from "@/helpers/index";

export default {
  data(){
    return {
      all:"all",	
      draft: "draft",	
      pengecekanTataNaskah: "pengecekanTataNaskah",
      persetujuanKonseptor:"persetujuanKonseptor",	
      permintaanTTE:"permintaanTTE",	
      tab: 0,
      dialog:false,
      dari: [],
      kepada: [],
      category: ["SEMUA","CATEGORY"],
      headers: [
          { text: "", value: "", sortable: false },
          { text: "No.", value: "no", sortable: false },
          { text: "No. Naskah", value: "noNaskah", sortable: false, },
          { text: "Jenis Naskah", value: "namaJenisNaskah", sortable: false, },
          { text: "Perihal", value: "perihal", sortable: false, },
          { text: "Tanggal Naskah Masuk", value: "tglTerima", sortable: false, },
          { text: "Tindak Lanjut", value: "namaTl", sortable: false, },
          { text: "Status TL", value: "stTl", sortable: false },
          { text: "Tanggal TL", value: "tglTl", sortable: false,},
          { text: "Action", value: "action", sortable: false }
          ],
      item:[],
      dialogForm: false,
      itemsJenisNaskah: [],
      itemKategoriTL: [],
      dataKaryawan: [],
      idNaskah: null,
      dataTujuan: [],
      filter: {
        noNaskah:'',
        jenisNaskah:'',
        namaTl:'',
        keyword:'',
        statusTl:'',
        isRead:'',
      },
      kodeTl: null,
      objDisposisi:{},
      statusTl: null,
      isLoaded: true,
      overlay: false,
      menu: false,
      page: 0,
      totalData: 0,
      options:{
        page: 1,
        itemsPerPage:15
      },
      numberOfPages: 0,
      dataUser:{},
      rows:[],
      indexTl:null,
      mycolor:"red",
      kodeKantorRole:'',
      kodeRole:'V',
      npk:''
    }
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
  watch: {
    "$route.query.f": function () {
      this.getBadgeTab();
    },
    options: {
      handler() {
        this.getBadgeTab();
        this.getListNaskah();
      },
    },
    deep: true,
  },
  computed:{
    isFilterSearch: function(){
      if(this.filter.namaTl || this.filter.isRead || this.filter.jenisNaskah || this.filter.statusTl){
        return 'success'
      } else {
        return 'grey'
      }
    }

  },
  components: {
    outbox
  },
  methods: {
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
    getBadgeTab: async function () {
      //  console.log("testing deui",this.$route.query.f)
        this.$axios.post("/naskah/notifBadgeTab", {
            npk : this.npk,
            kodeKantor : this.kodeKantorRole,
            kodeJenisNaskah: this.$route.query.f
        })
        .then((res)=>{
          console.log(res.data)
          this.item = res.data
        })
        .catch((err) => {
          console.log(err)
            // this.overlay = false;
        });

        // this.itemsbadges = data.jml;
     
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
  },
  async created(){
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole
      this.npk = this.dataUser.npk;
      this.kodeRole = this.dataUser.kodeRole;
      if(this.kodeRole != '1926'){
        this.tab=1
      }

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
            this.getLovJenisNaskah();
            this.getBadgeTab();
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
