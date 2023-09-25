<template>
  <v-data-table
    dense
    :headers="headers"
    :items="rows"
    :options.sync="options"
    :hide-default-footer="false"
    :footer-props="{'items-per-page-options':[15,50,100]}"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar text dark style="background: #eee; color: #000">
        <v-toolbar-title></v-toolbar-title>CUT OFF NOMOR NASKAH DINAS {{filter.tahun}}
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
        <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="750px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                :disabled=isDisabled
                >Cut Off</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" :lazy-validation="false">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.namaKantor"
                          label="Nama Kantor"
                          :rules="rules.required"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="1" md="12">
                        <v-autocomplete
                            v-model="editedItem.kodeJenisNaskah"
                            :rules="rules.required"
                            :disabled="!readOnly"
                            :items="dataJenisNaskah"
                            :item-text="item=> item.namaJenisNaskah "
                            item-value="kodeJenisNaskah"
                            @change="mappingFormJenisNaskah()"
                            label="Jenis Naskah"
                            placeholder="Search Jenis Naskah"
                          ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="1" md="12">
                        <v-text-field
                            v-model="noNaskahTerakhir"
                            :rules="rules.required"
                            :items="editedItem"
                            :item-text="item=> item.noNaskahTerakhir "
                            item-value="namaJenisNaskah"
                            label="No Terakhir(* yang belum dipergunakan)"
                            disabled
                            placeholder="No Terakhir"
                          ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="5">
                        <v-text-field
                          v-model="drNomor"
                          label="Cut Off Nomor (Dari)"
                          :rules="rules.required"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <div style="align-self: center;">
                        s/d
                      </div>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="smpNomor"
                          label="Jumlah Nomor yang Dibutuhkan"
                          :rules="rules.required"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="green darken-1" @click="save" :disabled="!valid" :loading="isLoad"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="290">
          <v-card>
            <v-card-title class="headline">Konfirmasi hapus</v-card-title>

            <v-card-text>Yakin ingin menghapus data yang dipilih?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" @click="closeDelete">Batal</v-btn>
              <v-btn color="success" @click="deleteData()">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCutoffDetil" max-width="1000px">
          <template>
            <v-card>
              <v-card-title style="background: #eee; color: #000">
                <span class="headline">{{ formTitleCutOff }}</span>
              </v-card-title>
              <v-data-table
                dense
                :headers="headersCutOffDetil"
                :items="rows1"
                class="elevation-1">
                  <template v-slot:item="{ item}">
                      <tr>
                        <!-- <td>{{ index + 1 }}</td> -->
                        <td>{{ item.noNaskah }}</td>
                        <td>{{ item.kodeJenisNaskah }}</td>
                        <td>{{ $moment(item.tglNaskah).format('DD/MM/YYYY') }}</td>
                      </tr>
                  </template>
              </v-data-table>
              <v-card-text style="background: #4CAF50;width:auto; padding: 10px;color:#FFFFFF; margin:10px 10px">
                <v-icon class="">mdi-information</v-icon> Jika nomor cut off tidak tergenerate, maka nomor tersebut sudah digunakan.
              </v-card-text>
               <v-card-actions class="justify-center">
                <v-btn color="red darken-1" text @click="closeCutOffDetil">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-toolbar>
      <v-row no-gutters>
        <v-col cols="12" sm="6" md="6" lg="4" class="text-right d-flex">
          <v-autocomplete
            v-model="editedItem.kodeKantor"
            :items="dataKantor"
            item-text="namaKantor"
            item-value="kodeKantor"
            label="Kantor"
            @change="mappingDataKantor()"
            placeholder="Search Kantor"
            outlined
            clearable
            rounded
            class="pa-2"
            dense
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" sm="12" md="6" lg="4" class="text-right d-flex">
              <v-text-field
                v-model="filter.keyword"
                type="text"
                outlined
                clearable
                rounded
                class="pa-2"
                placeholder="Search"
                v-on:keyup.enter="doSearchFilter()"
                dense>
                <template v-slot:append>
                  <v-icon @click="doSearchFilter" class="mr-4">mdi-magnify</v-icon>
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
              <v-card min-width="400" >
                <v-card-text class="pa-6">
                  <template>
                    <form>
                      <v-col
                        class="d-flex"
                        cols="12"
                        sm="6"
                      >
                        <v-select
                        v-model = "filter.tahun"
                          :items="tahun"
                          label="Tahun"
                          dense
                        ></v-select>
                      </v-col>
                      <v-select
                            v-model="filter.kodeJenisNaskah"
                            :items="dataJenisNaskah"
                            :item-text="item=> item.namaJenisNaskah "
                            item-value="kodeJenisNaskah"
                            label="Jenis Naskah"
                            placeholder="Search Jenis Naskah"
                      />
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
                    @click="doSearchFilter"
                  >
                    Search
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            </template>
              </v-text-field>
        </v-col> -->
        <v-col cols="12" sm="12" md="6" lg="4" class="text-right d-flex">
          <v-autocomplete
                v-model="filter.kodeJenisNaskah"
                :items="dataJenisNaskah"
                :item-text="item=> item.namaJenisNaskah "
                item-value="kodeJenisNaskah"
                @change="doSearchFilter()"
                label="Jenis Naskah"
                outlined
                clearable
                rounded
                class="pa-2"
                dense
              ></v-autocomplete>
        </v-col>
        <v-col cols="8" sm="8" md="4" lg="2" class="text-right d-flex">
          <v-autocomplete
              v-model = "filter.tahun"
              :items="tahun"
              @change="doSearchFilter()"
              label="Tahun"
              outlined
              rounded
              class="pa-2"
              dense
            ></v-autocomplete>

        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" class="text-right d-flex" style="padding: 9px">
          <v-btn @click="doResetFilter" title="reset"><v-icon>mdi-refresh</v-icon></v-btn>

        </v-col>

      </v-row>
    </template>
    <template v-slot:item="{ item}">
        <tr>
          <!-- <td>{{ index + 1 }}</td> -->
          <td>{{ item.namaJenisNaskah }}</td>
          <td>{{ item.dari }}</td>
          <td>{{ item.sampai }}</td>
          <td>
              <v-tooltip bottom>
                <template  v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="viewItem(item.idNaskahCutoff)"> mdi-eye </v-icon>
                </template>
                <span>view</span>
              </v-tooltip>
              <!-- <v-tooltip bottom>
                <template  v-slot:activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
              </template>
                  <span>Edit</span>
              </v-tooltip> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on" @click="deleteItem(item)" :disabled=isDisabled> mdi-delete </v-icon>
                </template>
                <span>Delete</span>
              </v-tooltip>
          </td>
        </tr>
    </template>
    <template v-slot:no-data>
      <v-btn text color="default" @click="doResetFilter">Reload</v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.v-application .elevation-1 {
  box-shadow: 0px 0px 0px 0px !important;
}
</style>

