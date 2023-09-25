<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-breadcrumbs large :items="breadcrumbItems">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :href="item.href"
            >
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="8">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-btn class="ml-2 mb-2" text small @click="page > 1 ? page-- : 1">
                  <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
                <v-btn class="ml-2 mb-2" text small @click="page < pageCount ? page++ : 1">
                  <v-icon small>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn class="ml-8 mb-1" text small @click="openFullPdf()">Full PDF</v-btn>
                <v-btn disabled class="ml-2 mb-2" text small>{{page+"/"+pageCount}}</v-btn>
              </v-col>
            </v-row>
            <pdf
              :src="src"
              :page="page"
              @page-size="function (a, b, c) { pageScale=c }"
              @num-pages="pageCount = $event"
              @page-loaded="currentPage = $event"
              @link-clicked="page = $event"
            ></pdf>
            <v-text-field
              v-model.number="page"
              type="number"
              :min="1"
              :max="pageCount"
              style="width: 5em"
              outlined
              dense
              class="pt-2"
            />
            <input v-model.number="pageScale" type="hidden" id="pageScale" />
            <input v-model="imageTtdBase64" type="hidden" id="imageTtdBase64" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="4">
        <v-card>
          <v-tabs v-model="tab" background-color color="success" center-active grow>
            <v-tab>Invisible</v-tab>
            <!-- <v-tab v-if="nik && imageTtdBase64">QR Data</v-tab> -->
            <v-tab v-if="nik && imageTtdBase64">Visible</v-tab>
            <v-tab v-if="nik && imageTtdBase64">#</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-btn
                    :disabled="!nik && !fileBase64  || fileBase64===''"
                    color="success darken-1"
                    block
                    @click="openDialog('1')"
                  >Tandatangan</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item v-if="nik && imageTtdBase64">
              <v-card flat>
                <v-card-text>
                  <v-row class="pa-0">
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field outlined hide-details v-model="linkQR" dense label="QR Data" />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-btn
                    :disabled="!fileBase64  || fileBase64===''"
                    color="success darken-1"
                    block
                    @click="openDialog(2)"
                  >Tandatangann</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>-->
            <v-tab-item v-if="nik && imageTtdBase64">
              <v-card flat>
                <v-card-text>
                  <v-row class="pa-0">
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        :min="1"
                        type="number"
                        v-model.number="page"
                        dense
                        :max="src?pageCount:1"
                        label="Page"
                        id="inputPage"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-btn
                        color="default"
                        block
                      @click="clearTtd"
                    >Clear</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="width"
                        dense
                        label="Upper-Right X"
                        id="inputWidth"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="height"
                        dense
                        label="Upper-Right Y"
                        id="inputHeight"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="xAxis"
                        dense
                        label="Lower-Left X"
                        id="inputX"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="yAxis"
                        dense
                        label="Lower-Left Y"
                        id="inputY"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-btn
                    :disabled="!fileBase64 || fileBase64===''"
                    color="success darken-1"
                    block
                    @click="openDialog(3)"
                  >Tandatangan</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="nik && imageTtdBase64">
              <v-card flat>
                <v-card-text>
                  <v-row class="pa-0">
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        :min="1"
                        type="number"
                        v-model.number="page"
                        dense
                        :max="src?pageCount:1"
                        label="Page"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-select
                        outlined
                        v-model="tagKoordinat"
                        :items="tagItems"
                        label="Tag Koordinat"
                        hide-details
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="width"
                        dense
                        label="Width"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        outlined
                        type="number"
                        v-model.number="height"
                        dense
                        label="Height"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions class="pa-5">
                  <v-btn
                    :disabled="!fileBase64 || fileBase64===''"
                    color="success darken-1"
                    block
                    @click="openDialog('4')"
                  >Tandatangan</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <div class="text-center justify-center">
            <img alt="BSRE" src="/logo_bsre.png" style="margin-bottom:4px;" />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline grey lighten-2 center">
          Passphrase
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  autocomplete="off"
                  disabled=""
                  v-model="nik"
                  prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                  autocomplete="off"
                  readonly
                  onfocus="this.removeAttribute('readonly');"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass = !showPass"
                  :type="showPass ? 'text' : 'password'"
                  v-model="passphrase"
                  :rules="rules.password"
                  color="success"
                  label="Kata Sandi*"
                  prepend-icon="mdi-lock"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success darken-1"  @click="sign" :disabled="!passphrase || passphrase===''">
            Submit
          </v-btn>
          <v-btn color="default darken-1" text @click="dialog = false">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
