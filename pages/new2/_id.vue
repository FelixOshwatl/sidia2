<template>
  <div id="app">
    <v-container>
      <v-breadcrumbs large :items="breadcrumbItems">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.href">
            {{ item.text.toUpperCase() }}
          </v-breadcrumbs-item>
        </template>
        <!-- <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template> -->
      </v-breadcrumbs>

      <div>
        <v-expansion-panels accordion text hover :value="0" class="mb-5">
          <v-expansion-panel>
            <v-expansion-panel-header> Form </v-expansion-panel-header>
            <v-expansion-panel-content>

            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels accordion text hover :value="0">
          <v-expansion-panel v-if="kodeJenisNaskah == 'NKH0015'">
            <v-expansion-panel-header>
              Upload Surat Masuk
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout wrap>
                <v-flex xs12 sm8 md8 class="pa-5">
                  <v-card>
                    <v-card-text>
                      <v-file-input
                        :rules="
                          fileSuratMasukBase64 &&
                          !fileSuratMasukBase64.includes('JVBERi0')
                            ? ['File surat tidak sesuai format (.pdf)']
                            : fileRules
                        "
                        show-size
                        v-model="fileSuratMasuk"
                        accept=".pdf"
                        @change="uploadFileSuratMasuk"
                        label="Pilih file"
                      >
                      </v-file-input>
                      <v-btn
                        v-if="fileSuratMasukBase64 && showButtonView"
                        color="default"
                        @click="showFileSuratMasuk = !showFileSuratMasuk"
                        >{{
                          !showFileSuratMasuk ? "Lihat" : "Sembunyikan"
                        }}</v-btn
                      >
                      <div v-if="showFileSuratMasuk" class="mt-5">
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                            <v-btn
                              class="ml-2 mb-2"
                              text
                              small
                              @click="page > 1 ? page-- : 1"
                            >
                              <v-icon small>mdi-arrow-left</v-icon>
                            </v-btn>
                            <v-btn
                              class="ml-2 mb-2"
                              text
                              small
                              @click="page < pageCount ? page++ : 1"
                            >
                              <v-icon small>mdi-arrow-right</v-icon>
                            </v-btn>
                            <v-btn disabled class="ml-2 mb-2" text small>{{
                              page + "/" + pageCount
                            }}</v-btn>
                          </v-flex>
                          <pdf
                            :src="src"
                            :page="page"
                            @page-size="function (a, b, c) {pageScale = c;}"
                            @num-pages="pageCount = $event"
                            @page-loaded="currentPage = $event"
                            @link-clicked="page = $event"
                          ></pdf>
                        </v-layout>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm4 md4 class="pa-5">
                  <v-btn
                    color="success"
                    @click="saveSuratMasuk('Y')"
                    :disabled="!valid || !showButtonView"
                    >Simpan Draft</v-btn
                  >
                  <v-btn
                    color="success"
                    @click="saveSuratMasuk('T')"
                    :disabled="!valid || !showButtonView"
                    >Kirim</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-else-if="kodeJenisNaskah == 'NKH0021' || kodeJenisNaskah == 'NKH0022' || kodeJenisNaskah == 'NKH0026' || kodeJenisNaskah == 'NKH0027'">
            <v-expansion-panel-header>Naskah</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="smileFilePath"
                    label="File Path"
                    required
                    @change="loadSmileFilePath"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col col="3">
                  <v-text-field
                    type="number"
                    v-model="x1"
                    label="X1"
                  ></v-text-field>
                </v-col>
                <v-col col="3">
                  <v-text-field
                    type="number"
                    v-model="y1"
                    label="Y1"
                  ></v-text-field>
                </v-col>
                <v-col col="3">
                  <v-text-field
                    type="number"
                    v-model="x2"
                    label="X2"
                  ></v-text-field>
                </v-col>
                <v-col col="3">
                  <v-text-field
                    type="number"
                    v-model="y2"
                    label="Y2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="fileLampiranBase64 && fileLampiranBase64.includes('pdf') ">
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-btn class="mb-1" text small @click="page > 1 ? page-- : 1">
                      <v-icon small>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-btn class="mb-1" text small @click="page < pageCount ? page++ : 1">
                      <v-icon small>mdi-arrow-right</v-icon>
                    </v-btn>
                    <v-btn disabled class="mb-1" text small>{{page+"/"+pageCount}}</v-btn>
                    <v-btn disabled class="ml-2" text small>x:{{xAxis}} y:{{yAxis}}</v-btn>
                  </v-col>
                </v-row>
                <pdf
                  :src="src"
                  :page="page"
                  @page-size="function (a, b, c) {pageScale = c;}"
                  @num-pages="pageCount = $event"
                  @page-loaded="currentPage = $event"
                  @link-clicked="page = $event"
                ></pdf>
                <input v-model.number="pageScale" type="hidden" id="pageScale" />
                <input v-model.number="xAxis" type="hidden" id="xAxis" />
                <input v-model.number="yAxis" type="hidden" id="yAxis" />
              </div>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Source: SMILE</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-row align="center" justify="end">
                    <v-btn class="mr-2" color="primary" @click="updatePointer()" v-if="pointer && pointer != ''" :disabled="!valid">Update Pointer</v-btn>
                    <v-btn color="success" @click="saveExt('T')" :disabled="!valid || !fileLampiranBase64">Kirim</v-btn>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-else id="panelEditor">
            <v-expansion-panel-header> Editor </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- <input type="file" ref="docUpload" @change="onDocUpload" accept=".dotx,.docx,.docm,.dot,.doc,.rtf,.txt,.xml,.sfdt" /> -->
              <ejs-documenteditorcontainer
                ref="documenteditor"
                :serviceUrl="serviceUrl"
                height="600px"
                id="container"
                :enableToolbar="true"
                :toolbarItems="items"
                :enableSfdtExport="true"
                :enableWordExport="true"
                :enableSelection="true"
                :enableEditor="true"
                :created="onCreate()"
              />

              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Syncfusion Essential JS 2</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-row align="center" justify="end">
                    <v-btn class="mr-2" color="primary" @click="download">Preview PDF</v-btn>
                    <v-btn class="mr-2" color="success" @click='saveAsDocx' >Simpan Docx</v-btn>
                    <!-- <v-btn color="success" @click='saveAsSfdt' >Simpan Sfdt</v-btn> -->
                    <!-- <v-btn @click='saveAsTxt' >Save Txt</v-btn> -->
                    <!-- <v-btn @click='print' >Print</v-btn> -->
                    <v-btn class="mr-2" color="primary" @click="save('Y')" :disabled="!valid" v-if="kodeJenisNaskah != 'NKH0023' || (kodeJenisNaskah == 'NKH0023' && pemindahan) || kodeJenisNaskah != 'NKH0024'">Simpan Draft</v-btn>
                    <v-btn color="primary" @click="konfirmasi()" :disabled="!valid">Kirim</v-btn>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      </v-overlay>
      <v-dialog
        v-model="dialogKonfirmasi"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
      <v-card style="background-color: #f8f9fe">
        <v-toolbar dark color="primary" dense flat>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark @click="dialogKonfirmasi = false" v-bind="attrs" v-on="on">
              <v-icon>mdi-close</v-icon></v-btn>
            </template>
            <span>Batal</span>
          </v-tooltip>

          <v-toolbar-title class="flex text-center">Konfirmasi</v-toolbar-title>
          <v-toolbar-items>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="save('T')" v-bind="attrs" v-on="on">
                <v-icon>mdi-send</v-icon>
              </v-btn>
              </template>
              <span>Kirim</span>
            </v-tooltip>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
            <v-row align="center" justify="center" class="pt-4">
              <p>
                <v-btn text @click="pageKonfirmasi > 1 ? pageKonfirmasi-- : 1">
                  <v-icon >mdi-arrow-left</v-icon>
                </v-btn>
                <v-btn disabled text >{{pageKonfirmasi+"/"+pageCountKonfirmasi}}</v-btn>
                <v-btn text @click="pageKonfirmasi < pageCountKonfirmasi ? pageKonfirmasi++ : 1">
                  <v-icon >mdi-arrow-right</v-icon>
                </v-btn>
              </p>
            </v-row>
            <v-row align="center" justify="center" class="ma-auto" elevation="1">
              <pdf
                :src="srcKonfirmasi"
                :page="pageKonfirmasi"
                @page-size="function (a, b, c) { pageScale=c }"
                @num-pages="pageCountKonfirmasi = $event"
                @page-loaded="currentPageKonfirmasi = $event"
                @link-clicked="pageKonfirmasi = $event"
                :style="{inline:'',width:'100%',maxWidth:'440px'}"
              ></pdf>
            </v-row>
        </v-card-text>
      </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import {
  DocumentEditorContainerPlugin,
  Selection,
  SfdtExport,
  WordExport,
  TextExport,
  Print,
  Toolbar,
} from "@syncfusion/ej2-vue-documenteditor";
Vue.use(DocumentEditorContainerPlugin);
import VFormBase from "vuetify-form-base";
import pdf from "vue-pdf-signature";
import helper from "@/helpers/index";

