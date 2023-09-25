<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-data-table
          dense
          :headers="headers"
          :items="itemsList"
          :options.sync="options"
          :hide-default-footer="false"
          :server-items-length="totalData"
          :footer-props="{'items-per-page-options':[15,50,100]}"
          item-key="ID"
          class="elevation-1"
          :loading="isDataLoading"
        >
          <template v-slot:top>
            <v-row no-gutters >
              <v-col
                cols="12"
                lg="6"
                md="5"
                sm="4"
              >
                <v-text-field
                    v-model="filter.keyword"
                    type="text"
                    outlined
                    clearable
                    rounded
                    class="pa-2"
                    placeholder="Search"
                    v-on:keyup.enter="doSearchFilter()"
                    dense
                    hide-details
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
                      <template v-slot:activator="{ on }">
                          <v-icon v-on="on" left>mdi-arrow-down-drop-circle-outline</v-icon>
                      </template>
                      <v-card
                        min-width="400"

                      >
                      <v-card-text class="pa-6">
                      <template>
                        <form>
                          <v-select
                            v-model="filter.status"
                            label="Status Peminjaman"
                            :items="[
                              {text:'Semua',value:'-1'},
                              {text:'Peminjaman Ditolak', value: 'T'},
                              {text:'Peminjaman disetujui', value: 'Y'},
                              {text:'Peminjaman dalam proses', value: null}
                            ]"
                          />
                          <v-menu
                            v-model="menuDtAwal"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                :value="formatDate(filter.tglAwal)"
                                label="Tanggal Awal Permintaan"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="filter.tglAwal"
                              color="success"
                            ></v-date-picker>
                          </v-menu>
                          <v-menu
                            v-model="menuDtAkhir"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                :value="formatDate(filter.tglAkhir)"
                                label="Tanggal Akhir Permintaan"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="filter.tglAkhir"
                              color="success"
                            ></v-date-picker>
                          </v-menu>
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
                              @click="getData"
                            >
                              Search
                            </v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12"
                lg="6"
                md="7"
                sm="8"
                align-self="end"
                class="text-right"
              >

                <v-btn 
                  class="ma-2" 
                  outlined
                  color="green"
                  @click="openDialog"
                >
                  <v-icon left>
                    mdi-note-text-outline
                  </v-icon>
                  PEMINJAMAN ARSIP
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item="{ item, index }">
            <v-menu
              v-model="menu[index]"
              :close-on-content-click="false"
              :nudge-width="200"
              max-width="800px"
              offset-y
              offset-x
            >
              <template v-slot:activator="{ attrs }">
                <tr v-bind="attrs" @click="onClickRow(item,index)">
                  <td align="center">
                    <v-icon color="orange" small v-if="item.stApproval=='V'">mdi-timer-sand</v-icon>
                    <v-icon color="green" small v-else-if="item.stApproval=='Y'">mdi-check-bold</v-icon>
                    <v-icon color="red" small v-else-if="item.stApproval=='T'">mdi-close-octagon</v-icon>
                  </td>
                  <td align="center">{{(options.page - 1) * options.itemsPerPage + index + 1}}</td>
                  <td align="left" class=" d-none">{{item.idPeminjaman}}</td>
                  <td align="left">{{item.arsipId}}</td>
                  <td align="center">{{formatDate(item.tglPeminjaman)}}</td>
                  <td align="center">{{formatDate(item.tglApproval)}}</td>
                  <td align="left" >{{item.pemintaAkses}}</td>
                </tr>
              </template>
              <peminjaman-status-view :id-peminjaman="item.idPeminjaman" v-if="itemOnHoverID===item.ID"/>
            </v-menu>         
          </template>
      </v-data-table>
      </v-col>
    </v-row>
    <peminjaman-form-dialog 
      @close="dlg=false"
      v-if="dlg"
      @onSave="getData"
    />
    <!-- component lookup arsip -->

  </v-container>
</template>
<script>
import {debounce} from 'lodash'
import PeminjamanFormDialog from '../../components/PeminjamanFormDialog.vue'
import helper from "@/helpers/index";
export default {
  components: { PeminjamanFormDialog },
  data(){
    const compData={
      headers:headersListPengajuan,
      itemsList:[],
      isDataLoading: false,

      filter: {
        status:'',
        tglAwal:'',
        tglAkhir:'',
        keyword:'',
      },
      menuDtAwal: false,
      totalData:0,
      menuDtAkhir: false,
      options:{
        page: 1,
        itemsPerPage:15
      },
      menu:new Array(15).fill(false),
      isDebouncing : false,
      dlg:false,

      itemOnHoverID: null
      // komponen lookup arsip

      
    }
    return compData
  },
  mounted(){
    this.getData()
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
    },
    deep: true,
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
    cancelHover(){
      if(this.isDebouncing) this.isDebouncing= false
    },
    onHoverRow(val,index){
      this.isDebouncing = true
      this.debounceHover(val,index)
    },
    onClickRow(val,index){
      this.isDebouncing = false
      this.showDetilData(val,index)
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
    doResetFilter(){
      this.filter.status=''
      this.filter.tglAwal=''
      this.filter.tglAkhir=''
      this.filter.keyword=''
      this.getData()
    },
    doSearchFilter(){},
    doRefresh(){
      this.filter.status=''
      this.filter.tglAwal=''
      this.filter.tglAkhir=''
      this.filter.keyword=''
      this.getData()
    },
    getData(){
      this.isDataLoading=true
      const { page, itemsPerPage } = this.options;
      let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
      this.$axios.get("/arsipPeminjaman/getListPeminjam",{
          params:{
            page:page,
            length:itemsPerPage,
            filterApproval: this.filter.status,
            tglAwal: this.filter.tglAwal,
            tglAkhir:this.filter.tglAkhir,
            kodeKantor : this.dataUser.kodeKantorRole,
            npk : this.dataUser.npk
          }
      })
      .then((res)=>{
        // console.log(params)
        this.isDataLoading=false
        console.log("ok",res.data.data)
        this.totalData = Number(res.data.rowCount);
        if(res.data.ret==0){
          this.itemsList=res.data.data
        }
      })
      .catch(()=>{
        this.isDataLoading=false
        console.log('gagal')
      })
    },
    formatDate(val){
      var tglNaskahFormat = new Date(val);
      var dd = String(tglNaskahFormat.getDate()).padStart(2, '0');
      var mm = String(tglNaskahFormat.getMonth() + 1).padStart(2, '0');
      var yyyy = tglNaskahFormat.getFullYear();

      tglNaskahFormat = dd + '-' + mm + '-' + yyyy;
      return tglNaskahFormat
    },
    showDetilData(val,index){
      this.itemOnHoverID= val.ID
      this.menu.splice(index, 1, true)
    },
    openDialog(){
      this.dlg=true
    }
  }
}
const headersListPengajuan = [
  { text: "",  sortable: false, align: 'center' },
  { text: "No.",  sortable: false, align: 'center' },
  { text: "ID Peminjaman", value: "ID_PEMINJAMAN", sortable: false , align:' d-none'},
  { text: "Kode Trx", value: "ID_ARSIP", sortable: false },
  { text: "Tgl Permintaan", value: "TGL_PEMINJAMAN", sortable: false ,align: 'center' },
  { text: "Tgl Persetujuan", value: "TGL_APPROVAL", sortable: false ,align: 'center' },
  { text: "Peminta Akses", value: "PETUGAS_REKAM", sortable: false },
]

</script>