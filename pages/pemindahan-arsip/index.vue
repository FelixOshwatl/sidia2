<template>
  <v-container fluid>
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
    <v-row>
      <!-- <v-col v-if="!isLoaded"> -->
        <!-- <v-skeleton-loader type="table" /> -->
      <!-- </v-col> -->
      <v-col v-show="!show">
        <v-tabs>
          <v-tab>Monitoring Pemindahan Arsip</v-tab>
          <v-tab>Daftar Arsip</v-tab>

          <v-tab-item>
              <v-col>
                <v-data-table
                  :headers="headersMonitoring"
                  :items="dataMonitoring"
                  :options.sync="optionsTableMonitoring"
                  :server-items-length="totalDataMonitoring"
                  :loading="loadingTableMonitoring"
                  :items-per-page="5"
                  class="elevation-1"
                >
                    <template v-slot:[`item.tglPemindahan`]="{ item }">
                      {{ $moment(item.tglPemindahan).format('DD/MM/YYYY') }}
                    </template>
                    <template v-slot:[`item.stApproval`]="{ item }">
                      <v-btn @click.stop="showTimeline(item)" text>
                        {{item.stApproval == "Y" ? "DIPINDAHKAN" : item.stApproval == "V" ? "VERIFIKASI" : "DITOLAK"}}
                      </v-btn> 
                    </template>
                </v-data-table>
              </v-col>
          </v-tab-item>
          <v-tab-item>
              <v-col>
                <v-layout column justify-center align-center>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-layout wrap>
                          <v-flex xs12 sm3 md3>
                            <v-select
                              :items="dropdown_filter"
                              :rules="requiredRules"
                              v-model="filterBy"
                              label="Filter by"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
                            <v-select
                              :items="dropdown_jenis_arsip"
                              :rules="requiredRules"
                              v-model="jenisArsip"
                              label="Jenis Arsip"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 sm3 md3 v-if="filterBy == 'idarsip'">
                            <v-text-field
                              :rules="requiredRules"
                              v-model="kataKunci"
                              label="Search"
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
                            <v-menu
                              v-model="menutm"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="computedDateFormattedMomentjs1"
                                  label="Tanggal Awal"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                :rules="requiredRules"
                                v-model="tanggalMasuk"
                                color="success"
                                @input="setenddate"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 sm3 md3 v-if="filterBy == 'jenis'">
                            <v-menu
                              v-model="menuts"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="computedDateFormattedMomentjs2"
                                  label="Tanggal Akhir"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                :rules="requiredRules"
                                v-model="tanggalKeluar"
                                :min="minDateEnd"
                                color="success"
                                @input="menuts = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 sm3 md3>
                        <v-btn
                          :disabled="!formIsValid"
                          left
                          @click="pencarian"
                          >Cari</v-btn
                        >
                      </v-flex>
                      <v-flex xs12 sm12 md12 v-if="showTable">
                        <br>
                        <div>
                          <v-data-table
                            v-model="selectedArsip"
                            :headers="headersDaftarArsip"
                            :search="searchDaftarArsip"
                            :items="itemsDaftarArsip"
                            item-key="idArsip"
                            :single-select="false"
                            show-select
                            class="elevation-1"
                          >
                            <template v-slot:top>
                              <v-text-field
                                v-model="searchDaftarArsip"
                                label="Filter"
                                class="mx-4"
                              ></v-text-field>
                            </template>
                            <template v-slot:[`item.aksi`]="{ item }">
                              <v-btn text
                                class="px-2 ml-1"
                                min-width="0"
                                small
                                @click="lihatDetil(item.idArsip)"
                                
                                >Lihat</v-btn
                              >
                            </template>
                            <template v-slot:no-data>
                              <span>Tidak ada data arsip</span>
                            </template>
                          </v-data-table>
                          <br>
                          <v-row>
                            <v-col>
                              <v-btn
                                :disabled="!isSelected"
                                color="primary"
                                left
                                @click="prosesPindah"
                                >Proses</v-btn
                              >
                            </v-col>
                          </v-row>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-layout>
              </v-col>
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col v-show="show">
        <v-row>
          <v-col>
            <v-btn @click="show=false"
              class="mr-2"
              medium
              outlined
              color="blue white--text darken-2"
            >
              <v-icon class="mr-2"> mdi-arrow-left </v-icon>
              KEMBALI
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="pdfData.doc && show">
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" v-if="stDownload=='Y'">
                <v-btn-toggle dense v-if="src != ''">
                  <v-btn @click="rotate += 90">
                    <v-icon>mdi-rotate-left</v-icon>
                  </v-btn>
                  <v-btn @click="rotate -= 90">
                    <v-icon>mdi-rotate-right</v-icon>
                  </v-btn>
                  <!-- <v-btn @click="$refs.pdf.print()"><v-icon>mdi-printer</v-icon></v-btn> -->
                  <v-btn @click="zoom = '50%'">0.5x</v-btn>
                  <v-btn @click="zoom = '100%'">1x</v-btn>
                  <v-btn :href="pdfViewSrc" target="_blank">View</v-btn>
                  <v-btn v-if="dataUser.kodeUser != ''" @click="getPdf">Download</v-btn>
                </v-btn-toggle>

                <!-- <pdf ref="pdf" :src="src" :password="password" v-for="i in numPages" :key="i" :page="i"  :rotate="rotate" @progress="loadedRatio = $event" @error="error" @num-pages="numPages = $event" @link-clicked="page = $event"></pdf> -->

                <v-row class="ma-auto">
                  <pdf
                    v-for="i in numPages"
                    :key="i"
                    :src="src"
                    :page="i"
                    :rotate="rotate"
                    :style="{ inline: '', width: zoom }"
                  ></pdf>
                </v-row>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6">
                <v-alert
                  v-if="stDownload=='T'"
                  border="right"
                  colored-border
                  type="error"
                  elevation="2"
                >
                  Tidak Memiliki Akses Arsip
                </v-alert>
                <h3>Data</h3>
                <v-simple-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td class="font-weight-bold">Pointer</td>
                        <td>{{ namaPointerArsip }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Jenis Arsip</td>
                        <td>{{ namaJenisArsip }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>

                <div style="padding-top: 20px" if="pdfData.docDetil">
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th scope="col" class="text-left">Nama Atribut</th>
                          <th scope="col" class="text-left">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in pdfData.docDetil"
                          :key="item.namaAtribut"
                        >
                          <td>{{ item.namaAtribut }}</td>
                          <td>{{ item.objectValue }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <v-dialog
      v-model="dialogTimeline"
      max-width="800"
      scrollable
    >
      <v-card>
        <v-card-title class="grey lighten-2" primary-title>
          Detail Pemindahan Arsip
        </v-card-title>
        <v-tabs centered grow slider-color="grey">
          <v-tab>
            Timeline
          </v-tab>
          <v-tab>
            Daftar Arsip
          </v-tab>
          <v-tab-item>
            <v-card-text class="pt-0">
              <v-timeline align-top dense >
                <v-timeline-item
                  :color="item.stApproval=='V' ? 'grey':item.stApproval=='Y'?'green':'red'"
                  small
                  v-for="(item, index) in arsipTimeline" 
                  :key="index"
                >
                  <v-layout>
                    <v-flex xs3>
                      <strong>{{ item.tglApproval != "-" ? $moment(item.tglApproval).format('DD/MM/YYYY') : item.tglApproval }}</strong>
                      <div class="caption">{{ item.tglApproval != "-" ? $moment(item.tglApproval).format('HH:MM:SS') : item.tglApproval }}</div>
                    </v-flex>
                    <v-flex>
                      <strong>{{ item.namaJabatan }}</strong>
                      <div class="caption">
                        {{ item.namaPetugasAprooval.toUpperCase() }}
                        <v-icon color="grey" small v-if="item.stApproval=='V'">mdi-timer-sand</v-icon>
                        <v-icon color="green" small v-else-if="item.stApproval=='Y'">mdi-check-bold</v-icon>
                        <v-icon color="red" small v-else-if="item.stApproval=='T'">mdi-close-octagon</v-icon>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-tab-item>
          <v-tab-item>
            <v-card-text>
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th scope="col" class="text-left">
                      ID Arsip
                    </th>
                    <th scope="col" class="text-left">
                      Kode Jenis Arsip
                    </th>
                    <th scope="col" class="text-left">
                      Peminta Akses
                    </th>
                    <th scope="col" class="text-left">
                      Tanggal Pemindahan
                    </th>
                    <th scope="col" class="text-left">
                      Download
                    </th>
                    <th scope="col" class="text-left">
                      formData
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in listDaftarArsip"
                    :key="item.idArsip"
                  >
                    <td>{{ item.idArsip }}</td>
                    <td>{{ item.kodeJenisArsip }}</td>
                    <td>{{ item.pemintaAkses }}</td>
                    <td>{{ $moment(item.tglPemindahan).format('DD/MM/YYYY') }}</td>
                    <td>
                      <v-btn v-if="item.stDownload=='Y'" x-small @click="downloadPdf(item.idArsip)">
                        Download
                      </v-btn>
                    </td>
                    <td>
                      <v-btn x-small @click="tampilkan(item.formData)">
                        formData
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
                <v-tooltip
                  v-model="showFormData"
                >
                  <span>{{ isiFormData }}</span>
                </v-tooltip>  
              </v-simple-table>
            </v-card-text>
          </v-tab-item>
        </v-tabs>

        
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialogTimeline = false"
          >
            tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>

import helper from "@/helpers/index";
import pdf from "vue-pdf-signature";
export default {
  components: { pdf },
  data(){
    return {
      dialogTimeline: false,
      arsipTimeline: [],
      headersMonitoring: [
          { text: "ID Arsip", value: "arsipId", sortable: false, },
          { text: "Tanggal Pemindahan", value: "tglPemindahan", sortable: false, },
          { text: "Pengelola Arsip", value: "pengolahArsip", sortable: false, },
          { text: "Status", value: "stApproval", sortable: false, }
          ],
      dataMonitoring: [],
      optionsTableMonitoring: {},
      totalDataMonitoring: 0,
      loadingTableMonitoring: false,
      filterBy: "",
      jenisArsip: "",
      kataKunci: "",
      dropdown_filter: [
        { text: "Jenis Arsip", value: "jenis" },
        { text: "ID Arsip", value: "idarsip" },
      ],
      dropdown_jenis_arsip: [],
      menutm: false,
      menuts: false,
      tanggalMasuk: new Date().toISOString().substr(0, 10),
      tanggalKeluar: new Date().toISOString().substr(0, 10),
      minDateEnd: new Date().toISOString().substr(0, 10),
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      dataUser:{},
      kodeKantorRole:'',
      kodeRole:'',
      showTable:false,
      overlay: false,
      headersDaftarArsip: [],
      searchDaftarArsip: "",
      itemsDaftarArsip: [],
      kodeKantorJajaran: "",
      dropdown_kantor: [],
      selectedArsip: [],
      singleSelect: false,
      show: false,
      namaPointerArsip: "",
      namaJenisArsip: "",
      pdfData: {
        doc: [],
        docDetil: [],
      },
      src: "",
      pdfViewSrc: "",
      pdfViewSrcDownload: "",
      zoom: "50%",
      loadedRatio: 0,
      page: 1,
      numPages: 0,
      rotate: 0,
      breadcrumbItems: [
        {
          text: "Pemindahan Arsip",
          disabled: false,
          href: "",
        },
      ],
      listDaftarArsip:[],
      showFormData:false,
      isiFormData: "",
      stDownload: "T",
      idArsipDetail : ''
    }
  },
  watch: {
    optionsTableMonitoring: {
      handler() {
        this.getMonitoringArsip();
      },
    },
    deep: true,
  },
  computed:{
    computedDateFormattedMomentjs1() {
      return this.tanggalMasuk
        ? this.$moment(this.tanggalMasuk).format("DD/MM/YYYY")
        : "";
    },
    computedDateFormattedMomentjs2() {
      return this.tanggalKeluar
        ? this.$moment(this.tanggalKeluar).format("DD/MM/YYYY")
        : "";
    },
    formIsValid() {
      if (this.filterBy == "jenis") {
        return this.filterBy && this.jenisArsip;
      } else {
        return this.filterBy && this.kataKunci;
      }
    },
    isSelected() {
        return this.selectedArsip.length > 0;
    },
  },
  methods: {
    downloadPdf: async function (idArsip) {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/download/" + idArsip,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            baseURL:process.env.baseURL2, responseType: "blob",
            transformResponse: [],
            params: {
              kodeUser: this.kodeUser,
              kodeKantor: this.kodeKantor,
            },
          }
        );
        var url = await URL.createObjectURL(
          new Blob([data], { type: data.type })
        );
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    tampilkan: async function (item){
      this.showFormData = !this.showFormData
      this.isiFormData = item
    },
    showTimeline: async function (item){
      try {
        let { data } = await this.$axios.get("/arsip/getStatusPemindahan/"+item.idPemindahan);
        if (data.ret == 0 && data.data) {
          this.arsipTimeline = data.data;
          let daftarArsip = await this.$axios.get("/arsip/getDaftarPemindahan/"+item.idPemindahan);
          if (daftarArsip.data.ret == 0 && daftarArsip.data.data) {
            this.listDaftarArsip = daftarArsip.data.data
          } else {
            this.listDaftarArsip = []
          }
          this.dialogTimeline = true;
        } else {
          this.$swal("", "Data tidak ditemukan!", "error");
        }
      } catch (error) {
        console.log(error.message.toString());
      }
    },
    getMonitoringArsip: async function (){
      try {
        this.loadingTableMonitoring = true
        let { data } = await this.$axios.get("/arsip/getListPemindahan", {
          params: {
            page: this.optionsTableMonitoring.page,
            length: this.optionsTableMonitoring.itemsPerPage == -1 ? null : this.optionsTableMonitoring.itemsPerPage,
            kodeKantor:this.kodeKantorRole,
            npk: this.dataUser.npk
          },
        });
        if (data.ret == 0 && data.data) {
          this.loadingTableMonitoring = false
          this.dataMonitoring = data.data
          this.totalDataMonitoring = data.data.length
        } else {
          this.loadingTableMonitoring = false
          this.dataMonitoring = []
          this.totalDataMonitoring = 0
        }
      } catch (error) {
        this.loadingTableMonitoring = false
        this.dataMonitoring = []
        this.totalDataMonitoring = 0
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getListJenisArsip: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/master/arsip-jenis", {
          params: {},
        });
        this.resultJenisArsip = data;
        // console.log(this.resultJenisArsip);
        if (this.resultJenisArsip.ret == 0) {
          var dataListJenisArsip = this.resultJenisArsip.data;
          if (
            dataListJenisArsip != undefined &&
            dataListJenisArsip.length > 0
          ) {
            this.dropdown_jenis_arsip = [];
            for (var i = 0; i < dataListJenisArsip.length; i++) {
              this.dropdown_jenis_arsip.push({
                text: dataListJenisArsip[i].namaJenisArsip,
                value: dataListJenisArsip[i].kodeJenisArsip,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.dropdown_jenis_arsip = [];
          }
        } else {
          this.overlay = false;
          this.dropdown_jenis_arsip = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    setenddate() {
      this.menutm = false;
      this.minDateEnd = this.tanggalMasuk;
      if (this.tanggalMasuk > this.tanggalKeluar) {
        this.tanggalKeluar = this.tanggalMasuk;
      }
    },
    titleCase(string) {
      var sentence = string.toLowerCase().split("_");
      for (var i = 0; i < sentence.length; i++) {
        if (i == 0) {
          sentence[i] = sentence[i][0].toLowerCase() + sentence[i].slice(1);
        } else {
          sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
      }
      var kata = sentence.join("");
      return kata;
    },
    getheader: async function () {
      let customSizeHeader=['TGL SURAT','NO SURAT','PERIHAL','KETERANGAN']
      try {
        this.headersDaftarArsip = [];
        let { data } = await this.$axios.get(
          "/arsip/header?jenis=" + this.jenisArsip
        );
        this.resultHeader = data;
        if (this.resultHeader.ret == 0) {
          var listHeader = this.resultHeader.data;
          if (listHeader != undefined && listHeader.length > 0) {
            for (var i = 0; i < listHeader.length; i++) {
              console.log('ini filter:',this.filterBy)
              this.headersDaftarArsip.push({
                text: listHeader[i].text,
                value: this.titleCase(listHeader[i].value),
                align:'center',
                content: 'center',
                width:(customSizeHeader.includes(listHeader[i].text))?'115px':'',
              });
             
            }
            this.headersDaftarArsip.push({
              text: "AKSI",
              value: "aksi",
              align:"center",
            });
          } else {
            this.$swal("Error", "Gagal request headers!", "error");
          }
        } else {
          this.$swal("Error", "Gagal request headers!", "error");
        }
      } catch (error) {
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getListKantorJajaran: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/getKodeKantorJajaran/" + this.kodeKantorRole,
          {
            params: {},
          }
        );
        this.resultKantorJajaran = data;
        console.log("this.resultKantorJajaran");
        if (this.resultKantorJajaran.ret == 0) {
          var dataListKantorJajaran = this.resultKantorJajaran.data;
          if (
            dataListKantorJajaran != undefined &&
            dataListKantorJajaran.length > 0
          ) {
            this.dropdown_kantor = [];
            for (var i = 0; i < dataListKantorJajaran.length; i++) {
              this.dropdown_kantor.push({
                text: dataListKantorJajaran[i].namaKantor,
                value: dataListKantorJajaran[i].kodeKantor,
              });
            }
            this.overlay = false;
          } else {
            this.overlay = false;
            this.dropdown_kantor = [];
          }
        } else {
          this.overlay = false;
          this.dropdown_kantor = [];
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    getRecentPage: async function(idArsip){
     console.log("getRecent",idArsip)
      sessionStorage.setItem("recentPage", "archive");
      this.$router.push({ path: "/qr/"+idArsip });
    },
    pencarian: async function () {
      this.overlay = true;
      this.showTable = false;
      var kata = this.kataKunci ? this.kataKunci : "-1";

      if (this.filterBy == "idarsip") {
        let result = await this.$axios.get("/arsip/" + kata + "/doc", {
          params: { kantor: this.kodeKantorJajaran },
        });
        this.resultDoc = result.data;
         console.log(this.resultDoc);
        if (this.resultDoc.ret == 0 && this.resultDoc.data != undefined) {
          this.resultDocKodeJenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          this.jenisArsip = this.resultDoc.data[0].kodeJenisArsip;
          await this.getheader();
        } else {
          this.overlay = false;
          this.$swal("Error", "Data tidak ditemukan!", "error");
          return;
        }
      } else {
        await this.getheader(this.jenisArsip);
      }

      this.temp = this.filterBy == "jenis" ? "-1" : this.kataKunci;
      this.temp2 =
        this.filterBy == "jenis"
          ? this.jenisArsip
          : this.resultDocKodeJenisArsip;

      let { data } = await this.$axios.get("/arsip/" + this.temp + "/header", {
        params: {
          jenis: this.temp2,
          kantor: this.kodeKantorJajaran,
          dateStart: this.tanggalMasuk,
          dateEnd: this.tanggalKeluar,
          kodeRole : this.dataUser.kodeRole,
          npk      : this.dataUser.npk
        },
      });
      this.resultList = data;
       //console.log(this.resultList);
      if (this.resultList.ret == 0) {
        this.itemsDaftarArsip = [];
        var listArsip = this.resultList.data;
        if (listArsip != undefined && listArsip.length > 0) {
          for (var i = 0; i < listArsip.length; i++) {
            this.itemsDaftarArsip.push(listArsip[i]);
          }
          this.overlay = false;
          this.showTable = true;
        } else {
          this.overlay = false;
          this.$swal("Error", "Data tidak ditemukan!", "error");
          this.itemsDaftarArsip = [];
        }
      } else {
        this.overlay = false;
        this.$swal("Error", "Data tidak ditemukan!", "error");
        this.itemsDaftarArsip = [];
      }
    },
    prosesPindah: async function () {
      try{
        this.overlay = true;
        let arsipArr = this.selectedArsip.map(o => {
          return {
            idArsip:o.idArsip,
            kodeJenisArsip:this.jenisArsip
            };
          })
          
        let arsipArrCombine = {
          idArsipArr: JSON.stringify(arsipArr),
          kodeKantor: this.dataUser.kodeKantorRole
        }
        
        let { data } = await this.$axios.post("/arsip/combineArsip",arsipArrCombine);
        if (data.ret == 0) {
          let dataPdf = await helper.encrypt(data.file);
          let pemindahan = await helper.encrypt(JSON.stringify(arsipArr));
          sessionStorage.setItem("arsipPdf", dataPdf); //set sessionStorage dataPdf user
          this.$router.push("/new/NKH0023?pemindahan=" + pemindahan);
        } else {
          this.overlay = false;
          this.$swal("", data.msg, "error");
        }
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
    lihatDetil: async function(id){
      this.idArsipDetail = id
      let { data } = await this.$axios.get("/arsip/" + id,{
          params:{
            idArsip: id,
            npk: this.dataUser.npk,
            kodeKantor: this.dataUser.kodeKantor,
            kodeRole: this.dataUser.kodeRole
          }
        });
      this.pdfData = data;
      // console.log(this.pdfData);
      this.namaPointerArsip = this.pdfData.data[0].namaPointerArsip;
      this.namaJenisArsip = this.pdfData.doc[0].namaJenisArsip;
      this.stDownload = this.pdfData.doc[0].stDownload
      //let pdfFile = this.pdfData.doc[0] ? "http://sidia.bpjsketenagakerjaan.go.id/services/arsip/pdf?path=" + this.pdfData.doc[0].namaFile : "";
      //this.pdfViewSrc = "http://sidia.bpjsketenagakerjaan.go.id/services/arsip/" + id + "/pdf";
      let pdfFile = this.pdfData.doc[0]
        ? process.env.baseURL2 + "/arsip/pdf?path=" + this.$encrypt(this.pdfData.doc[0].namaFile)
        : "";
        console.log(this.pdfData.doc[0].namaFile)
      this.pdfViewSrc = process.env.baseURL2 + "/arsip/" + id + "/pdf";
      this.pdfViewSrcDownload = process.env.baseURL2 + "/arsip/" + id + "/download";

      this.src = pdf.createLoadingTask(pdfFile);
      if (this.src != "") {
        this.src.promise.then((pdf) => {
          this.numPages = pdf.numPages;
        });
        this.show = true;
      }
    },
    zoomIn: function (ticks) {
      var newScale = this.pdfViewer.currentScale;
      do {
        newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.ceil(newScale * 10) / 10;
        newScale = Math.min(MAX_SCALE, newScale);
      } while (--ticks && newScale < MAX_SCALE);
      this.pdfViewer.currentScaleValue = newScale;
    },
    zoomOut: function (ticks) {
      var newScale = this.pdfViewer.currentScale;
      do {
        newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.floor(newScale * 10) / 10;
        newScale = Math.max(MIN_SCALE, newScale);
      } while (--ticks && newScale > MIN_SCALE);
      this.pdfViewer.currentScaleValue = newScale;
    },
    getPdf: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/arsip/download/" + this.idArsipDetail,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            baseURL:process.env.baseURL2, responseType: "blob",
            transformResponse: [],
            params: {
              kodeUser: this.dataUser.kodeUser,
              kodeKantor: this.dataUser.kodeKantor,
              npk         : this.dataUser.npk,
              kodeRole    : this.dataUser.kodeRole
            },
          }
        );
        var url = await URL.createObjectURL(
          new Blob([data], { type: data.type })
        );
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },
  },
  async created(){
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeKantorRole = this.dataUser.kodeKantorRole
      // console.log(this.dataUser,'xxx')
      if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!this.dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        if (localStorage.hasOwnProperty("authPage")) {
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if(listPage.includes(this.$route.path.split("/")[1])){
            
            this.kodeKantorJajaran = this.dataUser.kodeKantorRole;
            await this.getListJenisArsip();
            await this.getListKantorJajaran();
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
