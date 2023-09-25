<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-btn
          :to="{ path: '/' + recentPage }"
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
              <!-- <v-btn :href="pdfViewSrc" target="_blank">View</v-btn> -->
              <v-btn v-if="kodeUser != ''" @click="getPdf">Full PDF</v-btn>
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
  </v-container>
</template>

<style scoped>
.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:not(:last-child)
  > td {
  border-bottom: 0 !important;
}
</style>
<script>
import helper from "@/helpers/index";
import pdf from "vue-pdf-signature";

export default {
  components: { pdf },
  data() {
    return {
      show: false,
      dialog: false,
      kodeUser: "",
      kodeKantor: "",
      namaPointerArsip: "",
      namaJenisArsip: "",
      pdfData: {
        doc: [],
        docDetil: [],
      },
      src: "",
      pdfViewSrc: "",
      pdfViewSrcDownload: "",
      recentPage: "",
      zoom: "50%",
      loadedRatio: 0,
      page: 1,
      numPages: 0,
      rotate: 0,
      dataUser: [],
      stDownload: "T"
    };
  },

  async created() {
    this.recentPage = sessionStorage.getItem("recentPage");

    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      if (this.dataUser.kodeUser == 0) {
        this.dataUser.npk = "999999"
        this.dataUser.kodeKantor = "EXT"
        this.dataUser.kodeRole = "999"
      }
    } else {
      this.dataUser.npk = "999999"
      this.dataUser.kodeKantor = "EXT"
      this.dataUser.kodeRole = "999"
    }

    let { data } = await this.$axios.get("/arsip/" + this.$route.params.id,{
          params:{
            idArsip: this.$route.params.id,
            npk: this.dataUser.npk,
            kodeKantor: this.dataUser.kodeKantorRole,
            kodeRole: this.dataUser.kodeRole
          }
        });
    this.pdfData = data;
    // console.log(this.pdfData);
    this.namaPointerArsip = this.pdfData.data[0].namaPointerArsip;
    this.namaJenisArsip = this.pdfData.doc[0].namaJenisArsip;
    this.stDownload = this.pdfData.doc[0].stDownload
    //let pdfFile = this.pdfData.doc[0] ? "http://sidia.bpjsketenagakerjaan.go.id/services/arsip/pdf?path=" + this.pdfData.doc[0].namaFile : "";
    //this.pdfViewSrc = "http://sidia.bpjsketenagakerjaan.go.id/services/arsip/" + this.$route.params.id + "/pdf";
    let pdfFile = this.pdfData.doc[0]
      ? process.env.baseURL2 + "/arsip/pdf?path=" + this.$encrypt(this.pdfData.doc[0].namaFile)
      : "";
    this.pdfViewSrc =
      process.env.baseURL2 + "/arsip/" + this.$route.params.id + "/pdf";
    this.pdfViewSrcDownload =
      process.env.baseURL2 + "/arsip/" + this.$route.params.id + "/download";

    this.src = pdf.createLoadingTask(pdfFile);
    if (this.src != "") {
      this.src.promise.then((pdf) => {
        this.numPages = pdf.numPages;
      });
      this.show = true;
    }

    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeUser = dataUser.kodeUser;
      this.kodeKantor = dataUser.kodeKantor;
    } else {
      this.kodeUser = "";
    }
  },
  methods: {
    password: function (updatePassword, reason) {
      updatePassword(prompt('password is "test"'));
    },
    error: function (err) {
      console.log(err);
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
          "/arsip/download/" + this.$route.params.id,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            baseURL:process.env.baseURL2, responseType: "blob",
            transformResponse: [],
            params: {
              kodeUser: this.kodeUser,
              kodeKantor: this.kodeKantor,
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
};
</script>