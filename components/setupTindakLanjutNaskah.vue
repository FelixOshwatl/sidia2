<template>
 <div>
    <v-data-table
      dense
      :headers="headers"
      :items="rows"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar text dark style="background: #eee; color: #000">
          <v-toolbar-title></v-toolbar-title>SETUP / TINDAK LANJUT NASKAH
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success" @click="doEntriItem()" class="mb-2" v-bind="attrs" v-on="on"
                >NEW ITEM</v-btn
              >
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" :lazy-validation="false">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-if="!entri"
                          v-model="form.kodeTl"
                          label="Kode Tindak Lanjut"
                          :rules="rules.required"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.namaTl"
                          label="Nama Tindak Lanjut"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="close()">Close</v-btn>
                <v-btn color="green darken-1" @click="save()" :disabled="!valid">Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
       <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.noIndex }}</td>
          <td>{{ item.kodeTl }}</td>
          <td>{{ item.namaTl }}</td>
          <td align="center">
        <v-tooltip bottom>
          <template  v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        </template>
             <span>Edit</span>
         </v-tooltip>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on" @click="nonActiveItem(item)"> mdi-close-box </v-icon>
            </template>
             <span>Nonaktif</span>
         </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import helper from "@/helpers/index";
export default {
  data() {
    return {
      resultList: [],
      overlay:false,
      valid:false,
      dialog:false,
      entri:true,
      idSelected:null,
      tlSelected:null,
      editedIndex:-1,
      petugas:'ER154300',
      rows:[],
      rowsActive:[],
      rules: {
        required: [(v) => !!v || "Field is required"],
      },
      formTitle:'SETUP TINDAK LANJUT NASKAH',
      form:{
        versi: '',
        kodeTl: '',
        namaTl: '',
      },
      kodeUser:null,
       headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "Kode TL", value: "kodeTL", sortable: false },
      { text: "Nama TL", value: "namaTL", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
      itemDummy: [
      { 
        noIndex:1,
        versiTL:1,
        kodeTL:'TL003',
        namaTL:'PARAF',
       },
    ],
    };
  },
  components: {},
  created() {
    this.getDetailData();
     if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        // this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        // this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = dataUser.kodeUser;
      }
    } else {
      // this.$router.push({ path: "/login" });
    }
  },
  watch: {},
  
  methods: {
       nonActiveItem(val){
      this.idSelected = val.id;
      this.tlSelected = val.kodeTl;
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan Kode TL "+this.tlSelected,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          this.doNonActiveItem(this.idSelected)
        }
      });
    },
      async doNonActiveItem(val){
      this.overlay = true
      let params = {
        petugas : this.kodeUser
      };
      let url = '/master/naskah-tl/'+val
      await this.$axios({
                  method: 'delete',
                  url: url,
                  data: params
                })
            .then(res => {
                  if(res.data.ret === "0") {
                     // handle success
                    this.overlay = false;
                    this.$swal("Berhasil", "Kode TL berhasil dihapus", "success");
                    this.getDetailData();
                    this.dialog = false;
                  }
                  else {
                    this.overlay = false;
                    this.$swal("Gagal!", "res.data.msg", "error");
                    this.dialog = false;
                  } 
                })
                .catch(err => {
                    // handle error
                    this.overlay = false;
                    this.dialog = false;
                })
     },
    doEntriItem(){
      this.formTitle = "PENAMBAHAN TL NASKAH"
      this.form = Object.assign({},{});
      this.dialog = true;
    },
    editItem(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id;
      this.formTitle = 'UPDATE TL';
      this.entri = false;
      this.form = Object.assign({}, val);
      console.log(this.form)
      this.dialog = true;
    },
        async getDetailData() {
      this.$axios.get("/master/naskah-tl")
        .then((res)=>{
          if(res.data.ret === "0"){
            const items = [];
            let noIndex=0;
            res.data.data.forEach(item => {
              noIndex++;
              items.push({
              ...item,
              noIndex:noIndex,
              })
              this.rows = items;
            });
          }
          else {
            this.rows = [];
            
          }
        })
        .catch((error) => {
          this.rows = [];
          console.error(error);
        });
    },
    close() {
      this.$nextTick(() => {
        this.form = Object.assign({}, {})
        this.$refs.form.reset()
        this.editedIndex = -1;
      });
      this.entri=true;
      this.dialog = false;

    },
    async save() {
      if (this.editedIndex > -1) {
        console.log('update here')
        this.overlay = true
        await this.$axios.put(`/master/naskah-tl/${this.idSelected}`, {
          kodeTl: this.form.kodeTl,
          namaTl: this.form.namaTl,
          petugas: this.kodeUser,
                })
                .then(res => {
                    if(res.data.ret==="0"){
                      this.overlay = false
                      this.$swal("Berhasil", "TL berhasil diupdate", "success");
                      this.close();
                      this.getDetailData();
                    } else {
                       this.$swal("Gagal!", "res.data.msg", "error");
                      this.overlay = false
                    }    
                })
      } else {
       //entri item
       console.log('entri here')
       await this.$axios.post("/master/naskah-tl",{
          kodeTl: this.form.kodeTl,
          namaTl: this.form.namaTl,
          petugas: this.kodeUser,
       })
       .then(res => {
                if(res.data.ret==="0")
                {
                    this.overlay = false;
                    this.$swal("Berhasil", "", "success");
                    this.close();
                    this.getDetailData();
                    this.dialog = false;
                } else {
                  this.overlay = false;
                  this.$swal("Gagal!", "res.data.msg", "error");
                  this.dialog = false;
                  }
                })
                .catch(err => {
                    // handle error
                    this.overlay = false
                    this.$swal("Gagal!", "res.data.msg", "error");
                    this.dialog = false;
                })
      }
  },
  },
    
};
</script>
