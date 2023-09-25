<template>
  <div id="app">
    <v-container>
      <v-breadcrumbs large :items="breadcrumbItems">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.href">
            {{ item.text.toUpperCase() }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-row v-if="!isCreated">
        <v-col cols="12">
          <v-skeleton-loader type="list-item-three-line, divider list-item-avatar divider, card, actions" />
        </v-col>
      </v-row>
      <div v-show="isCreated">
        <v-expansion-panels v-if="catatanTable.length" accordion text hover :value="0" class="mb-5">
          <v-expansion-panel>
            <v-expansion-panel-header>
              Catatan
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th scope="col" class="text-left">
                          Date
                        </th>
                        <th scope="col" class="text-left">
                          Status
                        </th>
                        <th scope="col" class="text-left">
                          Catatan
                        </th>
                        <th scope="col" class="text-left">
                          User
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in catatanTable" :key="item.date">
                        <td>{{ parseDate(item.tglLog) }}</td>
                        <td>{{ item.stLog }}</td>
                        <td>{{ item.keterangan }}</td>
                        <td>{{ parseName(item.namaUser,item.namaJabatan) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion text hover :value="0" class="mb-5">
          <v-expansion-panel>
            <v-expansion-panel-header> Form </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="form" v-model="valid" :lazy-validation="false">
                <v-form-base :model="formModel" :schema="formSchema" />
              </v-form>
              <p v-if="inpLampiran">
                <v-file-input
                  ref="fileInput"
                  :rules="fileRules.required"
                  v-model="lampiran"
                  show-size
                  accept=".pdf"
                  @change="uploadLampiran"
                  label="Lampiran"
                >
                </v-file-input>
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion text hover :value="0" v-if="kodeJenisNaskah != 'NKH0015'" >
          <v-expansion-panel id="panelEditor">
            <v-expansion-panel-header> Editor </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ejs-documenteditorcontainer
                ref="documenteditor"
                :serviceUrl="serviceUrl"
                height="600px"
                id="container"
                :enableToolbar="true"
                :toolbarItems="items"
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
                    <v-btn class="mr-2" color="primary" @click="save('Y')" :disabled="!valid" >Simpan Draft</v-btn>
                    <v-btn color="primary" @click="konfirmasi()" :disabled="!valid">Kirim</v-btn>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion text hover :value="0" v-else>
          <v-expansion-panel>
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
          <v-spacer />
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
const required = (msg) => (v) => !!v || msg;
const requiredm = (msg) => (v) => v.length > 0 || msg; // required for select multiple

function dataURLtoFile(base64, filename) {
  if (base64.includes("base64,")) {
    base64 = base64.split("base64,")[1];
  }
  var bstr = atob(base64),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename);
}

import Vue from "vue";
import {
  DocumentEditorContainerPlugin,
  Toolbar,
} from "@syncfusion/ej2-vue-documenteditor";
Vue.use(DocumentEditorContainerPlugin);

import {
  Selection,
  SfdtExport,
  WordExport,
  TextExport,
  Print,
} from "@syncfusion/ej2-vue-documenteditor";

import VFormBase from "vuetify-form-base";
import pdf from "vue-pdf-signature";
import helper from "@/helpers/index";

export default {
  components: { pdf, VFormBase },
  data() {
    return {
      dialogKonfirmasi: false,
      currentPageKonfirmasi: 1,
      pageCountKonfirmasi: 1,
      pageKonfirmasi: 1,
      srcKonfirmasi: "",
      lampiran: null,
      catatanTable: [],
      namaUser: "",
      npk: "",
      kodeRole: "",
      kodeUser: "",
      kodeKantorUser: "",
      kodeJenisNaskah: "",
      stSend: "",
      idNaskah: this.$route.params.id,
      showFileSuratMasuk: false,
      valid: false,
      formModel: {},
      formSchema: {},
      inpLampiran: false,
      fileLampiranBase64: "",
      fileSuratMasuk: null,
      fileSuratMasukBase64: "",
      fileRules: {
        required: [
          (value) => {
            if (value) {
              console.log(value)
              if (this.encrypted == true) {
                return 'File tidak boleh berpassword!'
              } else if (value.size > 10000000) {
                return "Ukuran file tidak boleh lebih dari 10MB";
              } else if (value.type != "application/pdf") {
                return "Format file harus PDF!";
              }
              else {
                return true;
              }
            } else {
              return false
            }
          },
          //(value) => (!value || (this.encrypted === false)) || 'File tidak boleh berpassword!'
        ],
      },
      breadcrumbItems: [
        {
        	text: "Monitoring",
        	href: "/monitoring?f="+this.kodeJenisNaskah,
        },
        {
        	text: "Edit Naskah",
        	href: "",
        },
      ],
      isCreated: false,
      overlay: false,
      src: "",
      page: 0,
      numPages: 0,
      rotate: 0,
      currentPage: 0,
      pageCount: 0,
      pageScale: 1,
      showButtonView: false,

      //serviceUrl: "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/",
      //serviceUrl: "https://sidia-testing.bpjsketenagakerjaan.go.id/sf/api/documenteditor/",
      serviceUrl: process.env.serviceUrlEditor,
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
    // "formModel.OBJ021": function (val, oldVal) {
    //   alert(val,'val', oldVal,'oldval')
    //   let text =  this.formModel.OBJ021;
    //   const myArray = text.split(" ");
    //   if (this.kodeJenisNaskah == "NKH0016") {
    //     if (this.formModel.OBJ021 != "" || myArray[2] == undefined || myArray[1] == undefined ) {
    //       this.formModel.OBJ004 = [];
    //        this.stMasal = "T";
    //      }else {
    //       this.formModel.OBJ004 = [];
    //       this.stMasal = "Y";
    //     }
    //   }
    // },
  },
  methods: {
    parseDate(val){
      return this.$moment(val).format("DD/MM/YYYY")
    },
    parseName(name,jabatan){
      return name + ' - ' + jabatan
    },
    onCreate: function () {},
    konfirmasi() {
      let self = this;
      this.overlay = true;

      const txt = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Txt")
          .then((blob) => {
            resolve(blob.text());
          });
      });

      const docs = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Docx")
          .then((blob) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              resolve(reader.result)
            };
          });
      })

      Promise.all([txt, docs]).then((values) => {
        self.$axios
        .post(
          "/naskah/htmlpdf2",
          {
            petugas: self.kodeUser,
            docx: values[1],
            formModel: self.formModel,
            attachment: self.fileLampiranBase64,
            kodeJenisNaskah: self.kodeJenisNaskah,
            stMasal : self.stMasal,
            txt: values[0],
          },
          { baseURL:process.env.baseURL2 }
        )
        .then(async (res) => {
          if (res.data.ret && res.data.ret === '-1') {
            self.overlay = false;

            if (res.data.img) {
              return self.$swal({
                icon: 'error',
                html:
                  `<p>${res.data.msg}</p><img style="width: 100%; margin-left: auto; margin-right: auto;" src='${res.data.img}'/>`,
                width: 900,
              });
            } else {
              return self.$swal("", "Preview pdf gagal!", "error");
            }
          }
            
            var byteString = atob(res.data.data);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            let newBlob = new Blob([ab], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(newBlob);
            self.srcKonfirmasi = blobURL;
            self.dialogKonfirmasi = true;
            self.overlay = false;
        })
        .catch(err => {
          //handle error
          self.srcKonfirmasi = "";
          self.overlay = false;
          self.$swal("", "Preview pdf gagal!", "error");
        });
      })
    },
    download() {
      let self = this;
      this.overlay = true;

      const txt = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Txt")
          .then((blob) => {
            resolve(blob.text());
          });
      });

      const docs = new Promise((resolve, reject) => {
        this.$refs.documenteditor.ej2Instances.documentEditor
          .saveAsBlob("Docx")
          .then((blob) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              resolve(reader.result)
            };
          });
      })

      Promise.all([txt, docs]).then((values) => {
        self.$axios
          .post(
            "/naskah/htmlpdf2",
            {
              petugas: self.kodeUser,
              docx: values[1],
              formModel: self.formModel,
              attachment: self.fileLampiranBase64,
              kodeJenisNaskah: self.kodeJenisNaskah,
              stMasal : self.stMasal,
              txt: values[0]
            },
            { baseURL:process.env.baseURL2 }
          )
          .then(async (res) => {
            console.log('RES:', res)
            if (res.data.ret && res.data.ret === '-1') {
              self.overlay = false;

              if (res.data.img) {
                return self.$swal({
                  icon: 'error',
                  html:
                    `<p>${res.data.msg}</p><img style="width: 100%; margin-left: auto; margin-right: auto;" src='${res.data.img}'/>`,
                  width: 900,
                });
              } else {
                return self.$swal("", "Preview pdf gagal!", "error");
              }
            }

            // new tab
            var byteString = atob(res.data.data);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {type: 'application/pdf'});
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
            self.overlay = false;
            // download
            // const link = document.createElement("a");
            // link.href = await URL.createObjectURL(new Blob([res.data]));
            // link.target = "_blank";
            // link.setAttribute("download", Date.now() + ".pdf");
            // link.download = Date.now() + ".pdf";
            // document.body.appendChild(link);
            // link.click();
          })
          .catch(err => {
            //handle error
            self.overlay = false;
            self.$swal("", "Preview pdf gagal!", "error");
          });
      })

    },
    async isPdfEncrypted(file) {
      const self = this
      if (file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = function () {
            let files = new Blob([reader.result], {type: 'application/pdf'});
            files.text().then(x => {
              console.log(x)
              resolve(x.includes("Encrypt") || false, x.substring(x.lastIndexOf("<<"), x.lastIndexOf(">>")).includes("/Encrypt"));
            });
          };
          reader.readAsArrayBuffer(file);
        });
      } else {
        return false
      }
    },
    async uploadLampiran(file) {
      const self = this;
      const reader = new FileReader();
      const readDataURL = new FileReader()

      if (file) {
        if (file.size > 10000000 || file.type !== "application/pdf") {
          this.encrypted = false
          this.fileLampiranBase64 = ""
          this.validFile = false
          // this.lampiran = []
        } else {
          await this.isPdfEncrypted(file).then(d => {
            console.log(d)
            if (d) {
              this.fileLampiranBase64 = ""
              this.validFile = false
              const fileInput = this.$refs.fileInput;
              fileInput.errorBucket = ["File tidak boleh berpassword"];
              //this.lampiran = null
            } else {
              this.encrypted = false
              this.validFile = true
              readDataURL.onload = () => {
                this.fileLampiranBase64 = readDataURL.result
              }
              readDataURL.readAsDataURL(file)
            }
          })
        }
      } else {
        this.encrypted = false
        this.validFile = true
      }
    },
    // uploadLampiran(file) {
    //   const self = this;
    //   const reader = new FileReader();

    //   reader.addEventListener(
    //     "load",
    //     function () {
    //       self.fileLampiranBase64 = reader.result;
    //     },
    //     false
    //   );

    //   if (file) {
    //     reader.readAsDataURL(file);
    //   } else {
    //     self.fileLampiranBase64 = "";
    //   }
    // },
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
    async save(isDraft) {
      let self = this;
      this.overlay = true;

      if (
        this.fileLampiranBase64 != "" &&
        !this.fileLampiranBase64.includes("JVBERi0") &&
        !this.fileLampiranBase64.includes("officedocument")
      ) {
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
        this.kodeJenisNaskah == "NKH0026" ||this.kodeJenisNaskah == "NKH0027" )
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
        this.overlay = true;

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
          idNaskah: this.idNaskah
        };
        let url = '/naskah/submit'
        if(this.stMasal == 'Y'){
          url = '/naskah/submitMasal'
        }
        console.log(reqData);
        this.$axios
          .post(url, reqData,  {baseURL:process.env.baseURL2})
          .then((response) => {
            if (response.data.ret === "0") {
              this.overlay = false;
              this.$swal(
                "",
                isDraft === "Y"
                  ? "Pembuatan draft naskah berhasil! "
                  : response.data.msg,
                "success"
              ).then((okay) => {
                if (okay) {
                  this.$router.push("/monitoring?f="+this.kodeJenisNaskah);
                }
              });
            } else {
              this.overlay = false;

              if (response.data.img) {
                this.$swal({
                      icon: 'error',
                      html:
                        `<p>${response.data.msg}</p><img style="width: 100%; margin-left: auto; margin-right: auto;" src='${response.data.img}'/>`,
                      width: 900,
                    });
              } else {
                this.$swal(
                  "",
                  isDraft === "Y"
                    ? "Pembuatan draft naskah gagal! " + response.data.msg
                    : "Pembuatan naskah gagal! " + response.data.msg,
                  "error"
                );
              }
            }
          })
          .catch((err) => {
            this.overlay = false;
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
          } else {
            this.overlay = false;
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
          this.$swal("", "Pembuatan naskah gagal!", "error");
          console.error(err);
        });
    },

    updateDocumentEditorSize: function () {
      let w = document.getElementById('panelEditor').offsetWidth;
      let h = window.innerHeight - 80;
      this.$refs.documenteditor.ej2Instances.resize(w, h);
    }
  },
  created: async function () {
    this.recentPageData = sessionStorage.getItem("recentPage");
      this.breadcrumbItems.push({
                    text: "Monitoring",
                    href: this.recentPageData,
                  })
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        //this.npk = dataUser.npk; //npk+kodeKantor pembuat naskah sebelumnya
        this.kodeRole = dataUser.kodeRole;
        this.kodeUser = dataUser.kodeUser;
        //this.kodeKantorUser = dataUser.kodeKantorRole;
        try {
          const naskah = await this.$axios.get( "/naskah/monitoring/" + this.idNaskah );
          if (naskah && naskah.data) {
            let dt = naskah.data.data[0];
            this.stMasal = dt.stMasal
            this.kodeJenisNaskah = dt.kodeJenisNaskah;
            this.stSend = dt.stSend;

            //npk+kodeKantor pembuat naskah sebelumnya
            this.npk = dt.npk;
            this.kodeKantorUser = dt.kodeKantor;

            const { data } = await this.$axios.get(
              "/master/naskah-atribut/" + this.kodeJenisNaskah + "/form",
              {
                params: { kodeKantorUser: this.kodeKantorUser },
              }
            );
            // console.log(data);
            if (this.kodeJenisNaskah == "NKH0015") {
              this.fileSuratMasukBase64 = dt.attachmentData
                ? dt.attachmentData
                : "";
              this.showButtonView = dt.attachmentData ? true : false;
              if (dt !== null && dt.attachmentData !== "") {
                this.fileSuratMasuk = dataURLtoFile(dt.attachmentData,"File Surat Masuk");
              }
            } else {
              this.fileLampiranBase64 = dt.attachmentData ? dt.attachmentData : "";
              this.src = this.fileLampiranBase64 ? "data:application/pdf;base64," + this.fileLampiranBase64 : "";
              if (dt !== null && dt.attachmentData !== "") {
                this.lampiran = dataURLtoFile(dt.attachmentData, "Lampiran");
              }
            }

            if (data.schema) {
              this.template = data.template || "";
              let fd = JSON.parse(dt.formData);
              this.formModel = fd;
              this.editorData = fd.isi;
              this.formSchema = data.schema;
              Object.entries(this.formSchema).forEach((entry) => {
                const [key, value] = entry;
                // console.log(key);
                // console.log(value.required);
                if (value.model == "lampiran" || value.model == "OBJ007") {
                  this.inpLampiran = true;
                }
                if (
                  value.model === "isi" ||
                  value.model === "nomor" ||
                  value.model === "tanggal_naskah" ||
                  value.model === "lampiran"
                ) {
                  delete this.formSchema[key];
                } else if (value.type === "date" && this.kodeJenisNaskah != 'NKH0015') {
                  this.formModel[key] = new Date().toISOString().substr(0, 10);
                  this.formSchema[key] = {
                    ...value,
                    min: new Date().toISOString().substr(0, 10),
                    type: "date",
                    ext: "text",
                    locale: "en",
                    color: "green accent-4",
					          text: { label: value.label },
                    label: value.label,
                    hidden: value.hidden,
                    col: 12,
                    menu: {
                      closeOnContentClick: true,
                      nudgeRight: 200,
                      maxWidth: "290px",
                      minWidth: "290px",
                    },
                    rules: value.required
                      ? value.hidden
                        ? []
                        : [required("Field is required")]
                      : [],
                  };
                } else if (value.type === "date" && this.kodeJenisNaskah == 'NKH0015') {
                  this.formModel[key] = new Date().toISOString().substr(0, 10);
                  this.formSchema[key] = {
                    ...value,
                    type: "date",
                    ext: "text",
                    locale: "en",
                    color: "green accent-4",
					          text: { label: value.label },
                    label: value.label,
                    hidden: value.hidden,
                    col: 12,
                    menu: {
                      closeOnContentClick: true,
                      nudgeRight: 200,
                      maxWidth: "290px",
                      minWidth: "290px",
                    },
                    rules: value.required
                      ? value.hidden
                        ? []
                        : [required("Field is required")]
                      : [],
                  };
                } else if (value.type === "select") {
                  this.formSchema[key] = {
                    ...value,
                    type: "autocomplete",
                    col: 12,
                    hidden: value.hidden,
                    rules: value.required
                      ? value.hidden
                        ? []
                        : [required("Field is required")]
                      : [],
                  };
                } else if (value.type === "select-multiple") {
                  this.formSchema[key] = {
                    ...value,
                    type: "autocomplete",
                    col: 12,
                    hidden: value.hidden,
                    rules: value.required
                      ? value.hidden
                        ? []
                        : [requiredm("Field is required")]
                      : [],
                  };
                } else {
                  this.formSchema[key] = {
                    ...value,
                    col: 12,
                    hidden: value.hidden,
                    rules: value.required
                      ? value.hidden
                        ? []
                        : [required("Field is required")]
                      : [],
                  };
                }
              });
            } else {
              this.valid = false;
            }

             //getLog
            const resultLog = await this.$axios.get("/naskah/tr/log", {
              params: { idNaskah: this.idNaskah },
            });
            if ( resultLog.data && resultLog.data.data ) {
              this.catatanTable = resultLog.data.data;
            }

            // show
            this.breadcrumbItems.push({
              text: data.name,
              disabled: true,
              href: "",
            });
            this.overlay = false;
            this.isCreated = true;
            if (this.kodeJenisNaskah != "NKH0015") {
              this.$refs.documenteditor.ej2Instances.documentEditor.open(dt.sfdt);
            }
            this.$nextTick(function () {
              setTimeout(() => { this.updateDocumentEditorSize(); }, 100);
            });
          }
        } catch (ex) {
          console.error(ex)
        }
      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      var obj = this;
      setTimeout(() => {
        obj.$refs.documenteditor.ej2Instances.documentEditor.zoomFactor = 0.75;
        obj.updateDocumentEditorSize();
      }, 100);
      window.addEventListener('resize', obj.updateDocumentEditorSize);
    });
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
