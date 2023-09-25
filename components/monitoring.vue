<template>
      <v-col v-show="isLoaded">
        <!-- START FILTER TAB DRAFT -->
        <v-data-table
          v-model="selectedNaskah"
          dense
          v-show="isLoaded"
          :headers="headers"
          :items="rows"
          :hide-default-footer="false"
          :options.sync="options"
          :server-items-length="totalData"
          :footer-props="{'items-per-page-options':[15,50,100],'show-current-page':true,'show-first-last-page':true}"
          class="elevation-1"
          show-select
          v-if="this.filterTab=='draft'"
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
                  v-on:keyup.enter="doSearchFilter()"
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
                    <v-icon v-on="on" left>mdi-arrow-down-drop-circle-outline</v-icon>
                </template>
                <v-card
                  min-width="400"

                >
                  <v-card-text class="pa-6">
                <template>
                  <form>
                    <v-text-field
                      v-model="filter.noNaskah"
                      label="Nomor Naskah"

                    />
                    <!-- <v-select
                      v-model="filter.jenisNaskah"
                      label="Jenis Naskah"
                      :items="itemsJenisNaskah"
                    /> -->
                    <v-select
                      v-model="filter.jenisMonitoringNaskah"
                      label="Jenis Monitoring Naskah"
                      :items="itemsJenisMonitoringNaskah"
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
                        @click="getListNaskah"
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
          <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-checkbox v-if="item.stDraft=='Y'" v-model="selectedNaskah" :value="item" style="margin:0px;padding:0px" hide-details />
                </td>
                <td align="center">
                  <v-icon small v-if="item.jenisMonitoringNaskah=='NASKAH KELUAR'" color="green" @mouseover="doDetil(item.dari, item.kepada)">
                        mdi-send
                      </v-icon>
                  <v-icon small v-if="item.jenisMonitoringNaskah=='NASKAH MASUK'" color="blue" @mouseover="doDetil(item.dari, item.kepada)">
                        mdi-inbox
                      </v-icon>
                </td>
                <!-- <td>{{ item.no }}.</td> -->
                <td v-if="item.stMasal=='Y'">MASSAL</td>
                <td v-if="item.stMasal!='Y'">{{ item.no_naskah }}</td>
                <!-- <td>{{ item.namaJenisNaskah==null?'-':item.namaJenisNaskah.toUpperCase() }}</td> -->
                <td>{{ item.perihal==null?'-':item.perihal.toUpperCase() }}</td>
                <!-- <td v-if="item.stDraft=='T'">-</td>
                <td v-if="item.stDraft!='T'">
                  <v-icon small :color="item.colorDraft">
                    {{item.iconDraft}}
                    </v-icon>
                    </td> -->
                <td>
                    <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon  v-bind="attrs" v-on="on" small :color="item.colorSend">{{item.iconSend}}</v-icon>
                    </template>
                    <!-- <span>{{item.tglBatal}} <br>{{item.ketBatal}}</span> -->
                    <span v-if="item.stSend=='Y'&& item.stBatal=='Y'">{{item.tglBatal}} <br>{{item.ketBatal}}</span>
                    <span v-if="item.stSend=='Y'&& item.stBatal=='T'">Terkirim</span>
                    <span v-if="item.stSend=='D' && item.stBatal=='T'">Edit</span>
                    <span v-if="item.stSend=='D' && item.stBatal=='T'">Hapus</span>
                    <span v-if="item.stSend=='T' && item.stBatal=='T'">Dalam Proses</span>
                    <!-- <span v-else>Dalam Proses</span> -->
                  </v-tooltip>
                  </td>
                <td>{{ parseDateNormal(item.tglUpdate)}}</td>
                <td v-if="item.jenisMonitoringNaskah=='NASKAH EKSTERNAL' && item.stPemindahanArsip == 'T'">Arsip Konvensional</td>
                <td v-if="item.jenisMonitoringNaskah!='NASKAH EKSTERNAL' && item.stPemindahanArsip == 'T'">
                  <v-btn icon v-if="((item.stDraft!='Y'||item.stSend=='Y')&&item.stMasal=='T')" @click="doDetilNaskahMonitoring(item)"
                      class="mr-2" color="info"  small >
                        <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)==0))" @click="doDetilNaskahMonitoring(item)"
                      class="mr-2" color="info"  small >
                        <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <span v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)>0))">
                  <v-icon 
                        v-bind="attrs"
                        v-on="on"
                        >mdi-timer-sand</v-icon>
                    Sedang dalam proses ..
                  </span>
                  <v-btn class="mr-2" color="info" v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)==0))" small @click="openDialog(item.idNaskah)" >
                      MASSAL
                  </v-btn>
                  <v-btn icon color="teal" v-if="(item.jenisMonitoringNaskah!='NASKAH MASUK') && ((item.stDraft=='Y' && item.stSend=='T') || item.stSend=='D')" :to="{ path: '/naskah-edit/'+item.idNaskah }"
                      class="mr-2 white--text" small >
                          <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="teal" v-if="item.stFileKonvensional=='Y' && item.namaFileHist1==null && item.noNaskah != '' && item.kodeJenisNaskah == 'NKH0024'" @click="uploadItem(item)" class="mr-2 white--text" small >
                    <v-icon>mdi-upload</v-icon>
                  </v-btn>
                  <v-btn icon color="red" v-if="(item.jenisMonitoringNaskah!='NASKAH MASUK') && ((item.stDraft=='Y' && item.stSend=='T') || item.stSend=='D')" @click="deleteItem(item)"
                      class="mr-2 white--text" small >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <!-- <v-btn class="mr-2" color="info" v-if="item.stMasal=='Y'" small @click="getListNaskahMasal(item.idNaskah)" >
                      Masal
                </v-btn> -->
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
        <!-- END FILTER TAB DRAFT -->
        <!-- START FILTER TAB KOREKSI TERKIRIM BATAL -->
        <v-data-table
          dense
          v-show="isLoaded"
          :headers="headers"
          :items="rows"
          :hide-default-footer="false"
          :options.sync="options"
          :server-items-length="totalData"
          :footer-props="{'items-per-page-options':[15,50,100],'show-current-page':true,'show-first-last-page':true}"
          class="elevation-1"
          v-else
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
                  v-on:keyup.enter="doSearchFilter()"
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
                    <v-icon v-on="on" left>mdi-arrow-down-drop-circle-outline</v-icon>
                </template>
                <v-card
                  min-width="400"

                >
                  <v-card-text class="pa-6">
                <template>
                  <form>
                    <v-text-field
                      v-model="filter.noNaskah"
                      label="Nomor Naskah"

                    />
                    <v-select
                      v-model="filter.jenisNaskah"
                      label="Jenis Naskah"
                      :items="itemsJenisNaskah"
                    />
                    <v-select
                      v-model="filter.jenisMonitoringNaskah"
                      label="Jenis Monitoring Naskah"
                      :items="itemsJenisMonitoringNaskah"
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
                        @click="getListNaskah"
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
          <template v-slot:item="{ item }">
              <tr>
                <td align="center">
                  <v-icon small v-if="item.jenisMonitoringNaskah=='NASKAH KELUAR'" color="green" @mouseover="doDetil(item.dari, item.kepada)">
                        mdi-send
                      </v-icon>
                  <v-icon small v-if="item.jenisMonitoringNaskah=='NASKAH MASUK'" color="blue" @mouseover="doDetil(item.dari, item.kepada)">
                        mdi-inbox
                      </v-icon>
                </td>
                <!-- <td>{{ item.no }}.</td> -->
                <td v-if="item.stMasal=='Y'">MASSAL</td>
                <td v-if="item.stMasal!='Y'">{{ item.no_naskah }}</td>
                <!-- <td>{{ item.namaJenisNaskah==null?'-':item.namaJenisNaskah.toUpperCase() }}</td> -->
                <td>{{ item.perihal==null?'-':item.perihal.toUpperCase() }}</td>
                <!-- <td v-if="item.stDraft=='T'">-</td>
                <td v-if="item.stDraft!='T'">
                  <v-icon small :color="item.colorDraft">
                    {{item.iconDraft}}
                    </v-icon>
                    </td> -->
                <td>
                    <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon  v-bind="attrs" v-on="on" small :color="item.colorSend">{{item.iconSend}}</v-icon>
                    </template>
                    <!-- <span>{{item.tglBatal}} <br>{{item.ketBatal}}</span> -->
                    <span v-if="item.stSend=='Y'&& item.stBatal=='Y'">{{item.tglBatal}} <br>{{item.ketBatal}}</span>
                    <span v-if="item.stSend=='Y'&& item.stBatal=='T'">Terkirim</span>
                    <span v-if="item.stSend=='D' && item.stBatal=='T'">Edit</span>
                    <span v-if="item.stSend=='D' && item.stBatal=='T'">Hapus</span>
                    <span v-if="item.stSend=='T' && item.stBatal=='T'">Dalam Proses</span>
                    <!-- <span v-else>Dalam Proses</span> -->
                  </v-tooltip>
                  </td>
                <td>{{ parseDateNormal(item.tglUpdate)}}</td>
                <td v-if="item.jenisMonitoringNaskah=='NASKAH EKSTERNAL' && item.stPemindahanArsip == 'T'">Arsip Konvensional</td>
                <td v-if="item.jenisMonitoringNaskah!='NASKAH EKSTERNAL' && item.stPemindahanArsip == 'T'">
                  <v-btn icon v-if="((item.stDraft!='Y'||item.stSend=='Y')&&item.stMasal=='T')" @click="doDetilNaskahMonitoring(item)"
                      class="mr-2" color="info"  small >
                        <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)==0))" @click="doDetilNaskahMonitoring(item)"
                      class="mr-2" color="info"  small >
                        <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <span v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)>0))">
                  <v-icon 
                        v-bind="attrs"
                        v-on="on"
                        >mdi-timer-sand</v-icon>
                    Sedang dalam proses ..
                  </span>
                  <v-btn class="mr-2" color="info" v-if="((item.stDraft!='Y'||item.stSend=='Y')&&(item.stMasal=='Y' && parseInt(item.stProsesMasal)==0))" small @click="openDialog(item.idNaskah)" >
                      MASSAL
                  </v-btn>
                  <v-btn icon color="teal" v-if="(item.jenisMonitoringNaskah!='NASKAH MASUK') && ((item.stDraft=='Y' && item.stSend=='T') || item.stSend=='D')" :to="{ path: '/naskah-edit/'+item.idNaskah }"
                      class="mr-2 white--text" small >
                          <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="teal" v-if="item.stFileKonvensional=='Y' && item.namaFileHist1==null && item.noNaskah != '' && item.kodeJenisNaskah == 'NKH0024'" @click="uploadItem(item)" class="mr-2 white--text" small >
                    <v-icon>mdi-upload</v-icon>
                  </v-btn>
                  <v-btn icon color="red" v-if="(item.jenisMonitoringNaskah!='NASKAH MASUK') && ((item.stDraft=='Y' && item.stSend=='T') || item.stSend=='D')" @click="deleteItem(item)"
                      class="mr-2 white--text" small >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <!-- <v-btn class="mr-2" color="info" v-if="item.stMasal=='Y'" small @click="getListNaskahMasal(item.idNaskah)" >
                      Masal
                </v-btn> -->
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
        <!-- END FILTER TAB KOREKSI TERKIRIM BATAL -->
        <!-- START FILTER TAB DRAFT -->
        <br>
        <v-row>
          <v-col>
            <v-btn
              :disabled="!isSelected"
              color="primary"
              left
              @click="deleteAllItem"
              v-if="this.filterTab=='draft'"
              >Delete All</v-btn
            >
          </v-col>
        </v-row>
        <!-- END FILTER TAB DRAFT -->

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
        <v-dialog v-model="dialogDeleteAll" max-width="340">
          <v-card>
            <v-card-title class="headline">Konfirmasi hapus</v-card-title>
            <v-card-text>Apakah Anda yakin menghapus semua data?</v-card-text>
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
              <v-btn color="grey" class="mr-2 white--text" @click="closeDeleteAll">Batal</v-btn>
              <v-btn :disabled="submitPermission" color="red" class="mr-2 white--text" @click="deleteAllData()">Hapus</v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>
        <masal-form-dialog 
        :prop="idNaskahMasal"
          @close="dlg=false"
          v-if="dlg"
          @click="getListNaskah(item)">
        </masal-form-dialog>
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
        <v-dialog v-model="dialogUploadKvs" max-width="700">
          <v-form  @submit.prevent="submitUploadKvs">          
            <v-card>
              <v-card-title class="headline">Upload berkas baru</v-card-title>
              <v-card-text>
                <v-file-input :rules="fileRules" show-size accept=".pdf" @change="changeFileUploadKvs" label="Dokumen" />
              </v-card-text>            
              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn color="primary" class="mr-2" @click="closeUploadKvs">Batal</v-btn>
                  <v-btn color="success" class="mr-2 white--text" type="submit" :disabled="!newFileKvs" >Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>
