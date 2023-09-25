<template>
  <v-container fluid class="pa-10">
    <v-row>
      <v-col>
        <v-btn
          @click="back()"
          class="mr-2"
          medium
          outlined
          color="blue white--text darken-2"
        >
        <v-icon class="mr-2"> mdi-arrow-left </v-icon>
          KEMBALI
        </v-btn>
        <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL001') && stTl=='T'"  @click="doKonseptor">Persetujuan Konseptor</v-btn>
        <!-- <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL001') && stTl=='T'" :to="{ path: '/naskah-edit/'+idNaskah}">Edit Naskah</v-btn> -->
        <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL005') && stTl=='T'"  @click="doKonseptor">Pengecekan Tata Naskah</v-btn>
         <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL007') && stTl=='T'"  @click="doKonseptor">Pengecekan Tata Naskah SBD</v-btn>
        <v-btn  color="blue white--text darken-2" v-if="kodeTlSelected==='TL002' && stTl=='T'" :to="{ path: '/esign/'+indexTl }">TTD Elektronik</v-btn>
        <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL003') && showBtn && stTl=='T' && listBawahan" @click="doDisposisi">Disposisi</v-btn>
        <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL003') && showBtn && stTl=='T'" @click="doFeedBackDisposisi">Feedback</v-btn>
        <!-- <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL003') && showBtn && stTl=='T' && !listBawahan" @click="doFeedBackDisposisi">Feedback</v-btn> -->
        <v-btn  color="blue white--text darken-2" v-if="(kodeTlSelected==='TL004') && stTl=='T'" @click="doDisposisi">Teruskan</v-btn>
      </v-col>
    </v-row>
    <v-row>
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
              <v-btn class="ml-8 mb-1" text small @click="openFullPdfDispo()">CETAK</v-btn>
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
        <div style="padding-top: 20px">
          <template>
            <v-card v-if="showDispo || showFeedBack" class="mx-auto">
              <v-toolbar color="blue" dark>
                <v-toolbar-title>Informasi Naskah {{noNaskah}}</v-toolbar-title>
              </v-toolbar>
              <v-card v-if="showDispo || showFeedBack" flat>
                <v-card v-if="showDispo" flat>
                  <v-card class="pa-4" flat>
                    <div>
                      <v-icon color="grey" class="mr-2">mdi-file</v-icon>
                      <span class="text-uppercase"> Informasi Disposisi Naskah</span>
                    </div>
                  </v-card>
                  <v-card flat>
                    <v-list two line>
                      <v-list-item-group>
                        <div v-for="(item,index) in dataDisposisiKepadaUser" :key="index">
                          <v-list-item>
                            <v-list-item-content>
                              <template>
                                <v-container>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Dari
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        {{item.npkDisposisi+' - ' + item.namaDisposisi}}
                                      </v-col>
                                    </v-row>
                                        <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Kepada
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                          {{item.npkTerdisposisi +' - ' + item.namaTerdisposisi}}
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="item.stPps=='Y'" no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">

                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">PPS - {{item.ppsJabatan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" g="3">
                                          Pesan
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.keterangan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-0">
                                      <v-col sm="3" md="3" g="3">
                                          Date
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.tglDisposisiVal || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                </v-container>
                              </template>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider v-if="index + 1 < dataDisposisi.length" :key="index"/>
                        </div>
                      </v-list-item-group>
                    </v-list>
                  </v-card>
                </v-card>
                <v-expansion-panels flat>
                  <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                      <div>
                        <v-icon color="grey" class="mr-2">mdi-note-text</v-icon>
                        <span class="text-uppercase"> Informasi Detail Disposisi Naskah </span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item-group>
                          <div v-for="(item,index) in dataDisposisiEndToEnd" :key="index">
                          <v-list-item>
                            <v-list-item-content>
                              <template>
                                <v-container>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Dari
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        {{item.npkDisposisi+' - ' + item.namaDisposisi}}
                                      </v-col>
                                    </v-row>
                                        <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Kepada
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                          {{item.npkTerdisposisi +' - ' + item.namaTerdisposisi}}
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="item.stPps=='Y'" no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">

                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">PPS - {{item.ppsJabatan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" g="3">
                                          Pesan
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.keterangan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-0">
                                      <v-col sm="3" md="3" g="3">
                                          Date
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.tglDisposisiVal || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                </v-container>
                              </template>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider v-if="index + 1 < dataDisposisi.length" :key="index"/>
                        </div>
                        </v-list-item-group>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-card v-if="showDispo" flat>
                  <v-card class="pa-4" flat>
                    <div>
                      <v-icon color="grey" class="mr-2">mdi-pencil</v-icon>
                      <span class="text-uppercase">FeedBack</span>
                    </div>
                  </v-card>
                  <v-card flat>
                    <v-list>
                      <v-list-item-group>
                        <div v-for="(item,index) in dataFeedBackSesuaiBidang" :key="index">
                          <v-list-item :key="item.tglLog" class="pa-4">
                            <v-list-item-content>
                              <v-list-item-title v-text="item.nama"></v-list-item-title>
                              <v-text class="font-weight-regular text--secondary">{{item.feedBack}}</v-text>
                              <v-list-item-subtitle class="text--primary" v-text="parseDate(item.tglLog)"></v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-list-item-group>
                    </v-list>
                  </v-card>
                </v-card>
                <v-expansion-panels flat>
                  <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                      <div>
                        <v-icon color="grey" class="mr-2">mdi-note-text</v-icon>
                        <span class="text-uppercase"> Feedback Staff Lainnya</span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item-group>
                          <div v-for="(item,index) in dataFeedBackBidangLain" :key="index">
                            <v-list-item :key="item.tglLog" class="pa-4">
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="item.nama"
                                ></v-list-item-title>
                                <v-list-item-subtitle style="white-space: pre-wrap;"
                                  class="font-weight-regular"
                                  v-text="(item.feedBack)"
                                ></v-list-item-subtitle>
                                <v-list-item-subtitle
                                  class="text--primary"
                                  v-text="parseDate(item.tglLog)"
                                ></v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

               <!--  <v-expansion-panels flat>
                  <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                      <div>
                        <v-icon color="grey" class="mr-2">mdi-note-text</v-icon>
                        <span class="text-uppercase"> Feedback Staff Lainnya</span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item-group>
                          <div v-for="(item,index) in dataFeedBackBidangLain" :key="index">
                            <v-list-item :key="item.tglLog" class="pa-4">
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="item.nama"
                                ></v-list-item-title>
                                <v-list-item-subtitle style="white-space: pre-wrap;"
                                  class="font-weight-regular"
                                  v-text="(item.feedBack)"
                                ></v-list-item-subtitle>
                                <v-list-item-subtitle
                                  class="text--primary"
                                  v-text="parseDate(item.tglLog)"
                                ></v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels> -->

                <v-expansion-panels flat>
                  <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                      <div>
                        <v-icon color="grey" class="mr-2">mdi-file</v-icon>
                        <span class="text-uppercase">Informasi Disposisi Staff Lainnya</span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                    <v-list two line>
                      <v-list-item-group>
                        <div v-for="(item,index) in dataDiposisiInfoStaffLain" :key="index">
                          <v-list-item>
                            <v-list-item-content>
                              <template>
                                <v-container>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Dari
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        {{item.npkDisposisi+' - ' + item.namaDisposisi}}
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Kepada
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                          {{item.npkTerdisposisi +' - ' + item.namaTerdisposisi}}
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="item.stPps=='Y'" no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">

                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">PPS - {{item.ppsJabatan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <v-col sm="3" md="3" lg="3">
                                          Pesan
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.keterangan || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                    <v-row no-gutters class="mb-0">
                                      <v-col sm="3" md="3" lg="3">
                                          Date
                                      </v-col>
                                      <v-col sm="13" md="13" lg="13" offset-lg="0">
                                        <p class="text-uppercase">{{item.tglDisposisiVal || '-'}}</p>
                                      </v-col>
                                    </v-row>
                                </v-container>
                              </template>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider v-if="index + 1 < dataDisposisi.length" :key="index"/>
                        </div>
                      </v-list-item-group>
                    </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- <v-card v-if="showFeedBack">
                  <v-card class="pa-4"
                    ><div>
                      <v-icon color="grey" class="mr-2">mdi-pencil</v-icon
                      ><span class="text-uppercase"> Feedback</span>
                    </div></v-card
                  >
                  <v-card>

                    <v-list>
                      <v-list-item-group>
                        <div v-for="(item,index) in dataFeedBack" :key="index">
                          <v-list-item :key="item.tglLog" class="pa-4">
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.nama"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                class="font-weight-regular"
                                v-text="(item.feedBack)"
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle
                                class="text--primary"
                                v-text="parseDate(item.tglLog)"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-list-item-group>
                    </v-list>
                  </v-card>
                </v-card> -->
              </v-card>

              <!-- <v-list two-line subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-1 font-weight-light">{{
                      namaJenisNaskah
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      class="subtitle-1 justify-center font-weight-light"
                      >{{ noNaskah }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list> -->
              <v-simple-table v-if="hide" dense style="padding: 0px" class="pt-4">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th scope="col" class="text-left headline font-weight-black subtitle-1">
                        Nama Atribut
                      </th>
                      <th scope="col" class="text-left headline font-weight-black subtitle-1">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in docDetil" :key="item.namaAtribut">
                      <td class="subtitle-1">{{ item.namaAtribut }}</td>
                      <td class="subtitle-1">{{ item.objectValue }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </template>
          <!-- <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">Jenis Naskah</td>
                    <td>{{namaJenisNaskah}}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Nomor</td>
                    <td>{{noNaskah}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table> -->
          </div>
        </v-col>
        <v-dialog v-model="dialogFeedBack" max-width="500px">
          <v-card>
              <v-card-title> <v-icon class="mr-4">mdi-pencil</v-icon>
                Feedback Disposisi
              </v-card-title>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                  <v-textarea
                    v-model="feedback"
                    outlined
                    class="pa-8"
                    placeholder="Masukkan Feedback Disposisi"
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
                  @click="closeDialogFeedBack()"
                >
                  Close
                </v-btn>
                  <v-btn
                  :disabled="submitPermission"
                  min-width="100px"
                  color="primary"
                  @click="doSaveFeedBack()"
                >
                  Simpan
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

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
import pdf from "vue-pdf-signature";

import helper from "@/helpers/index";
import helpers from "@/helpers/index";

export default {
  middleware: "path",
  components: {
    pdf,
  },
  data(){
    return {
      // viewMasal : false,
      idNaskah: this.$route.params.id,
      indexTl: null,
      kodeTlSelected: null,
      stTl: null,
      objDisposisi: {},
      dataUser:{},
      noUrutTL: null,
      hide: false,
      showFeedBack : false,
      dataFeedBack: [],
      showBtn: false,
      ppsPosId:'T',
      submitPermission:true,
      kodeKantorTl: null,
      disposisiStatusSend:[],
      disposisiStatusReceive:[],
      showDispo:false,
      showDispoAsSender:false,
      showDispoAsReceiver:false,
      dialogFeedBack:false,
      feedback:'',
      src: "",
      tlDetil:[],
      dataDisposisi:[],
      dataTerdisposisi:[],
      dataDisposisiKepadaUser:[],
      dataDisposisiEndToEnd:[],
      dataDiposisiInfoStaffLain:[],
      fileBase64: "",
      pdfViewSrc:"",
      pdfViewSrc2:"",
      namaJenisNaskah: "",
      kodeJenisNaskah: "",
      noNaskah: "",
      listBawahan: false,
      docDetil: [],
      kodeTl: '',
      overlay: false,
      dataFeedBackSesuaiBidang: [],
      dataFeedBackBidangLain: [],
      //pdf
      numPages: 0,
      rotate: 0,
      currentPage: 1,
      pageCount: 1,
      pageScale: 1,
      zoom: "100%",
      loadedRatio: 0,
      page: 1,
      pages: 0,
      totalData: 0,
      // rows:[],
      // options:{
      //   page: 1,
      //   itemsPerPage:15
      // },
      // headers: [
      //     { text: "No.", value: "no", sortable: false },
      //     { text: "Nomor Naskah", value: "noNaskah", sortable: false, },
      //     { text: "Tujuan", value: "tujuan", sortable: false, },
      //     // { text: "Id Naskah", value: "idNaskah", sortable: false, },
      //     { text: "Action", value: "action", sortable: false, align: 'center' }
      //     ],
    }
  },
  watch:{
    feedback(val){
      if(val.length>=3){
        this.submitPermission = false
      } else {
        this.submitPermission = true
      }
    },
    // options: {
    //   handler() {
    //     this.getInfoNaskahMasal();
    //   },
    // },
    deep: true,
  },
  methods: {
    closeDialogFeedBack(){
      this.feedback = '';
      this.dialogFeedBack = false;
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
    doFeedBackDisposisi(){
      this.dialogFeedBack=true;

    },
    parseDate(val) {
      return this.$moment(val).format('DD/MM/YYYY');
    },
    doDisposisi(){
      const dataobj = {
            'kodeTl':this.objDisposisi.kodeTl,
            'npk': this.objDisposisi.npk,
            'noUrut':this.objDisposisi.noUrut,
            'noUrutTl': this.objDisposisi.noUrutTl,
            'indexTl': this.objDisposisi.indexTl,
      }
      var obj = helper.encrypt(JSON.stringify(dataobj));
      this.$router.push({
          path: '/disposisi/'+this.idNaskah,
          query: {
              obj
          }
      })
    },
    getInfoFeedBack: async function () {
      // this.overlay = true;
      // console.log(this.kodeKantorTl,'kodetlfeedback')
      // await this.getDataKaryawan();
      this.$axios.get(`/naskah/tr/feedback/${this.idNaskah}`,{
            params:{
                    id              : this.idNaskah,
                    kodeKantor      : this.kodeKantorTl,
                    npk             : this.dataUser.npk,
                    kodeRole        : this.dataUser.kodeRole,
                    positionLevel   : this.dataUser.positionLevel
                  }
          }).then((response) => {
              // this.overlay = false;
              // console.log('ini data feedback')
              if(response.data.data != undefined) {
                // console.log(response)
                // const responseArray = response.data.data
                // let arrayFeedBack = responseArray.filter(item=>item.kodeTl=='TL003')
                // let maxId = Math.max.apply(Math, arrayFeedBack.map(function(o) { return o.id; }))
                // console.log('ini id',maxId)
                // this.dataFeedBack = arrayFeedBack.filter(item=>item.id==maxId).map(item=>({
                //   namaAtribut : 'Feedback',
                //   feedBack : item.keterangan,
                //   tglLog : item.tglLog,
                //   petugasRekam: item.petugasRekam
                // }))
                const responseArray = response.data.data
                this.dataFeedBack = responseArray.map(item=>({
                  namaAtribut : 'Feedback',
                  nama: item.nama,
                  feedBack : item.keterangan,
                  tglLog : item.tglTl,
                  petugasRekam: item.petugasRekam,
                  jenis: item.jenis
                }))

                this.dataFeedBackSesuaiBidang = this.dataFeedBack.filter(item=>(item.jenis == "INFO FEEDBACK"))
                this.dataFeedBackBidangLain = this.dataFeedBack.filter(item=>(item.jenis == "INFO FEEDBACK LAIN"))
                // console.log('data feedback')
                // console.log(this.dataFeedBack)
                this.showFeedBack = this.dataFeedBack.length > 0 && (this.kodeTlSelected == 'TL003' || this.kodeTlSelected == 'TL004')?true:false
              } else {
                this.dataFeedBack = [];
                this.showFeedBack = false;
              }
            })
    },
    // getInfoNaskahMasal: async function () {
    //   let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
    //   const { page, itemsPerPage } = this.options;
    //   this.$axios.post(`/naskah/tr/masal`,{
    //                 page  :page,
    //                 length:itemsPerPage,
    //                 idNaskah    :this.idNaskah
    //       })
    //       .then((res)=>{
    //       console.log(res.data)
    //       if(res.data.rowCount >=0){
    //         const items = [];
    //         let seq = noIndex-1
    //         console.log(this.filterTab)
    //         res.data.data.forEach(item => {
    //           seq++
    //           items.push({
    //           no: seq,
    //           pathUrl: process.env.baseURL2 + "/arsip/pdf?path=" + this.$encrypt(item.namaFile),
    //           ...item,
    //           })
    //         });
    //          console.log(items)

    //         this.rows = items
    //         this.totalData = Number(res.data.rowCount);
    //       }
    //       else {
    //         this.rows = [];
    //       }
    //       this.overlay = false;
    //       this.isLoaded = true;
    //     })
    //     .catch((error) => {
    //       this.rows = [];
    //       console.error(error);
    //       this.overlay = false;
    //       this.isLoaded = true;
    //       // this.$swal(
    //       //   "Galat",
    //       //   "Gagal Request Ke Server",
    //       //   "error"
    //       // );
    //     });
    // },
    // downloadAll: async function (fulldata) {
    //   try {
    //     this.overlay = true;
    //     let { data } = await this.$axios.post(`/naskah/tr/documentMasal`,
    //       {

    //         data : fulldata
    //       }
    //     );
    //     const byteCharacters = atob(data.zipBase64);
    //         const byteArrays = [];
    //         for (
    //           let offset = 0;
    //           offset < byteCharacters.length;
    //           offset += 512
    //         ) {
    //           const slice = byteCharacters.slice(offset, offset + 512);
    //           const byteNumbers = new Array(slice.length);
    //           for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //           }
    //           const byteArray = new Uint8Array(byteNumbers);
    //           byteArrays.push(byteArray);
    //         }
    //         const blob = new Blob(byteArrays, { type: "application/zip" });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute("download", Date.now() + ".zip");
    //         document.body.appendChild(link);
    //         link.click();
    //     this.overlay = false;
    //   } catch (error) {
    //     this.overlay = false;
    //     this.$swal("Error", "Gagal request ke server!", "error");
    //     console.log(error.message.toString());
    //   }
    // },
    getDataKaryawan: async function () {
      // this.overlay = true;
      // await this.doGetInfoDisposisi();
      // console.log(this.objDisposisi,'xxxx',this.ppsPosId)
      const { data } = await this.$axios.get("/hcis/karyawanDisposisi",{
            params:{
              npk: this.objDisposisi.npk,
              kodeTl:this.objDisposisi.kodeTl,
              kodeKantorTl:this.kodeKantorTl,
              ppsPosId: this.ppsPosId,
              kodeJenisNaskah:this.kodeJenisNaskah,
              reqJenis : 'COUNT'
            }
          });
        // this.overlay = false

        if(data.data){
          this.listBawahan = data.data[0].jumlahData > 0?true : false;
        }

        // console.log(this.listBawahan,'this.listBawahan')
        this.showBtn = true;
    },
    doKonseptor(){
      const dataobj = {
            'kodeTl':this.objDisposisi.kodeTl,
            'npk': this.objDisposisi.npk,
            'noUrut':this.objDisposisi.noUrut,
            'noUrutTl': this.objDisposisi.noUrutTl,
            'indexTl': this.objDisposisi.indexTl,
            'kodeTlSelected': this.kodeTlSelected,
            'stTl': this.stTl
      }
      var obj = helper.encrypt(JSON.stringify(dataobj));
      this.$router.push({
          path: '/naskah/'+this.idNaskah,
          query: {
              obj
          }
      })
    },
    doGetInfoDisposisi: async function () {
      return this.$axios.get("/naskah/tr/disposisi",{
        params:{
          id            : this.idNaskah,
          kodeKantor    : this.kodeKantorTl,
          npk           : this.dataUser.npk,
          kodeRole      : this.dataUser.kodeRole,
          positionLevel : this.dataUser.positionLevel
        }
      })
      .then((res) => {
        /* if(this.dataUser.positionLevel == 1 || this.dataUser.kodeRole == '1920' || this.dataUser.kodeRole == '1926' ){ */
          let resData = res.data
          console.log('dispo',resData)
          console.log('dispo2',this.dataUser.positionLevel)
          console.log('dispo3',this.dataUser.kodeRole)
        // console.log(resData.dataDispoNaskah.data)
        if (resData.dataDispoNaskah != undefined || resData.dataDispoEndToEnd != undefined) {
          const items = [];
          const items2 = [];
          if(resData.dataDispoNaskah.data){
            resData.dataDispoNaskah.data.forEach((item) => {
              let seq = 0;
              items.push({
                no: seq++,
                ...item,
              });
            });
          }
          if(resData.dataDispoEndToEnd.data){
            resData.dataDispoEndToEnd.data.forEach((item2) => {
              let seq = 0;
              items2.push({
                no: seq++,
                ...item2,
              });
            });
          }
          this.dataDisposisi = items;
          this.dataDisposisi2 = items2;
          this.dataDisposisiKepadaUser = this.dataDisposisi.filter(item=>(item.jenis=="INFO_KIRIM"))
          this.dataDisposisiEndToEnd = this.dataDisposisi2.filter(item=>(item.jenis=="INFO_KIRIM"))
          this.dataDiposisiInfoStaffLain = this.dataDisposisi.filter(item=>(item.jenis=="INFO_KIRIM_STAFF_LAIN"))


          if(this.dataDisposisi.length!=0 && (this.kodeTlSelected == 'TL003' || this.kodeTlSelected == 'TL004')){
            this.showDispo = true;
          }
          // console.log(resData, this.tlDetil.npk, 'xxxxxxx', this.tlDetil.npkDisposisi)
          // this.disposisiStatusSend = this.dataDisposisi.filter(item=>item.npkDisposisi == this.tlDetil.npkDisposisi);
          this.disposisiStatusReceive = resData.dataDispoNaskah.data.filter(item=>item.jenis == 'INFO_KIRIM' && item.npkDisposisi == this.tlDetil.npkDisposisi && item.npkTerdisposisi == this.tlDetil.npk);
          // console.log(this.disposisiStatusReceive,'yyyyy', this.disposisiStatusReceive.length,'akjskajsk')

          if(this.disposisiStatusReceive.length >0){
            this.ppsPosId = this.disposisiStatusReceive[0].ppsPosId=='' || this.disposisiStatusReceive[0].ppsPosId==null?'T':this.disposisiStatusReceive[0].ppsPosId
          }else{
            this.ppsPosId = 'T'
          }
          // console.log(this.ppsPosId)

          // this.overlay = false;
        } else {
          this.dataDisposisi = [];
          this.disposisiStatusSend = [];
          this.disposisiStatusReceive = [];
          this.showDispo = false;
          // this.overlay = false;
        }
        /* else{
          //console.log(resData,res.data)
        let resData = res.data.dataDispoNaskah.data
        // console.log(resData)
        if (resData != undefined) {
          const items = [];
          resData.forEach((item) => {
            let seq = 0;
            items.push({
              no: seq++,
              ...item,
            });
          });
          // console.log(items)
          this.dataDisposisi = items;
          this.dataDisposisiKepadaUser = this.dataDisposisi.filter(item=>(item.jenis=="INFO_KIRIM"))
          this.dataDiposisiInfoStaffLain = this.dataDisposisi.filter(item=>(item.jenis=="INFO_KIRIM_STAFF_LAIN"))


          if(this.dataDisposisi.length!=0 && (this.kodeTlSelected == 'TL003' || this.kodeTlSelected == 'TL004')){
            this.showDispo = true;
          }
          // console.log(resData, this.tlDetil.npk, 'xxxxxxx', this.tlDetil.npkDisposisi)
          // this.disposisiStatusSend = this.dataDisposisi.filter(item=>item.npkDisposisi == this.tlDetil.npkDisposisi);
          this.disposisiStatusReceive = resData.filter(item=>item.jenis == 'INFO_KIRIM' && item.npkDisposisi == this.tlDetil.npkDisposisi && item.npkTerdisposisi == this.tlDetil.npk);
          // console.log(this.disposisiStatusReceive,'yyyyy', this.disposisiStatusReceive.length,'akjskajsk')

          if(this.disposisiStatusReceive.length >0){
            this.ppsPosId = this.disposisiStatusReceive[0].ppsPosId=='' || this.disposisiStatusReceive[0].ppsPosId==null?'T':this.disposisiStatusReceive[0].ppsPosId
          }else{
            this.ppsPosId = 'T'
          }
          // console.log(this.ppsPosId)

          // this.overlay = false;
        } else {
          this.dataDisposisi = [];
          this.disposisiStatusSend = [];
          this.disposisiStatusReceive = [];
          this.showDispo = false;
          // this.overlay = false;
        }
        } */

      })
      .catch((error) => {
        this.dataDisposisi = [];
        console.error(error);
        this.overlay = false;
        // this.$swal(
        //   "Galat",
        //   "Gagal Request Ke Server",
        //   "error"
        // );
      });
    },
    back() {
      // console.log(window,'xxxxxxxxxxx')
      window.history.back();
    },
    async getAtributNaskah() {
      this.overlay = true;
      this.$axios.get("/naskah/" + this.indexTl)
      .then((response) => {
        // this.overlay = false;
        const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path="
        + this.$encrypt(response.data.lastFile[0].lastFile);
        // console.log('fileee',response.data.lastFile[0].lastFile)
        // console.log('endpoin',naskahUrl)
        this.$axios.get(naskahUrl, {baseURL:null, responseType: "arraybuffer", transformResponse: []})
        .then(async (res) => {
          this.src = pdf.createLoadingTask({data:res.data});
          // console.log('dokumen load', this.src)
          if (this.src) {
            this.src.promise.then((pdf) => {
              this.numPages = pdf.numPages;
            });
          }
        })
        .catch(async (error) => {
          console.error(error)
        });

        this.pdfViewSrc = naskahUrl

        this.tlDetil = response.data.tlDetil[0]
        this.noUrutTL = response.data.tlDetil[0].noUrut;
        this.kodeKantorTl = response.data.tlDetil[0].kodeKantor;
        this.kodeTl = response.data.data[0].kodeTl;
        this.namaJenisNaskah = response.data.data[0].namaJenisNaskah;
        this.kodeJenisNaskah = response.data.data[0].kodeJenisNaskah;
        this.noNaskah = response.data.data[0].noNaskah;

        if(this.kodeTlSelected == 'TL003' || this.kodeTlSelected == 'TL004' ){
          const promise1 = this.doGetInfoDisposisi();
          Promise.all([promise1]).then((values) => {
              const promise2 = this.tlDetil.stTl == 'T'?this.getDataKaryawan():[];
              const promise3 = this.getInfoFeedBack();
              Promise.all([promise1, promise2, promise3]).then((values) => {
                  this.overlay = false;
                  this.showBtn = true;
              })
          })
        } else{
          this.overlay = false;
        }

      })
      .catch((error) => {
        this.overlay = false;
        console.error(error);
        this.$swal(error, "Tidak dapat memuat naskah!", "error");
      });
    },
    async getDataNaskah() {
      this.$axios
      .get("/naskah/detail-disposisi/"+ this.idNaskah, {
        params:{
          indexTl            : this.indexTl
        }
      })
      .then((response) => {
        if(response.data.ret == '0' && response.data.data){
          let res = response.data.data.filter((item,index) => item.indexTl == this.indexTl)
          if (res.length > 0) {

            //auth
            let dataNaskah = res[0]
            // console.log('auth:',dataNaskah, this.indexTl, this.dataUser)
            if ( this.indexTl!=dataNaskah.indexTl
                  && this.dataUser.npk!=dataNaskah.npk
                  && this.dataUser.kodeKantorRole!=dataNaskah.kodeKantor
              ) {
              this.$swal("", 'Tidak memiliki akses naskah',"error").then((okay) => {
                if (okay) { this.$router.push("/inbox"); }
              });
              return
            }

            this.stTl = res[0].stTl;
            this.kodeTlSelected = res[0].kodeTl;
            this.objDisposisi = res[0];
            if (res[0].isRead==='T'){
              this.doUpdateStatusRead(res[0].kodeTl);
            }
            if (res[0].stMasal == 'Y'){
              // this.viewMasal = true
            }
            this.getAtributNaskah();
          } else {
            this.overlay = false;
            this.$swal("Galat","Tidak dapat memuat data naskah!", "error");
          }
        }else{
          this.overlay = false;
          this.$swal("Galat","Tidak dapat memuat data naskah!", "error");
        }
      })
      .catch((error) => {
        this.overlay = false;
        console.error(error);
      });
    },
    async doUpdateStatusRead() {
      this.overlay = true;
      await this.$axios
        .put("/naskah/tr/" + this.idNaskah, {
          petugas: this.dataUser.kodeUser,
          kode_tl: this.kodeTl

        })
        .then((res)=>{
          this.overlay = false;
        })
        .catch((err) => {
          // handle error
          this.overlay = false;
          console.log(err);
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
    },
    openFullPdfDispo () {
      const url = process.env.baseURL2 + "/arsip/cetak/getPdfDispo"
      // console.log(url)
      const qs = {
        id: this.idNaskah,
        kodeKantor: this.dataUser.kodeKantorRole,
        npk: this.dataUser.npk,
        kodeRole: this.dataUser.kodeRole,
        positionLevel: this.dataUser.positionLevel,
        kodeUser: this.dataUser.kodeUser
      }
      this.$axios.get(url, { params:qs, baseURL:null, responseType: "blob", transformResponse: [] }        )
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

    this.overlay = true;
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
            // this.getInfoNaskahMasal()
            if(this.$route.query.obj){
              let dataObjDecrypted = helper.decrypt(this.$route.query.obj);
              let dataObj = JSON.parse(dataObjDecrypted);
              if(dataObj.indexTl){
                this.indexTl = dataObj.indexTl

                //auth
                const checkNpkTl = await this.$axios.get('/naskah/tl/'+this.$route.params.id)
                const arrCheckNpkTl = checkNpkTl.data.data.map(person => (person.npk.trim()));
                // console.log('auth:',arrCheckNpkTl, this.dataUser.npk)
                if (! arrCheckNpkTl.includes(this.dataUser.npk) ) {
                  this.$swal("", 'Tidak memiliki akses tindak lanjut',"error").then((okay) => {
                    if (okay) { this.$router.push("/inbox"); }
                  });
                  return
                }

                this.getDataNaskah()
              }else{
                this.$router.push({ path: "/inbox" });
              }
            }else{
              this.$router.push({ path: "/inbox" });
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
