<template>
  <div>
    <v-col v-if="!isLoaded">
        <v-skeleton-loader type="table" />
      </v-col>
    <v-data-table  v-show="isLoaded"
                    :headers="headers"
                    :items="rows"
                    :options.sync="options"
                    :hide-default-footer="false"
                    :server-items-length="totalData"
                    :footer-props="{'items-per-page-options':[15,50,100],'show-current-page':true,'show-first-last-page':true}"
                    class="elevation-1"
                    dense
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
                        append-icon="mdi-magnify"
                        v-on:keyup.enter="doSearchFilter"
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
                      <template v-slot:activator="{ on }">
                          <v-icon v-on="on" :color="isFilterSearch" left>mdi-arrow-down-drop-circle-outline</v-icon>
                      </template>
                      <v-card
                        min-width="400"

                      >
                        <v-card-text class="pa-6">
                      <template>
                        <v-form>
                          <!-- <v-text-field
                            v-model="filter.noNaskah"
                            label="Nomor Naskah"

                          /> -->
                          <!-- <v-select
                            v-model="filter.jenisNaskah"
                            label="Jenis Naskah"
                            :items="itemsJenisNaskah"
                          /> -->
                          <v-select
                            v-model="filter.namaTl"
                            label="Kategori Tindak Lanjut"
                            :items="itemKategoriTL"
                          />
                          <!-- <v-select
                            v-model="filter.namatl"
                              :items="[
                                {value:'',text:'Semua Kategori Tindak Lanjut'},
                                {value:'PERSETUJUAN PENGONSEP',text:'Persetujuan Pengonsep'},
                                {value:'PENANDATANGANAN DIGITAL',text:'Penandatanganan Digital'},
                                {value:'DISPOSISI',text:'Disposisi'},
                              ]"
                              label="Kategori Tindak Lanjut"
                            /> -->
                          <v-select
                            v-model="filter.statusTl"
                              :items="[
                                {value:'',text:'-- Semua --'},
                                {value:'Y',text:'SUDAH'},
                                {value:'T',text:'BELUM'},
                              ]"
                              label="Status Tindak Lanjut"
                            />
                          <v-select
                            v-model="filter.isRead"
                              :items="[
                                {value:'',text:'-- Semua --'},
                                {value:'Y',text:'READ'},
                                {value:'T',text:'UNREAD'},
                              ]"
                              label="Status Baca Naskah"
                            />
                        </v-form>
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
                              @click="doSearchFilter"
                            >
                              Search
                            </v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-menu>
                  </template>
                    </v-text-field>
                      <!-- <v-select
                        dense
                        outlined
                        :items="category"
                        class="pa-2 mr-2"
                        label="SEMUA"
                        hide-details
                        single-line
                        style="max-width: 250px"
                      /> -->
                    </v-col>
                    </v-row>
                  </template>
                  <template v-slot:item="{ item }">
                    <tr>
                      <td align="center">
                        <v-icon small  color="green" @mouseover="doDetil(item.dari, item.kepada)">
                              mdi-send
                            </v-icon>
                        <!-- <v-icon small v-if="item.namaJenisNaskah=='NASKAH MASUK'" color="blue" @mouseover="doDetil(item.dari, item.kepada)">
                              mdi-inbox
                            </v-icon> -->
                      </td>
                      <!-- <td >{{ item.no }}.</td> -->
                      <td :class="item.fontStyle">{{ item.noNaskah===null?'-':item.noNaskah }}</td>
                      <!-- <td :class="item.fontStyle">{{ item.namaJenisNaskah===null?'-':item.namaJenisNaskah.toUpperCase()  }}</td> -->
                      <td :class="item.fontStyle">{{ item.perihal===null?'-':item.perihal.toUpperCase() }}</td>
                      <td :class="item.fontStyle">{{ item.tglTerimaVal }}</td>
                      <td :class="item.fontStyle">{{ item.namaTl }}</td>
                      <!-- <td :class="item.fontStyle"><v-icon small :color="item.colorIcon">{{item.icon}}</v-icon></td> -->
                      <td>
                          <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon  v-bind="attrs" v-on="on" small :color="item.colorIcon">{{item.icon}}</v-icon>
                          </template>
                          <!-- <span>{{item.tglBatal}} <br>{{item.ketBatal}}</span> -->
                          <span v-if="item.stTl=='Y' && item.stBatal=='Y'">{{item.tglBatal}} <br>{{item.ketBatal}}</span>
                          <span v-if="item.stTl=='Y' && item.stBatal=='T'">Terkirim</span>
                          <span v-if="item.stTl=='T' && item.stBatal=='T'">Dalam Proses</span>
                          <!-- <span v-else>Dalam Proses</span> -->
                        </v-tooltip>
                        </td>
                      <td :class="item.fontStyle">{{ parseDate(item.tglTl)}}</td>
                      <td v-if="item.stPemindahanArsip=='T'" align="start">
                          <!-- <v-btn :to="{ path: '/inbo x/'+item.idNaskah }"
                            class="mr-2" color="info" small >
                              <v-icon left>mdi-eye</v-icon>Lihat
                        </v-btn> -->
                        <v-btn class="mr-2" color="info" small @click="doDetilNaskahMasuk(item)" >
                              <!-- <v-icon left>mdi-eye</v-icon> -->
                              Lihat
                        </v-btn>
                      </td>
                      <td style="color:red" v-if="item.stPemindahanArsip=='Y'" align="start">
                            Inaktif
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
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
// import Btn from '../../client/src/views/pages/components/Btn.vue'
import { EventBus } from '@/eventBus.js'
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
      tab: 0,
      dialog:false,
      dari: [],
      kepada: [],
      category: ["SEMUA","CATEGORY"],
      headers: [
          { text: "", value: "", sortable: false },
          // { text: "No.", value: "no", sortable: false },
          { text: "No. Naskah", value: "noNaskah", sortable: true, },
          // { text: "Jenis Naskah", value: "namaJenisNaskah", sortable: true, },
          { text: "Perihal", value: "perihal", sortable: true, },
          { text: "Tanggal Naskah Masuk", value: "tglTerima", sortable: true, },
          { text: "Tindak Lanjut", value: "namaTl", sortable: true, },
          { text: "Status TL", value: "stTl", sortable: true },
          { text: "Tanggal TL", value: "tglTl", sortable: true,},
          { text: "Aksi", value: "action", sortable: false }
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
      isLoaded: false,
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
      kodeKantorRole:''
    }
  },
  watch: {
    "$route.query.f": function () {
      this.getListNaskah();
    },
    options: {
      handler() {
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
  methods: {
    doRefresh(){
      this.options.page = 1;
      this.doResetFilter();
    },
    doSearchFilter(){
      this.options.page = 1;
      this.getListNaskah();
    },
    parseDate(val){
      if(val){
        // if(this.$moment(val) < this.$moment().subtract(1, 'days')) {
        //   return this.$moment(val).format('DD/MM/YYYY HH:mm')
        // } else {
        //   return this.$moment(val).fromNow()
        // }
        return this.$moment(val).format('DD-MM-YYYY')
      } else {
        return '-'
      }
    },
    doResetFilter(){
      this.filter.namaTl = '';
      this.filter.noNaskah = '';
      this.filter.jenisNaskah = '';
      this.filter.statusTl = '';
      this.filter.isRead = '';
      this.filter.keyword = '';
      this.getListNaskah()
    },
    doDetilNaskahMasuk(val){
      const dataobj = {
            'indexTl': val.indexTl,
      }
      var obj = helper.encrypt(JSON.stringify(dataobj));
      this.$router.push({
          path: '/inbox/'+val.idNaskah,
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
    async getListNaskah() {
        // console.log(this.urlParam,'xxxxxxxx')
        this.isLoaded = false;
        const { page, itemsPerPage, sortBy, sortDesc } = this.options;
        
        let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.$axios.get("/naskah/",{
          params:{
            page:page,
            length:itemsPerPage,
            filterTab: this.filterTab,
            npk: this.dataUser.npk,
            namatl: this.filter.namaTl,
            kodeJenisNaskah: this.$route.query.f,
            statusTl: this.filter.statusTl,
            isRead: this.filter.isRead,
            keyword: this.filter.keyword,
            kodeKantorRole:this.kodeKantorRole,
            koderole : this.dataUser.kodeRole
          }
        })
        .then((res)=>{
          console.log(res.data)
          if(res.data.rowCount >=0){
            let items = [];
            let seq = noIndex-1
            console.log(this.filterTab)
            res.data.data.forEach(item => {
              seq++
              items.push({
                no: seq,
                fontStyle: item.stTl=='Y'?'font-weight-regular':'font-weight-black',
                // colorIcon: item.stTl=='Y'?'green':'orange',
                colorIcon: (item.stTl=='Y' && item.stBatal=='T')?'green' : (item.stTl=='Y' && item.stBatal=='Y') ?'red' :'orange',
                // icon: item.stTl=='Y'?'mdi-check':'mdi-timer-sand',
                icon: (item.stTl=='Y' && item.stBatal=='T')?'mdi-check': (item.stTl=='Y' && item.stBatal=='Y') ? 'batal' : 'mdi-timer-sand',
                tanggalTl: item.tglTl,
                dari: item.formData != '-' ? JSON.parse(item.formData).OBJ005 : '-',
                kepada: item.formData != '-' ? JSON.parse(item.formData).OBJ004 : '-',
                ...item,
              })

            });
            this.rows = items
            this.totalData = Number(res.data.rowCount);
            if (sortBy.length === 1 && sortDesc.length === 1) {
              items = items.sort((a, b) => {
                const sortA = a[sortBy[0]]
                const sortB = b[sortBy[0]]

                if (sortDesc[0]) {
                  if (sortA < sortB) return 1
                  if (sortA > sortB) return -1
                  return 0
                } else {
                  if (sortA < sortB) return -1
                  if (sortA > sortB) return 1
                  return 0
                }
              })
            }
            if (itemsPerPage > 0) {
              items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            }
          }
          else {
            this.rows = [];
          }
          this.overlay = false;
          this.isLoaded = true;
        })
        .catch((error) => {
          this.rows = [];
          console.error(error);
          this.overlay = false;
          this.isLoaded = true;
          // this.$swal(
          //   "Galat",
          //   "Gagal Request Ke Server",
          //   "error"
          // );
        });
    },
    getLovListTL: async function(){
      // this.overlay = true
      this.$axios.get("/master/jenis-tl")
        .then((res)=>{
          // this.overlay = false;
          const itemKategoriTL = [{
            value:'',
            text:'-- Semua --'
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
            text:'-- Semua --'
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
    // console.log('sssssssssss')
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole
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
            //this.getLovJenisNaskah();
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