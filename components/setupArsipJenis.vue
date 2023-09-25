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
          <v-toolbar-title></v-toolbar-title>SETUP / ARSIP JENIS
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success" @click="doEntriItem()" class="mb-2" v-bind="attrs" v-on="on"
                >New Item</v-btn
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
                          v-model="form.kodeJenisArsip"
                          label="Kode Jenis Arsip"
                          :rules="rules.required"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.namaJenisArsip"
                          label="Nama Jenis Arsip"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.keterangan"
                          label="Keterangan"
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
                <v-btn color="green darken-1" text @click="close">Close</v-btn>
                <v-btn color="green darken-1" :disabled="!valid" @click="save">Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
            <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.noIndex }}</td>
          <td>{{ item.kodeJenisArsip }}</td>
          <td>{{ item.namaJenisArsip }}</td>
          <td>{{ item.keterangan }}</td>
          <td align="center">
        <v-tooltip bottom>
          <template  v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editArsipJenis(item)"> mdi-pencil </v-icon>
        </template>
             <span>Edit</span>
         </v-tooltip>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on" @click="nonActiveArsipJenis(item)"> mdi-close-box </v-icon>
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
      dialog:false,
      rows:[],
      editedIndex:-1,
      valid: false,
      petugas: 'ER154300',
      idSelected:null,
      formTitle:'Setup Arsip Jenis',
      form:{
        kodeJenisArsip: '',
        namaJenisArsip: '',
        keterangan: '',
      },
      kodeUser:null,
      entri:true,
      objectEdit:null,
       headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "Kode Jenis Arsip", value: "kodeJenisArsip", sortable: false },
      { text: "Nama Jenis Arsip", value: "namaJenisArsip", sortable: false },
      { text: "Keterangan", value: "keterangan", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rules: {
      required: [(v) => !!v || "Field is required"],
    },
    };
  },
  components: {},
  created() {
    this.getListData();
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
    doEntriItem(){
      this.formTitle = "PENAMBAHAN ITEM ARSIP JENIS";
      this.form = Object.assign({},{});
      this.dialog = true;
    },
    async getListData() {
      const items = [];
      await this.$axios.get("/master/menu-arsip-jenis")
        .then((res)=>{
          if(res.data.ret === "0"){
            var seq=0;
            res.data.data.forEach(item => {
              seq++;
              items.push({
                ...item,
                noIndex:seq
              })
            });
            this.rows = items
          }
          else {
            this.rows = [];
          }
        })
      
    },
    close(){
      this.form = Object.assign({}, {})
      this.$refs.form.reset()
      this.editedIndex = -1;
      this.entri = true;
      this.dialog = false
    },
    editArsipJenis(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id;
      this.entri = false;
      this.objectEdit = val.namaJenisArsip;
      this.form = Object.assign({}, val);
      this.dialog = true;
    },
    nonActiveArsipJenis(val){
      this.idSelected = val.id;
      this.objectEdit = val.namaJenisArsip
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan Arsip Jenis "+this.objectEdit,
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
      this.overlay = true;
      let params = {
        petugas : this.kodeUser
      };
      let url = '/master/menu-arsip-jenis/'+val
      await this.$axios({
                  method: 'delete',
                  url: url,
                  data: params
                })
            .then(res => {
                  console.log(res.data)
                  if(res.data.ret === "0") {
                     // handle success
                    this.overlay = false;
                    this.$swal("Berhasil", `Arsip Jenis berhasil dihapus`, "success");
                    this.getListData();
                    this.dialog = false;
                  }
                  else {
                    this.overlay = false;
                    this.$swal("Gagal!", "error", "error");
                    this.dialog = false;
                  } 
                })
                .catch(err => {
                    // handle error
                    this.overlay = false;
                    this.dialog = false;
                })
     },
    async save() {
      if (this.editedIndex > -1) {
        console.log('update here')
        Object.assign(this.rows[this.editedIndex], this.form);
        this.overlay = true;
        let params = {
          kodeJenisArsip: this.form.kodeJenisArsip,
          namaJenisArsip: this.form.namaJenisArsip,
          keterangan: this.form.keterangan,
          petugas: this.kodeUser
        }
        let url = '/master/menu-arsip-jenis/'+this.idSelected
        await this.$axios({
                  method: 'put',
                  url: url,
                  data: params
                })
                .then(res => {
                  if(res.data.ret === "0"){
                    // handle success
                    this.overlay = false;
                    this.$swal("Berhasil", `Arsip Jenis ${this.objectEdit} berhasil diupdate`, "success");
                    this.close()
                  
                    this.getListData();
                    this.dialog = false;
                  }else{
                    // handle error
                    this.overlay = false;
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                  }
                })
                .catch(err => {
                    // handle error
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                    this.overlay = false
                    console.log(err);
                })

      } else {
       //entri item
       console.log('entri here')
       console.log(this.form);
       this.overlay = true;
       await this.$axios.post("/master/menu-arsip-jenis",{
          kodeJenisArsip: this.form.kodeJenisArsip,
          namaJenisArsip: this.form.namaJenisArsip,
          keterangan: this.form.keterangan,
          petugas:this.kodeUser,
       })
        .then(res => {
          if(res.data.ret==="0"){
             // handle success
              this.overlay = false
              this.$swal("Berhasil", "Arsip Jenis berhasil ditambahkan", "success");
              this.close();
              this.getListData();
          } else {
             // handle error
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                    this.overlay = false;
                    console.log(err);
          }  
                })
                .catch(err => {
                   // handle error
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                    this.overlay = false;
                    console.log(err);
                   
                })
      }
      this.close();
    },
  },
};
</script>
