<template>
   <v-dialog 
    :value="true"
    @input="$emit('close')"
    v-on="$attrs"
    v-bind="$listeners"
    max-width="700">
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
                @click="downloadAll(rowsmasal)"	
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
          :headers="headersMasal"	
          :items="rowsmasal"	
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
        
      <v-card-actions  style="text-align: right;">
        <v-spacer></v-spacer>
          <v-btn color="grey" class="mr-2 white--text" @click="closeMasal">Close</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import helper from "@/helpers/index";
import masalFormDialog from "~/components/masalFormDialog";

export default {
  props: {
    prop: {
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
          { text: "No.", value: "no", sortable: false },
          { text: "No. Naskah", value: "noNaskah", sortable: false },
          { text: "Jenis Naskah", value: "namaJenisNaskah", sortable: false },
          { text: "Perihal", value: "perihal", sortable: false },
          // { text: "Status Draft", value: "stDraft", sortable: false },
          { text: "Status", value: "stSend", sortable: false },
          { text: "Terakhir Diperbarui", value: "lastUpdated", sortable: false },
          { text: "Action", value: "action", sortable: false }
        ],
        headersMasal: [
          { text: "No.", value: "no", sortable: false },	
          { text: "Nomor Naskah", value: "noNaskah", sortable: false, },	
          { text: "Tujuan", value: "tujuan", sortable: false, },		
          { text: "Action", value: "action", sortable: false, align: 'center' }	
        ],
        item:[],
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
        dialogMasal: false,
        itemSelected: {},
        itemsJenisNaskah:[],
        itemsJenisMonitoringNaskah:
        [{
          value:'',
          text:'Semua Jenis Monitoring Naskah'
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
        rowsmasal:[],
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
        this.getListNaskahMasal();
      },
      options: {
        handler() {
          this.getListNaskahMasal();
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

      

      downloadAll: async function (fulldata) {		
        console.log("fulldata", fulldata)
        try {	
          this.overlay = true;	
          let { data } = await this.$axios.post(`/naskah/tr/documentMasal`,	
            {	
                
              data : fulldata	
            }	
          );	
          const byteCharacters = atob(data.zipBase64);	
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
              const blob = new Blob(byteArrays, { type: "application/zip" });	
              const url = window.URL.createObjectURL(blob);	
              const link = document.createElement("a");	
              link.href = url;	
              link.setAttribute("download", Date.now() + ".zip");	
              document.body.appendChild(link);	
              link.click();	
          this.overlay = false;	
        } catch (error) {	
          this.overlay = false;	
          this.$swal("Error", "Gagal request ke server!", "error");	
          console.log(error.message.toString());	
        }	
      },
      
      async getListNaskahMasal() {
        console.log("getListNaskahMasal", this.prop)
        this.dialogMasal = true;
        console.log("this.idNaskahmasal", this.idNaskahmasal)
      let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;	
      const { page, itemsPerPage } = this.options;	
      this.$axios.post(`/naskah/tr/masal`,{	
                    page  :page,	
                    length:itemsPerPage,	
                    idNaskah    :this.prop
          })	
          .then((res)=>{	
          console.log("returngetListNaskahMasal", res.data)	
          if(res.data.rowCount >=0){	
            const items = [];	
            let seq = noIndex-1	
            console.log(this.filterTab)	
            res.data.data.forEach(item => {	
              seq++	
              items.push({	
              no: seq,	
              pathUrl: process.env.baseURL2 + "/arsip/pdf?path=" + this.$encrypt(item.namaFile),	
              ...item,	
              })	
            });	
             console.log(items)	
          	
            this.rowsmasal = items	
            this.totalData = Number(res.data.rowCount);	
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
      closeMasal: async function() {
        this.$emit('close');
      },
      openDialog(){
        this.dlg=true
      },
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
              this.$axios.get("/master/naskah-jenis")
                .then((res)=>{
                  // this.overlay = false;
                  const itemsJenisNaskah = [{
                    value:'',
                    text:'Semua Jenis Naskah'
                  }];
                  res.data.data.forEach(item=>{
                    itemsJenisNaskah.push({
                      value : item.kodeJenisNaskah,
                      text : item.namaJenisNaskah
                    })
                  })
                  this.itemsJenisNaskah = itemsJenisNaskah;
                  // console.log('ini dia bro')
                  // console.log(this.itemsJenisNaskah)

                })
                .catch((err) => {
                    // this.overlay = false;
                    console.log(err)
                });
              console.log("lempar_idNaskahMasal", this.prop)
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