<script>
import { VueMaskDirective } from 'v-mask'

import helper from "@/helpers/index";
export default {

  data: () => ({
    tahun: [],
    dialog: false,
    dialogDelete: false,
    dialogCutoffDetil: false,
    headers: [
      // { text: "No.", value: "noIndex" },
      { text: "Nama Naskah", value: "namaJenisNaskah" },
      { text: "No Surat Dari", value: "dari" },
      { text: "Jml Cutoff Nomor", value: "sampai" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headersCutOffDetil: [
      // { text: "No.", value: "noIndex" },
      { text: "No Naskah", value: "NoNaskah" },
      { text: "Nama Naskah", value: "NamaNaskah" },
      { text: "Tanggal Naskah", value: "tglNaskah" }
    ],
    rows: [],
    rows1: [],
    rows2: [],
    dataKantor: [],
    viewedIndex: -1,
    editedIndex: -1,
    editedItem: {},
    noNaskahTerakhir:"",
    drNomor:"",
    smpNomor:"",
    isLoaded: false,
    isLoad: false,
    dataJenisNaskah: [],
    defaultItem: {},
    valid: false,
    activePicker: null,
    year: null,
    date: null,
    menu: false,
    filter: {
      keyword:'',
      date1:'',
      namaJenisNaskah:'',
      kodeJenisNaskah:'',
      PetugasRekam:'',
      tahun:''
    },
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
        options:{
          page: 1,
          itemsPerPage:15
        },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Nomor Naskah Dinas" : "Edit Item";
    },
    formTitleCutOff() {
      // return this.viewedIndex === -1 ? "New Nomor Naskah Dinas" : "View Item";
      return this.editedIndex === -1 ? "View Nomor Naskah Dinas" : "Edit Item";
    },
    isDisabled() {
    return this.editedItem.kodeKantor === 'P' || this.editedItem.kodeKantor === '0' || this.editedItem.kodeKantor === '1' || this.editedItem.kodeKantor === '2'
    || this.editedItem.kodeKantor === '3' || this.editedItem.kodeKantor === '4' || this.editedItem.kodeKantor === '5'
    || this.editedItem.kodeKantor === '6' || this.editedItem.kodeKantor === '7' || this.editedItem.kodeKantor === '8'
    || this.editedItem.kodeKantor === '9' || this.editedItem.kodeKantor === '10' || this.editedItem.kodeKantor === '11'
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    menu (val) {
      // console.log(val && setTimeout)
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },

  async created(){
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole
      this.npk = this.dataUser.npk;
      this.getRange();

      // console.log("kodekantor:",this.dataUser.kodeKantorRole)
      if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!this.dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = "dataUser.kodeUser";
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          // console.log("listPage:", listPage, this.$route.path.split("/")[1])
          if(listPage.includes(this.$route.path.split("/")[1])){
            this.getDataKantor();

          }else
          {
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
    reloadPage(){
      window.location.reload()
    },
    savedate (date) {
     this.filter.date1 = date
      this.menu = false
      // console.log("date",this.filter.date1, date)
      // this.$refs.menu.savedate(date)
    },
     getRange() {
      let thisYear = this.$moment().format('YYYY');
      let startYear = this.$moment('2018').format('YYYY');
      var dateRange = []
      for(var i = thisYear; i > startYear; i--){
        dateRange.push(i)
      }
      this.tahun = dateRange
      this.filter.tahun = thisYear
    },
    async doSearchFilter(){
      // console.log("doSearchFilter", this.editedItem.kodeKantor, this.filter.kodeJenisNaskah, this.filter.tahun, this.filter.keyword)
        if((this.editedItem.kodeKantor != undefined && this.editedItem.kodeKantor != '') && (this.filter.kodeJenisNaskah != null || this.filter.tahun != null)) {

          const { page, itemsPerPage } = this.options;
        this.$axios.get("/master/naskah-cutoffallfilter",{
            params:{
              kodeKantor: this.editedItem.kodeKantor,
              kodeJenisNaskah: this.filter.kodeJenisNaskah,
              date: this.filter.tahun,
              keyword: this.filter.keyword
            }
        })

        .then((res)=>{

          this.rows = res.data.data;
        })
        .catch(()=>{
          console.log('error')
        })
      }
    },

    doResetFilter(){
      this.filter.date1 = '';
      this.filter.namaJenisNaskah = '';
      this.filter.keyword = '';
      this.filter.kodeJenisNaskah = '';
      this.date = '';
      this.filter.tahun = this.$moment().format('YYYY');
      this.editedItem.kodeKantor = '';
      this.rows = []
      this.naskahDinasCutOff()
    },

    readOnly() {
      return this.viewedIndex === -1
    },

    async naskahDinasCutOff(id) {
      // console.log("naskahDinasCutOff", id)
      if (id !== undefined) {
        this.$axios.get("/master/naskah-cutoffall",{
          params:{
            kodeKantor:id
          }
      })
      .then((res)=>{
        // console.log("naskahDinasCutOff-return:",res.data.data)
        this.rows = res.data.data;
      // console.log("naskahDinasCutOff", this.rows)
      })
      .catch(()=>{
        console.log('error')
      })
      }
    },

    async naskahDinasCutOffDetil(id) {
        this.isLoaded = false;
      console.log("naskahDinasCutOffDetil", this.rows)
      console.log({
            // npk: this.dataUser.npk,
            kodeKantor: this.editedItem.kodeKantor,
            // kodeUser: this.dataUser.kodeUser,
            id: id
          })
      this.$axios.get("/master/naskah-cutofftalldetil",{
          params:{
            // npk: this.dataUser.npk,
            kodeKantor: this.editedItem.kodeKantor,
            // kodeUser: this.dataUser.kodeUser,
            id: id
          }
      })
      .then((res)=>{
        this.isLoaded = true;
        this.rows1 = res.data.data;
      })
      .catch(()=>{
        console.log('error')
      })
    },

    viewItem(idNaskahCutoff) {
      this.dialogCutoffDetil = true;
      this.naskahDinasCutOffDetil(idNaskahCutoff);
    },

getDataKantor: async function () {
  // console.log("getDataKantor", this.dataUser.kodeKantorRole)
  this.$axios.get("/unit-kantor-konsolidasi-cutoff",{
          params:{
            kodeKantor: this.dataUser.kodeKantorRole
          }
      })
      .then((res)=>{
        console.log("data", res.data)
        this.dataKantor = res.data.data;
      })
      .catch(()=>{
        console.log('error')
      })
},

    async getJenisNaskah(id) {
      // console.log("getJenisNaskah", id)
      this.$axios.get("/master/naskah-jenisCufOff",{
          params:{
            npk: this.dataUser.npk,
            kodeKantor: id,
            kodeUser: this.dataUser.kodeUser
          }
      })
      .then((res)=>{
        // console.log("getJenisNaskah-return",res.data.data)
        this.dataJenisNaskah = res.data.data;
      })
      .catch(()=>{
        console.log('error')
      })
    },

    close() {
      this.dialog = false;
      this.isLoad = false;
      // this.mappingFormJenisNaskah()
      // this.$nextTick(() => {
        // this.editedItem = Object.assign({}, {})
        this.editedItem.kodeJenisNaskah = Object.assign({}, {})
        this.noNaskahTerakhir = ''
        this.drNomor = ''
        this.smpNomor= ''


      //   // this.$refs.form.reset()
      //   this.viewedIndex = -1;
      //   this.editedIndex = -1;
      //   this.naskahDinasCutOff()
      //   // this.mappingDataKantor
      // });
    },

    closeCutOffDetil() {
      this.dialogCutoffDetil = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, {})
        this.viewedIndex = -1;
        this.editedIndex = -1;
      });
    },

    mappingDataKantor(){
      console.log("this.editedItem.kodeKantor", this.editedItem.kodeKantor)
      if(this.editedItem.kodeKantor != null) {
      let data = this.dataKantor.find((item) => item.kodeKantor === this.editedItem.kodeKantor)
            this.editedItem.namaKantor = data.namaKantor
            let itemkodeKantor = this.editedItem.kodeKantor

      this.getJenisNaskah(itemkodeKantor);
      //this.naskahDinasCutOff(itemkodeKantor);
      this.doSearchFilter()
      } else{
          this.doResetFilter()
        }
    },

    mappingFormJenisNaskah(){
      let data1 = this.dataJenisNaskah.find((item) => item.kodeJenisNaskah === this.editedItem.kodeJenisNaskah)
            // this.editedItem.kodeJenisNaskah = data1.kodeJenisNaskah
            this.editedItem.namaJenisNaskah = data1.namaJenisNaskah
      this.$axios.get("/master/naskah-cutoffterakhir",{
          params:{
            npk: this.dataUser.npk,
            kodeKantor: this.editedItem.kodeKantor,
            kodeJenisNaskah: this.editedItem.kodeJenisNaskah
          }
      })
      .then((res)=>{
        // console.log("succsess",res.data.data[0].noNaskah)
        if(res.data.ret==0){
          this.noNaskahTerakhir=res.data.data[0].noNaskah
          this.drNomor = this.noNaskahTerakhir.split("/")[1]
          // console.log("testing:",this.noNaskahTerakhir, this.drNomor)
        }
      })
      .catch(()=>{
        console.log('error')
      })
    },

    save: async function() {
      this.valid = false
      this.isLoad = true
      if (this.editedIndex > -1) {
        await this.updateData()
         this.valid = false
         this.isLoad = false
      } else {
        await this.addData()
        this.valid = false
         this.isLoad = false
      }
    },

    addData: async function () {
      try {
         if (this.$refs.form.validate()) {
              this.overlay = true;
              let start= this.drNomor
              let end= parseInt(this.smpNomor)-1 + parseInt(this.drNomor)
              let st_cutoff = 'Y'
              var cutOff_ID = [];
              for (var i = parseInt(start); i <= parseInt(end); i++) {
                cutOff_ID.push(i);
              }
            var params = {
              npk: this.dataUser.npk,
              kodeUser: this.dataUser.kodeUser,
              kodeKantor: this.editedItem.kodeKantor,
              noNaskahTerakhir : this.noNaskahTerakhir,
              kodeJenisNaskah: this.editedItem.kodeJenisNaskah,
              namaJenisNaskah: this.editedItem.namaJenisNaskah,
              start: this.drNomor,
              end: this.smpNomor,
              noNaskah: cutOff_ID,
              st_cutoff: st_cutoff
            };
            console.log("params-front:", params)
            let { data } = await this.$axios.post("/master/naskah-cutoff", params);
            this.result = data;
            // console.log("this.result", this.result)
              if (this.result.ret == 0) {
                this.$swal("", "Data berhasil ditambahkan", "success");
                this.overlay = false;
                this.dialog = false;
                this.mappingDataKantor()
                this.mappingFormJenisNaskah()
                this.smpNomor= ''
              } else if(this.result.ret == "-2") {
                this.overlay = false;
                this.$swal("", "No Surat tidak bisa di insert, karena kurang dari nomor surat terakhir", "error");
              } else {
                this.overlay = false;
                this.$swal("", "Data gagal ditambahkan", "error");
                this.dialog = false;
                this.mappingDataKantor()
                this.mappingFormJenisNaskah()
                this.smpNomor= ''
                }
          } else {
            this.overlay = false;
            this.$swal("", "Kesalahan Sistem", "error");
          }

      } catch (error) {
        this.overlay = false;
        this.$swal("", "Kesalahan Sistem", "error");
      }
    },

    deleteItem(item) {
      // console.log(item)
      this.$axios.get("/master/naskah-cutofftalldetil",{
          params:{
            npk: this.dataUser.npk,
            kodeKantor: this.editedItem.kodeKantor,
            kodeUser: this.dataUser.kodeUser,
            id: item.idNaskahCutoff
          }
      })
      .then((res)=>{
        // console.log("deleteItem-return",res.data.data[1])
        this.rows1 = res.data.data;
        // console.log(this.rows1)
        var id1 = [];
        if (this.rows1.length > 0 ) {
          for (var x = 0; x < this.rows1.length; x++) {
            this.rows2 = this.rows1[x].id
            id1.push(this.rows2);
          }
        }
          this.$swal({
            title: "Apakah Anda Yakin Delete Cut Off Naskah ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then(async(result) => {
            if(result.isConfirmed) {
              this.overlay = true;
              let st_cutoff = 'T'
              let st_hapus = 'Y'
              await this.$axios({
                method: "delete",
                url: "/master/naskah-cutofftall/" + item.idNaskahCutoff,
                data: {
                  kodeUser: this.dataUser.kodeUser,
                  st_cutoff: st_cutoff,
                  st_hapus: st_hapus,
                  kodeJenisNaskah: item.kodeJenisNaskah,
                  sampai: item.sampai,
                  kodeKantor: this.editedItem.kodeKantor,
                  id1: id1,
                  },
              })
              .then((res) => {
                // console.log("data:", res.data);
                if(res.data.ret === "0") {
                    this.overlay = false;
                    // handle success
                    this.$swal("", "Data berhasil dihapus", "success");
                    this.mappingDataKantor()
                    this.mappingFormJenisNaskah()
                    this.smpNomor= ''
                  } else if(res.data.ret === "-2") {
                      this.overlay = false;
                      // this.mappingDataKantor()
                      // this.mappingFormJenisNaskah()
                      // this.smpNomor= ''
                      this.$swal("", "No Surat tidak bisa di delete, karena sudah terbentuk no surat baru", "error");
                  } else {
                    this.overlay = false;
                    this.mappingDataKantor()
                    this.mappingFormJenisNaskah()
                    this.smpNomor= ''
                    this.$swal("", "Data gagal dihapus", "error");
                  }
              })
            }
          })

      })
      .catch(()=>{
        console.log('error')
      })


    },

  },
};
</script>