import xlsx from "xlsx";

export default {
  components: { pdf, VFormBase },
  data() {
    return {
      stFileKonvensional: 'T',
      stMasal: "",
      uploadLampiranExt: null,
      dialogKonfirmasi: false,
      currentPageKonfirmasi: 1,
      pageCountKonfirmasi: 1,
      pageKonfirmasi: 1,
      srcKonfirmasi: "",
      namaUser: "",
      npk: "",
      kodeRole: "",
      kodeUser: "",
      kodeJenisNaskah: this.$route.params.id,
      kodeKantorUser: "",
      showFileSuratMasuk: false,
      valid: false,
      formModel: {},
      formSchema: {},
      inpLampiran: false,
      lampiran: null,
      fileLampiranBase64: "",
      fileSuratMasuk: null,
      fileSuratMasukBase64: "",
      fileRules: [
        (value) =>
          !value ||
          value.size < 10000000 ||
          "File size should be less than 10 MB!",
      ],
      smileFilePath: this.$route.query.sfp || "",
      x1: null, y1: null,
      x2: null, y2: null,
      xAxis: 0, yAxis: 0,
      pointer: this.$route.query.pointer || "",
      pemindahan: this.$route.query.pemindahan || "",
      breadcrumbItems: [
        {
          text: "Pembuatan Naskah",
          disabled: false,
          href: "/new/",
        },
      ],
      isCreated: false,
      overlay: false,
      src: "",
      page: 0,
      currentPage: 0,
      pageCount: 0,
      pageScale: 1,
      showButtonView: false,
      insertPointer: false,
      serviceUrl: process.env.serviceUrlEditorEjs,
      //serviceUrl: "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/",
      //serviceUrl: "https://sidia-dev.bpjsketenagakerjaan.go.id/sf/api/documenteditor/",
      items: [
        "Undo",
        "Redo",
        "Separator",
        "Image",
        "Table",
        "Hyperlink",
        "Separator",
        "Header",
        "Footer",
        "PageNumber",
        "Break",
        "PageSetup",
        "Find",
        "Separator",
        "LocalClipboard",
      ],
      fontStyle: [
        "Arial",
        "Calibri",
        "Courier New",
        "Georgia",
        "Impact",
        "Segoe Print",
        "Segoe Script",
        "Segoe UI",
        "Symbol",
        "Times New Roman",
        "Verdana",
        "Windings",
      ],
      fontSize: [
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "14",
        "16",
        "18",
        "20",
        "22",
        "24",
        "26",
        "28",
        "36",
        "48",
        "72",
        "96",
      ],
    };
  },
  provide: {
    DocumentEditorContainer: [
      Toolbar,
      WordExport,
      SfdtExport,
      TextExport,
      Selection,
      Print,
    ],
  },
  watch: {
    fileSuratMasukBase64(val) {
      this.showButtonView =
        val &&
        val.includes("JVBERi0") &&
        this.fileSuratMasuk &&
        this.fileSuratMasuk.size < 10000000
          ? true
          : false;
    },
    "formModel.OBJ004": function (val, oldVal) {
      if (this.kodeJenisNaskah == "NKH0015" || this.kodeJenisNaskah == "NKH0016") {
        if (this.formModel.OBJ004 != "" || this.formModel.OBJ004.length > 0) {
          this.formModel.OBJ011 = "";
          this.formModel.OBJ021 = "";
          this.formModel.OBJ022 = "";
          this.uploadLampiranExt = null;
          this.stMasal = "T";
        }
      }
    },
    "formModel.OBJ011": function (val, oldVal) {
      if (this.kodeJenisNaskah == "NKH0015") {
        if (this.formModel.OBJ011 != "") {
          this.formModel.OBJ004 = [];
        }
      }

    },
    "formModel.OBJ021": function (val, oldVal) {
      let text =  this.formModel.OBJ021;
      const myArray = text.split("~");

      if (this.kodeJenisNaskah == "NKH0016") {
        if (this.formModel.OBJ021 == "" || myArray[1] == undefined ) {
          this.formModel.OBJ004 = [];
          this.stMasal = "T";
         }else {
          this.formModel.OBJ004 = [];
          this.stMasal = "Y";
        }
      }
      console.log(this.stMasal,'OBJ021')

    },
  },
  methods: {
    onCreate: function () {},
    saveAsDocx: function () {
      this.$refs.documenteditor.ej2Instances.documentEditor.save(
        Date.now(),
        "Docx"
      );
    },
    saveAsSfdt: function () {
      this.$refs.documenteditor.ej2Instances.documentEditor.save(
        Date.now(),
        "Sfdt"
      );
    },
    saveAsTxt: function () {
      this.$refs.documenteditor.ej2Instances.documentEditor.save(
        Date.now(),
        "Txt"
      );
    },
    print: function () {
      this.$refs.documenteditor.ej2Instances.documentEditor.print();
    },
    konfirmasi() {
      let self = this;
      this.overlay = true;
      if (this.kodeJenisNaskah=='NKH0023') {
        let ttds = []
        ttds.push(this.formModel.OBJ004)
        ttds.push(this.formModel.OBJ005)
        this.formModel.OBJ009 = ttds
      }

      this.$refs.documenteditor.ej2Instances.documentEditor
        .saveAsBlob("Docx")
        .then((blob) => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;

            //postData
            self.$axios
              .post(
                "/naskah/htmlpdf2",
                {
                  docx: base64data,
                  formModel: self.formModel,
                  attachment: self.fileLampiranBase64,
                  kodeJenisNaskah: self.kodeJenisNaskah,
                  stMasal : self.stMasal,
                },
                { baseURL:process.env.baseURL2, responseType: "blob", transformResponse: [] }
              )
              .then(async (res) => {
                // new tab
                var blob = new Blob([res.data], { type: "application/pdf" });
                var blobURL = URL.createObjectURL(blob);
                self.srcKonfirmasi = blobURL;
                self.dialogKonfirmasi = true;
                self.overlay = false;
              })
              .catch(async (err) => {
                self.srcKonfirmasi = "";
                self.overlay = false;
                if (err.response && err.response.data ) {
                  return self.$swal("", await err.response.data.text(), "error");
                }
                self.$swal("", "Preview pdf gagal!", "error");
              });
          };
        });
    },
    download() {
      let self = this;
      this.overlay = true;

      if (this.kodeJenisNaskah=='NKH0023') {
        let ttds = []
        ttds.push(this.formModel.OBJ004)
        ttds.push(this.formModel.OBJ005)
        this.formModel.OBJ009 = ttds
      }

      this.$refs.documenteditor.ej2Instances.documentEditor
        .saveAsBlob("Docx")
        .then((blob) => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;

            //postData
            self.$axios
              .post(
                "/naskah/htmlpdf2",
                {
                  docx: base64data,
                  formModel: self.formModel,
                  attachment: self.fileLampiranBase64,
                  kodeJenisNaskah: self.kodeJenisNaskah,
                  stMasal : self.stMasal
                },
                { baseURL:process.env.baseURL2, responseType: "blob", transformResponse: [] }
              )
              .then(async (res) => {
                // new tab
                var blob = new Blob([res.data], { type: "application/pdf" });
                var blobURL = URL.createObjectURL(blob);
                window.open(blobURL);
                self.overlay = false;
              })
              .catch(async (err) => {
                //handle error
                self.overlay = false;
                if (err.response && err.response.data ) {
                  return self.$swal("", await err.response.data.text(), "error");
                }
                self.$swal("", "Preview pdf gagal!", "error");
              });
          };
        });
    },
    uploadLampiran(file) {
      const self = this;
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          self.fileLampiranBase64 = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      } else {
        self.fileLampiranBase64 = "";
      }
    },

    uploadLampiranKepadaExternal(event){
      this.formModel.OBJ021 = "";
      this.formModel.OBJ022 = "";
      if(!event){
        return ;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = ev.target.result;
          const XLSX = xlsx;
          const workbook = XLSX.read(data, {type: "binary"})
          const wsname = workbook.SheetNames[0];
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
          let kepada = [];
          let tembusan = [];

          // console.log(ws);
          for(var i = 0; i < ws.length; i++){
            kepada.push(ws[i]['NAMA INSTANSI'])
            tembusan.push(ws[i]['TEMBUSAN'])
          }
          // console.log(kepada)
          this.formModel.OBJ021 = kepada.join('~ ');
          this.formModel.OBJ022 = tembusan.join('~ ');
          console.log(this.formModel)
        } catch (error) {
          console.log(error)
          return alert("read failure")
        }
      }
      reader.readAsBinaryString(event);
    },

    uploadFileSuratMasuk(file) {
      const self = this;
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          self.fileSuratMasukBase64 = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
        this.src = URL.createObjectURL(file);
      } else {
        this.fileSuratMasukBase64 = "";
        this.src = "";
        this.showButtonView = false;
      }
      this.showFileSuratMasuk = false;
      this.page = 0;
      this.page = 1;
    },
    loadSmileFilePath() {
      if (this.kodeJenisNaskah == "NKH0021" || this.kodeJenisNaskah == "NKH0022" || this.kodeJenisNaskah == "NKH0026" || this.kodeJenisNaskah == "NKH0027") {
        this.overlay = true;
        const url = this.smileFilePath;
        const toDataURL = url => fetch(url,{ mode:'cors'})
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () =>  resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
        .catch(err => {
            alert(err)
            this.overlay = false;
        }))

        toDataURL(url).then(dataUrl => {
          this.fileLampiranBase64 = dataUrl
          this.src = this.fileLampiranBase64
          this.$nextTick(() => {
            var layer = document.querySelector('.annotationLayer')
            layer.style.cursor = 'crosshair';
            layer.addEventListener('mousemove', function (e) {
            var canvas = document.querySelector('canvas');
            var rect = canvas.getBoundingClientRect();
            var pageScale = parseFloat(document.querySelector('#pageScale').value);
            var x = Math.abs(e.clientX - rect.left);
            var y = Math.abs(e.clientY - rect.top);
            x = (x * parseFloat(canvas.width)) / parseFloat(rect.width);
            y = (y * parseFloat(canvas.height)) / parseFloat(rect.height);
            x = Math.round(x / pageScale);
            y = Math.round(y / pageScale);
            document.querySelector("#xAxis").value = x;
            document.querySelector("#yAxis").value = y;
            document.querySelector("#xAxis").dispatchEvent(new Event("input"));
            document.querySelector("#yAxis").dispatchEvent(new Event("input"));

            })
          })

          this.overlay = false;
          this.page = 1;
        })
      }
    },
    async save(isDraft) {
      let self = this;
      this.overlay = true;

      if (
        this.fileLampiranBase64 != "" &&
        !this.fileLampiranBase64.includes("JVBERi0") &&
        !this.fileLampiranBase64.includes("officedocument")
      ) {
        this.overlay = false;
        return this.$swal("", "File lampiran tidak sesuai format!", "error");
      }

      if (this.kodeJenisNaskah=='NKH0023') {
        let ttds = []
        ttds.push(this.formModel.OBJ004)
        ttds.push(this.formModel.OBJ005)
        this.formModel.OBJ009 = ttds
      }

      if (this.kodeJenisNaskah=='NKH0024') {
        this.stFileKonvensional = 'Y'
      } else {
        this.stFileKonvensional = 'T'
      }

      if (
        (this.kodeJenisNaskah == "NKH0016" ||this.kodeJenisNaskah == "NKH0017" ||
        this.kodeJenisNaskah == "NKH0026" ||this.kodeJenisNaskah == "NKH0027" ||this.kodeJenisNaskah == "NKH0037" )
         &&
        (this.formModel.OBJ004 == "" || this.formModel.OBJ004.length == 0) &&
        (this.formModel.OBJ021 == "" || this.formModel.OBJ021 == null)
      ) {
        this.overlay = false;
        return this.$swal(
          "",
          "Kepada / Kepada (Eksternal) surat wajib diisi salah satu!",
          "error"
        );
      }

      const docx = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Docx")
          .then((blob) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
          });
      });
      const sfdt = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Sfdt")
          .then((blob) => {
            resolve(blob.text());
          });
      });
      const txt = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Txt")
          .then((blob) => {
            resolve(blob.text());
          });
      });

      Promise.all([docx, sfdt, txt]).then((values) => {
        console.log(values);
        const reqData = {
          kodeJenisNaskah: this.kodeJenisNaskah,
          petugas: this.kodeUser,
          stDraft: isDraft,
          stFileKonvensional: this.stFileKonvensional,
          npk: this.npk,
          kodeKantor: this.kodeKantorUser,
          //template        : this.template,
          //editorData      : this.editorData,
          formModel: this.formModel,
          attachment: this.fileLampiranBase64,
          docx: values[0],
          sfdt: values[1],
          txt: values[2],
          stMasal: this.stMasal,
        };
        //console.log(reqData);
        this.$axios
          .post("/naskah/submit", reqData, {baseURL:process.env.baseURL2})
          .then((response) => {
            if (response.data.ret === "0") {
              if (this.pemindahan && sessionStorage.arsipPdf){
                const paramPindahArsip = {
                  idNaskahBA: response.data.idNaskah,
                  npk: this.npk,
                  kodeKantor: this.kodeKantorUser,
                  petugas: this.kodeUser,
                  dataArsip: JSON.parse(helper.decrypt(this.pemindahan)),
                }
                this.$axios.post("/arsip/submitPemindahanArsip",paramPindahArsip)
                .then(async (res)=>{
                  if (res.data.ret == 0) {
                    this.overlay = false;
                    this.dialogKonfirmasi = false;
                    this.$swal(
                      "",
                      "Pembuatan naskah berhasil! ",
                      "success"
                    ).then((okay) => {
                      if (okay) {
                        this.$router.push("/monitoring?f="+this.kodeJenisNaskah);
                      }
                    });
                  } else {
                    this.overlay = false;
                    this.dialogKonfirmasi = false;
                    this.$swal(
                      "",
                      "Pembuatan naskah berhasil, namun gagal pemindahan arsip! ",
                      "error"
                    );
                  }
                })
              } else {
                this.overlay = false;
                this.dialogKonfirmasi = false;
                this.$swal(
                  "",
                  isDraft === "Y"
                    ? "Pembuatan draft naskah berhasil! "
                    : "Pembuatan naskah berhasil! ",
                  "success"
                ).then((okay) => {
                  if (okay) {
                    this.$router.push("/monitoring?f="+this.kodeJenisNaskah);
                  }
                });
              }
            } else {
              this.overlay = false;
              this.dialogKonfirmasi = false;
              this.$swal(
                "",
                isDraft === "Y"
                  ? "Pembuatan draft naskah gagal! " + response.data.msg
                  : "Pembuatan naskah gagal! " + response.data.msg,
                "error"
              );
            }
          })
          .catch((err) => {
            this.overlay = false;
            this.dialogKonfirmasi = false;
            this.$swal("", "Pembuatan naskah gagal!", "error");
            console.error(err);
          });
      });
    },
    async saveSuratMasuk(isDraft) {
      let self = this;
      this.overlay = true;

      if (
        this.fileSuratMasukBase64 != "" &&
        !this.fileSuratMasukBase64.includes("JVBERi0") &&
        !this.fileSuratMasukBase64.includes("officedocument")
      ) {
        this.overlay = false;
        return this.$swal("", "File surat masuk tidak sesuai format!", "error");
      }

      if (
        (this.formModel.OBJ004 == "" || this.formModel.OBJ004.length == 0) &&
        (this.formModel.OBJ011 == "" || this.formModel.OBJ011 == null)
      ) {
        this.overlay = false;
        return this.$swal(
          "",
          "Tujuan surat wajib diisi, pilih salah satu!",
          "error"
        );
      }

      const reqData = {
        kodeJenisNaskah: this.kodeJenisNaskah,
        petugas: this.kodeUser,
        stDraft: isDraft,
        stFileKonvensional: this.stFileKonvensional,
        npk: this.npk,
        kodeKantor: this.kodeKantorUser,
        formModel: this.formModel,
        attachment: this.fileSuratMasukBase64,
      };
      console.log("reqData", reqData);
      this.$axios
        .post("/naskah/submit", reqData)
        .then((response) => {
          if (response.data.ret === "0") {
            this.overlay = false;
            this.dialogKonfirmasi = false;
            this.$swal(
              "",
              isDraft === "Y"
                ? "Pembuatan draft naskah berhasil!"
                : "Pembuatan naskah berhasil!",
              "success"
            ).then((okay) => {
              if (okay) {
                this.$router.push("/monitoring?f="+ this.kodeJenisNaskah);
              }
            });
          } else {
            this.overlay = false;
            this.dialogKonfirmasi = false;
            this.$swal(
              "",
              isDraft === "Y"
                ? "Pembuatan draft naskah gagal! " + response.data.msg
                : "Pembuatan naskah gagal! " + response.data.msg,
              "error"
            );
          }
        })
        .catch((err) => {
          this.overlay = false;
          this.dialogKonfirmasi = false;
          this.$swal("", "Pembuatan naskah gagal!", "error");
          console.error(err);
        });
    },
    async saveExt(isDraft) {
      let self = this;
      this.overlay = true;

      const reqData = {
        kodeJenisNaskah: this.kodeJenisNaskah,
        petugas: this.kodeUser,
        stDraft: isDraft,
        stMasal: this.stMasal,
        stFileKonvensional: this.stFileKonvensional,
        npk: this.npk,
        kodeKantor: this.kodeKantorUser,
        formModel: this.formModel,
        attachment: this.fileLampiranBase64,
        docx: null,
        sfdt: '',
        txt: '',
        kodePointer: this.pointer
      }
      console.log(reqData);
      this.$axios
        .post("/naskah/submit", reqData)
        .then((response) => {
          if (response.data.ret === "0") {
            this.overlay = false;
            this.dialogKonfirmasi = false;
            this.$swal(
              "",
              isDraft === "Y"
                ? "Pembuatan draft naskah berhasil! "
                : "Pembuatan naskah berhasil! ",
              "success"
            ).then((okay) => {
              if (okay) {
                this.$router.push("/");
              }
            });
          } else {
            this.overlay = false;
            this.dialogKonfirmasi = false;
            this.$swal(
              "",
              isDraft === "Y"
                ? "Pembuatan draft naskah gagal! " + response.data.msg
                : "Pembuatan naskah gagal! " + response.data.msg,
              "error"
            );
          }
        })
        .catch((err) => {
          this.overlay = false;
          this.dialogKonfirmasi = false;
          this.$swal("", "Pembuatan naskah gagal!", "error");
          console.error(err);
        });
    },
    async updatePointer() {
      let self = this;
      this.overlay = true;
      const reqData = {
          kodePointer: this.pointer,
          kodeJenisNaskah: this.kodeJenisNaskah,
          formData: JSON.stringify(this.formModel),
          x1: this.x1,
          y1: this.y1,
          x2: (this.x2==null || this.x2=='0' || this.x2=='-') ? null : this.x2,
          y2: (this.y2==null || this.y2=='0' || this.y2=='-') ? null : this.y2
      }
      if (this.insertPointer) {
        this.$axios
          .post("/naskah/formdata-ext/", reqData)
          .then((response) => {
            if (response.data.ret === "0") {
              this.overlay = false;
              this.insertPointer = false;
              this.$swal("",
                "Update pointer berhasil! ",
                "success"
              );
            } else {
              this.overlay = false;
              this.$swal("",
                "Update pointer gagal! " + response.data.msg,
                "error"
              );
            }
          })
          .catch((err) => {
            this.overlay = false;
            this.$swal("", "Update pointer gagal!", "error");
            console.error(err);
          });
      } else {
        this.$axios
          .put("/naskah/formdata-ext/" + this.pointer, reqData)
          .then((response) => {
            if (response.data.ret === "0") {
              this.overlay = false;
              this.$swal("",
                "Update pointer berhasil! ",
                "success"
              );
            } else {
              this.overlay = false;
              this.$swal("",
                "Update pointer gagal! " + response.data.msg,
                "error"
              );
            }
          })
          .catch((err) => {
            this.overlay = false;
            this.$swal("", "Update pointer gagal!", "error");
            console.error(err);
          });
      }

    },
    onDocUpload: function(e) {
      if (e.target.files[0]) {
        let file = e.target.files[0];
        let ajax = new XMLHttpRequest();
        ajax.open('POST', this.serviceUrl+'Import', true);
        ajax.onreadystatechange = () => {
          if (ajax.readyState === 4) {
            if (ajax.status === 200 || ajax.status === 304) {
              this.$refs.documenteditor.ej2Instances.documentEditor.open(ajax.responseText);
              console.log('import doc loaded')
            }
          }
        }
        let formData = new FormData();
        formData.append('files', file);
        ajax.send(formData);
      }
    }
  },
  created: async function () {
  }
};
</script>

<style>
.annotationLayer {
  border: 1px solid black;
}

#panelEditor .v-expansion-panel-content__wrap {
  padding: 0 !important;
}

#form-base .v-input {
  font-size: 14px;
}

#form-base .v-text-field {
  padding-top: 6px;
}

#for-base .v-list-item__content {
  padding: 4px 0;
}
</style>