</template>

<script>
import helper from "@/helpers/index";
import masalFormDialog from "~/components/masalFormDialog";

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
        submitPermission:true,
        kepada: [],
        category: ["SEMUA","CATEGORY"],
        headers: [
          { text: "", value: "jenisMonitoringNaskah", sortable: false },
          // { text: "No.", value: "no", sortable: false },
          { text: "No. Naskah", value: "noNaskah", sortable: true },
          // { text: "Jenis Naskah", value: "namaJenisNaskah", sortable: false },
          { text: "Perihal", value: "perihal", sortable: true },
          // { text: "Status Draft", value: "stDraft", sortable: false },
          { text: "Status", value: "stSend", sortable: true },
          { text: "Terakhir Diperbarui", value: "lastUpdated", sortable: true },
          { text: "Aksi", value: "action", sortable: false }
        ],
        kodeKantorUser: null,
        page: 0,
        numberOfPages: 0,

        dialogUploadKvs: false,
        fileRules: [
          (value) =>
            !value ||
            value.size < 10000000 ||
            "File size should be less than 10 MB!",
        ],
        selectedIdNaskah: '',
        newFileKvs: null,
        dialogDeleteAll: false,
        dialogDelete: false,
        dialogForm: false,
        itemSelected: {},
        itemsJenisNaskah:[],
        itemsJenisMonitoringNaskah:
        [{
          value:'',
          text:'-- Semua --'
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
        isLoaded:false,
        overlay: true,
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
        selectedNaskah: [],
        dlg:false,
        idNaskahMasal: ''
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
    
    components: {
      masalFormDialog
    },

    computed:{
      isSelected() {
          return this.selectedNaskah.length > 0;
      },
    },
    
    methods: {
      doRefresh(){
        // console.log('do refresh')
        this.options.page = 1;
        this.doResetFilter();
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
      parseDateNormal(val){
        if(val){
            return this.$moment(val).format('DD/MM/YYYY HH:mm')
        } else {
          return '-'
        }
      },
      doResetFilter(){
        this.filter.namatl = '';
        this.filter.noNaskah = '';
        this.filter.keyword = '';
        this.filter.jenisMonitoringNaskah = '';
        this.filter.jenisNaskah = '';
        this.getListNaskah()
      },
      doSearchFilter(){
        this.options.page = 1;
        this.getListNaskah();
      },
      doDetilNaskahMonitoring(val){
        const dataobj = {
            'jenisMonitoringNaskah': val.jenisMonitoringNaskah,
            'kodeJenisNaskah': val.kodeJenisNaskah,
            'statusMassal':val.stMasal,
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
      
      deleteAllItem() {
        this.dialogDeleteAll = true
        console.log("deleteAllItem",this.selectedNaskah);
      },
      closeDeleteAll: async function() {
        this.loader = false
        this.dialogDeleteAll = false
      },
      async deleteAllData(){
        this.overlay = true
        let deletaAllArr = this.selectedNaskah.map(o => {
          return {
            idNaskah:o.idNaskah,
            noUrut:o.no
            };
          })
        console.log("deletaAllArr", deletaAllArr)
        var params = {
            ketHapus: this.ketHapus,
            kodeTl: "TL006",
            petugasHapus: this.dataUser.kodeUser,
            deletaAllArr: deletaAllArr,
          };
          console.log("params-front:", params)
          let { data } = await this.$axios.post("/naskah/hapus-all",params);
          this.result = data;
            if (this.result.ret == 0) {
              this.$swal("", "Data berhasil dihapus", "success");
              this.dialogDeleteAll = false
              this.getListNaskah();
              } else {
              this.$swal("", "Data gagal dihapus", "error");
              this.dialogDeleteAll = false
              this.getListNaskah();
              }
      },

      async getListNaskah() {
        // console.log(this.filterTab)
        //this.overlay = true;
        this.isLoaded = false;
        const { page, itemsPerPage, sortBy, sortDesc } = this.options;
        let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.$axios.get("/naskah/tr/list",{
          params:{
              page:page,
              length:itemsPerPage,
              npk: this.dataUser.npk,
              no_naskah: this.filter.noNaskah,
              kode_jenis_naskah: this.$route.query.f,
              keyword: this.filter.keyword,
              filterTab:this.filterTab,
              kodeKantor : this.dataUser.kodeKantorRole,
              positionLevel : this.dataUser.positionLevel,
              kodeFungsi: this.dataUser.kodeRole,
              monitoringNaskah: this.filter.jenisMonitoringNaskah
          }
        })
        .then((res)=>{
          if(res.data.rowCount >=0){
            let items = [];
            let seq = noIndex-1
            res.data.data.forEach(item => {
              // console.log(item.formData,"no:",seq);
              seq++
              items.push({
                no: seq,
                no_naskah: item.stMasal=='Y'? 'MASAL':item.noNaskah,
                iconDraft: item.stDraft=='D'?'mdi-pencil':item.stDraft=='Y'?'mdi-check':'mdi-timer-sand',
                colorDraft: item.stDraft=='Y'?'green':'orange',
                colorSend: (item.stSend=='D' && item.stBatal=='T')?'blue' : (item.stSend=='Y'&& item.stBatal=='T')?'green' : (item.stSend=='Y'&& item.stBatal=='Y')?'red' : 'orange',
                iconSend: (item.stSend=='D' && item.stBatal=='T')?'mdi-pencil': (item.stSend=='Y'&& item.stBatal=='T') ?'mdi-check': (item.stSend=='Y'&& item.stBatal=='Y') ?'batal' :'mdi-timer-sand',
                // colorSend: item.stSend=='Y'?'green':'orange',
                dari: item.formData != null ? (item.formData != '-' ? JSON.parse(item.formData).OBJ005 : '-') : '-',
                kepada: item.formData != null ? (item.formData != '-' ? JSON.parse(item.formData).OBJ004 : '-') : '-',
                ...item,
              })

            });
            // console.log('data here');
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
          this.isLoaded = true;
          console.error(error);
        });
      },
      uploadItem(item) {
        this.selectedIdNaskah = item.idNaskah
        this.dialogUploadKvs = true
      },
      closeUploadKvs() {
        this.dialogUploadKvs = false
      },
      changeFileUploadKvs(file) {
        const self = this;
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          function () {
            self.newFileKvs = reader.result;
          },
          false
        );

        if (file) {
          reader.readAsDataURL(file);
        } else {
          self.newFileKvs = "";
        }
      },
      async submitUploadKvs() {
        try {
            this.overlay = true;
            var params = {
              idNaskah: this.selectedIdNaskah,
              fileBase64: this.newFileKvs,
              petugas: this.dataUser.kodeUser,
              kodeKantor: this.dataUser.kodeKantorRole
            };            
            let { data } = await this.$axios.put("/naskah/file-konvensional", params);
            if (data.ret == 0) {
              this.overlay = false;
              this.dialogUploadKvs = false
              this.$swal("", "Proses Berhasil.", "success");
              this.getListNaskah()
            } else {
              this.overlay = false;
              this.dialogUploadKvs = false
              this.$swal("", this.result.msg, "error");
              this.getListNaskah()
            }
        } catch (error) {
          this.overlay = false;
          this.dialogUploadKvs = false
          this.$swal("", "Kesalahan Sistem", "error");
        }
      },
      openDialog(id){
        console.log("idNaskahMasal:", id)
        this.idNaskahMasal = id
        this.dlg=true
      }
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