.annotationLayer {
  border: 1px solid black;
}
.example-drag {
  margin-bottom: 0;
  margin-right: 1rem;
}
.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.example-drag .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
<script>
import Vue from 'vue'
import VueMask from 'v-mask'
Vue.use(VueMask)
import pdf from "vue-pdf-signature";

export default {
  components: { pdf },
  layout: "page",
  data() {
    return {
      files: [],
      tab: 1,
      overlay: false,

      breadcrumbItems: [
        {
          text: "SIDIA",
          href: "/",
        },
        {
          text: "E-sign",
          href: "",
        },
      ],
      rules: {
        password: [
          (val) =>
            (val || "").length > 0 || "Kata sandi passphrase harus dimasukkan",
        ],
      },
      src: "",
      pdfViewSrc: "",
      zoom: "100%",
      loadedRatio: 0,
      //page: 0,
      numPages: 0,
      rotate: 0,
      currentPage: 0,
      pageCount: 0,
      pageScale: 1,
      dialog: false,
      showPass: false,
      //selectedVisual: "1",

      fileBase64: "",
      imageTtdBase64: "",
      npk: "",
      kodeUser: "EXT-SYSTEM",
      nik: "",
      passphrase: "",
      page: 1,
      linkQR: "http://bpjsketenagakerjaan.go.id",
      width: 100,
      height: 100,
      xAxis: 0,
      yAxis: 0,
      tagKoordinat: '#',
      tagItems: [
          { value:'#',text:'#'},
          { value:'~',text:'~'},
          { value:'£',text:'£'},
          { value:'€',text:'€'},
          { value:'$',text:'$'},
          { value:'¢',text:'¢'},
          { value:'¥',text:'¥'},
          { value:'§',text:'§'},
          { value:'°',text:'°'},
          { value:'^',text:'^'},
          { value:'*',text:'*'},
          { value:'_',text:'_'},
          { value:'+',text:'+'},
          { value:'=',text:'='},
          { value:'{',text:'{'},
          { value:'}',text:'}'},
          { value:'[',text:'['},
          { value:']',text:']'},
          { value:'|',text:'|'},
          { value:';',text:';'},
          { value:'<',text:'<'},
          { value:'>',text:'>'},
        ],
      indexTtd:"1"
    };
  },
  watch: {},
  mounted() {
    var layer = document.querySelector('.annotationLayer')
    var mouse = { x: 0, y: 0, startX: 0, startY: 0};
    var cmouse = { x: 0, y: 0, startX: 0, startY: 0};
    var isClicked = false;

    layer.addEventListener('click', function (e) {
      if (isClicked) {
        isClicked = false;
        layer.style.cursor = 'default';
        console.log(mouse,cmouse);
        var x1=0, y1=0, x2=0, y2=0; 
        if(mouse.x < mouse.startX) {
          x1 = mouse.x;
          x2 = mouse.startX;
        } else {
          x2 = mouse.x;
          x1 = mouse.startX;
        }
        if(mouse.y < mouse.startY) {
          y1 = mouse.y;
          y2 = mouse.startY;
        } else {
          y2 = mouse.y;
          y1 = mouse.startY;
        }
        document.querySelector("#inputX").value = x1;
        document.querySelector("#inputY").value = y1;
        document.querySelector("#inputWidth").value = x2;
        document.querySelector("#inputHeight").value = y2;
        document.querySelector("#inputX").dispatchEvent(new Event("input"));
        document.querySelector("#inputY").dispatchEvent(new Event("input"));
        document.querySelector("#inputWidth").dispatchEvent(new Event("input"));
        document.querySelector("#inputHeight").dispatchEvent(new Event("input"));
  
        var ctx = document.querySelector('canvas').getContext("2d");
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cmouse.startX, cmouse.startY);
        ctx.lineTo(cmouse.x, cmouse.y);
        ctx.stroke();
        ctx.moveTo(cmouse.startX, cmouse.y);
        ctx.lineTo(cmouse.x, cmouse.startY);
        ctx.stroke();
      } else {
        isClicked = true;
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        cmouse.startX = cmouse.x;
        cmouse.startY = cmouse.y;
        layer.style.cursor = 'crosshair';
      }
    })

    layer.addEventListener('mousemove', function (e) {
      var canvas = document.querySelector('canvas');
      var rect = canvas.getBoundingClientRect();
      var pageScale = parseFloat(document.querySelector('#pageScale').value);
      var x = Math.abs(e.clientX - rect.left);
      var y = Math.abs(e.clientY - rect.bottom);
      var cy = Math.abs(e.clientY - rect.top);
      x = (x * parseFloat(canvas.width)) / parseFloat(rect.width);
      y = (y * parseFloat(canvas.height)) / parseFloat(rect.height);
      cy = (cy * parseFloat(canvas.height)) / parseFloat(rect.height);
      cmouse.x = x;
      cmouse.y = cy;
      x = Math.round(x / pageScale);
      y = Math.round(y / pageScale);
      mouse.x = x;
      mouse.y = y;
    })
  },
  created: async function () {
    
    // if (localStorage.hasOwnProperty("authSikd")) {
    //   var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
    //   var dataUser = JSON.parse(dataLoginDecrypted);
    //   if (dataUser.kodeUser == 0) {
    //     this.$router.push({ path: "/login" });
    //   } else if (!dataUser.setRole) {
    //     this.$router.push({ path: "/role" });
    //   } else {
    //     if (localStorage.hasOwnProperty("authPage")) {
    //       var dataPage = helper.decrypt(localStorage.authPage);

    //       this.npk = dataUser.npk;
    //       this.kodeUser = dataUser.kodeUser;

    //       this.$axios
    //         .get("/esign/image",
    //         { 
    //           params: { npk:this.npk, pps: this.inPps } , 
    //           responseType: "arraybuffer" 
    //         })
    //         .then((response) => {
    //           let b64 = Buffer.from(response.data, "binary").toString("base64");
    //           this.imageTtdBase64 = b64;
    //           console.log("Image TTD Data ditemukan");
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //           this.$swal("Error", "Data TTD tidak ditemukan!", "error");
    //         });

    //       this.$axios
    //         .get("/esign/nik/", { params: {npk:dataUser.npk} })
    //         .then((response) => {
    //           console.log("NIK: " + response.data.data[0].nik);
    //           this.nik = response.data.data[0].nik;
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //           this.$swal("Error", "NIK tidak ditemukan!", "error");
    //         });
        
          
    //     }else{
    //       this.$router.push({ path: "/error" });
    //     }
    //   }
    // } else {
    //   this.$router.push({ path: "/login" });
    // }
    
    if (true) {
      this.$router.push({ path: "/error" });
    } else {
      // WIP
      const paramsString = atob(this.$route.query.qb);
      const searchParams = new URLSearchParams(paramsString);
      const npk = searchParams.get('npk')
      const filePath = searchParams.get('path')

      this.$axios
        .get("/esign/image",
        { 
          params: { npk:npk, pps: this.inPps } , 
          responseType: "arraybuffer" 
        })
        .then((response) => {
          let b64 = Buffer.from(response.data, "binary").toString("base64");
          this.imageTtdBase64 = b64;
          console.log("Image TTD Data ditemukan");
        })
        .catch((error) => {
          console.error(error);
          this.$swal("Error", "Data TTD tidak ditemukan!", "error");
        });

      this.$axios
      .get("/esign/nik", { params: {npk:npk} } )
      .then((response) => {
        console.log("NPK: " + npk);
        console.log("NIK: " + response.data.data[0].nik);
        this.nik = response.data.data[0].nik;
      })
      .catch((error) => {
        console.error(error);
        this.$swal("Error", "NIK tidak ditemukan!", "error").then(okay => {
          if (okay) {
            //this.$router.push('/inbox');
          }
        });
      });

      const naskahUrl = process.env.baseURL2 + "/arsip/fullPdf?path=" + this.$encrypt(filePath)
      this.pdfViewSrc = naskahUrl;
      console.log(naskahUrl)
      const toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }))
      toDataURL(naskahUrl)
        .then(dataUrl => {
          this.src = dataUrl
          this.fileBase64 = dataUrl
        })
      //idPointer, kodePointer, kodeJenisNaskah, tglNaskah, noNaskah, kodeKantor, petugas
    }
  },
  methods: {
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(pdf)$/i.test(newFile.name)) {
          this.$swal("Error", "File tidak sesuai format", "error");
          this.fileBase64='';
          return prevent();
        }
        if(newFile.size > 10*1024*1024){
          this.$swal("Error", "Ukuran berkas lebih dari 10MB", "error");
          this.fileBase64='';
          return prevent();
        }

      }
    },
    updateValue(val) {
      //   console.log(val);
      this.files = val;
      this.showDrag = false;
      this.fileUpload = val[0].file;
      this.fileInputChange(val[0].file);
    },
    fileInputChange(file) {
      if (!file) return;
      if (!/\.(pdf)$/i.test(file.name)) {
        this.$swal("Error", "Format berkas tidak sesuai", "error");
        this.fileUpload = null;
        this.fileBase64='';
        return;
      }
      if(file.size > 10*1024*1024){
        this.$swal("Error", "Ukuran berkas lebih dari 10MB", "error");
        this.fileUpload = null;
        this.fileBase64='';
        return;
      }

      this.page = 0;
      this.src = URL.createObjectURL(file);
      this.page = 1;
      // loadingTask.promise.then(pdf => {
      //     console.log(pdf)
      // });

      //base64
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        async function () {
          self.fileBase64 = reader.result;
        },
        false
      );
      if (file) reader.readAsDataURL(file);
    },
    changeImg(file) {
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          self.imageTtdBase64 = reader.results;
        },
        false
      );
      if (file) reader.readAsDataURL(file);
    },
    clearTtd() {
      const currentPage = this.page;
      this.width = 0;
      this.height = 0;
      this.xAxis = 0;
      this.yAxis = 0;      
      this.page = 0;
      this.$nextTick().then(() => {
        this.page = currentPage;
      })
    },
    openDialog(index){
      this.indexTtd=index
      this.dialog=true
    },
    async sign() {
      this.overlay = true;

      let reqBody = {
        fileBase64: this.fileBase64,
        npk: this.npk,
        nik: this.nik,
        passphrase: this.passphrase,

        petugas:this.kodeUser           
      };
      let reqBody2 = {
        fileBase64: this.fileBase64,
        linkQR: this.linkQR,
        npk: this.npk,
        nik: this.nik,
        passphrase: this.passphrase,
        page: this.page,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        width: this.width,
        height: this.height,

        petugas:this.kodeUser           
      };
      let reqBody3 = {
        fileBase64: this.fileBase64,
        imageTtdBase64: this.imageTtdBase64,
        npk: this.npk,
        nik: this.nik,
        passphrase: this.passphrase,
        page: this.page,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        width: this.width,
        height: this.height,

        petugas:this.kodeUser           
      };
      let reqBody4 = {
        fileBase64: this.fileBase64,
        imageTtdBase64: this.imageTtdBase64,
        npk: this.npk,
        nik: this.nik,
        passphrase: this.passphrase,
        page: this.page,
        width: this.width,
        height: this.height,
        tagKoordinat: this.tagKoordinat,

        petugas:this.kodeUser           
      };

      if (this.indexTtd == 2) {
        reqBody = reqBody2;
      } else if (this.indexTtd == 3) {
        reqBody = reqBody3;
      } else if (this.indexTtd == 4) {
        reqBody = reqBody4;
      }

      if( imageTtdBase64=='' && (this.indexTtd==3 || this.indexTtd==4) ) {
        this.overlay = false;
        this.dialog=false;
        this.passphrase="";
        this.$swal("Error", "Data tanda tangan tidak ditemukan!", "info");
        return;
      }
      console.log(reqBody)
      this.$axios({
        url: '/esign/upload',
        method: 'POST',
        data: reqBody
      })
        .then((response) => {
          if (response.data.base64_file) {
            const byteCharacters = atob(response.data.base64_file);
            const byteArrays = [];
            for (
              let offset = 0;
              offset < byteCharacters.length;
              offset += 512
            ) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", Date.now() + ".pdf");
            document.body.appendChild(link);
            link.click();
            this.overlay = false;
            this.dialog=false;
            this.passphrase="";
            this.$swal("", "Tandatangan elektronik berhasil!", "success");
          } else {
            console.log(765,response)
            this.overlay = false;
            this.dialog=false;
            this.passphrase="";
            if (response.data.msg && response.data.msg.error) {
              this.$swal("", response.data.msg.error, "error");
            } else {
              this.$swal("", "Tandatangan elektronik gagal!", "error");
            }
          }
        })
        .catch((error) => {
          this.overlay = false;
          this.dialog=false;
          this.passphrase="";
          console.log(error)
          if (error.response) {
            this.$swal("Gagal", error.response.data.error, "error");
          } else {
            this.$swal("", "Proses tandatangan elektronik gagal!", "error");
          }
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
    }

  },
};
</script>