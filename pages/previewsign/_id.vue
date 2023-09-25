<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <!-- <v-row>
          <select @change="docSelected" style="width: 30em">
            <option value=''>-- SELECT --</option>
            <option v-for="item in pdfData.docs" :value="item.namaFile" v-text="item.namaFile"></option>
          </select>
        </v-row> -->

        <v-row>
          <v-btn-toggle>
            <!-- <v-btn class="ml-2 mb-2" text small>
              <v-icon small>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn class="ml-2 mb-2" text small>
              <v-icon small>mdi-arrow-right</v-icon>
            </v-btn> -->
            <v-btn :href="pdfViewSrc" target="_blank">View</v-btn>
          </v-btn-toggle>
        </v-row>

        <v-row v-for=" (file, index) in pdfData.docs" :key="index">
            <v-col>
            <div :v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center" :style="{ width: loadedRatio * 100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%</div>
            <pdf
                  v-for="i in numPages[index]"
                  :key="i"
                  :src="file.namaFile"
                  :page="i"
                  :style="{inline:'',width:zoom}"
                ></pdf>
            </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" xs="12" sm="12" md="6" lg="6">
        <h3>Data</h3>
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="font-weight-bold">NPK</td>
                <td>{{npk}}</td>
              </tr>
              <!-- <tr>
                <td class="font-weight-bold">Jenis Arsip</td>
                <td>JHT</td>
              </tr> -->
            </tbody>
          </template>
        </v-simple-table>

        <!-- <div style="padding-top:20px;" if="pdfData.docDetil">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Nama Atribut</th>
                  <th class="text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pdfData.docDetil" :key="item.namaAtribut">
                  <td>{{ item.namaAtribut }}</td>
                  <td>{{ item.objectValue }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div> -->
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
import pdf from "vue-pdf-signature";

export default {
  components: { pdf },
  data() {
    return {
      show: true,
      dialog: false,

      pdfData: {
        doc: [],
        docDetil: [],
        docs: []
      },
      src: "",
      pdfViewSrc: "",

      zoom: "100%",
      loadedRatio: 0,
      page: 1,
      numPages: [],
      rotate: 0,

      npk:"",
    };
  },
  async created() {
    console.log(this.$route.params.id,'xxxxx')
    let { data } = await this.$axios.get("/arsip/signdoc/" + this.$route.params.id);
    if(data.docs) {
      data.docs.forEach(el => {
        el.namaFile = process.env.baseURL2 + '/arsip/pdf?path=' + this.$encrypt(el.namaFile)
      });
    }
    this.pdfData = data
    this.pdfViewSrc = process.env.baseURL2 + "/arsip/" + this.$route.params.id + "/pdf";

    for(var x=0; x<data.docs.length;x++){
      console.log(data.docs[x].namaFile)
      this.src = pdf.createLoadingTask(data.docs[x].namaFile);
      var srcIndex = data.docs[x].namaFile
      console.log(data.docs[x])
      this.npk=data.docs[x].npk
      this.src.promise.then((pdf) => {
        this.numPages.push(pdf.numPages) ;
      });
    }
  },
  methods: {
    error: function (err) {
      console.log(err);
    },
    docSelected: function(event) {
      if(event.target.value && event.target.value!='') {
        this.src = pdf.createLoadingTask(event.target.value);
        console.log(this.pdfData.docs.length)
        this.src.promise.then((pdf) => {
          this.numPages = pdf.numPages;
        });
      }
    },
    numPagesFunc:function(file){
      const x = pdf.createLoadingTask(file);
      x.promise.then((pdf) => {
        console.log(pdf.numPages);
        return pdf.numPages
      });
    }
  },
};
</script>