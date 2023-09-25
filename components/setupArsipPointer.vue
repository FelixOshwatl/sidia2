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
          <v-toolbar-title></v-toolbar-title>SETUP / ARSIP POINTER
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="doEntriItem()" color="success" class="mb-2" v-bind="attrs" v-on="on"
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
                          label="Kode Pointer Arsip"
                          v-model="form.kodePointerArsip"
                          :rules="rules.required"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          label="Nama Pointer Arsip"
                          v-model="form.namaPointerArsip"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          label="Keterangan"
                          v-model="form.keterangan"
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
          <td>{{ item.kodePointerArsip }}</td>
          <td>{{ item.namaPointerArsip }}</td>
          <td>{{ item.keterangan }}</td>
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
      dialog:false,
      formTitle:'Setup Arsip Pointer',
      idSelected: null,
      form:{
        versi: '',
        kodeMenu: '',
        namaMenu: '',
        icon: '',
        pathPage: '',
      },
      rows:[],
      valid: false,
      kodeUser:null,
      petugas:'ER154300',
      entri:true,
      objectEdit: null,
      editedIndex: -1,
      rules: {
       required: [(v) => !!v || "Field is required"],
      },
       headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "Kode Pointer Arsip", value: "kodePointerArsip", sortable: false },
      { text: "Nama Pointer Arsip", value: "namaPointerArsip", sortable: false },
      { text: "Keterangan", value: "keterangan", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
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
      this.formTitle = "PENAMBAHAN ARSIP POINTER"
      this.form = Object.assign({},{})
      this.dialog = true;
    },
    close(){
          this.$nextTick(() => {
        this.form = Object.assign({}, {})
        this.$refs.form.reset()
        this.editedIndex = -1;
      });
      this.entri=true;
      this.dialog = false;

    },
    editItem(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id;
      this.objectEdit = val.namaPointerArsip;
      this.entri = false;
      this.formTitle = 'UPDATE ARSIP POINTER'
      this.form = Object.assign({}, val);
      this.dialog = true;
    },
    nonActiveItem(val){
      this.idSelected = val.id;
      this.objectEdit = val.namaPointerArsip;
      let kodePointerArsip = val.kodePointerArsip;
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan Arsip Pointer "+this.objectEdit,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          this.doNonActiveItem(this.idSelected,this.objectEdit)
        }
      });
    },
    async doNonActiveItem(val){
      this.overlay = true;
      let params = {
        petugas : this.kodeUser
      };
      let url = '/master/menu-arsip-pointer/'+val
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
                    this.$swal("Berhasil", `Arsip Pointer ${this.objectEdit} berhasil dihapus`, "success");
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
    async getListData() {
      await this.$axios.get("/master/menu-arsip-pointer")
        .then((res)=>{
          if(res.data.ret === "0"){
            const items = [];
            var noIndex=0;
            res.data.data.forEach(item => {
              noIndex++;
              items.push({
              ...item,
              noIndex:noIndex,
              })
            });
            this.rows = items
            console.log(this.rows)
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
          async save() {
      if (this.editedIndex > -1) {
        console.log('update here')
        Object.assign(this.rows[this.editedIndex], this.form);
        this.overlay = true
        await this.$axios.put(`/master/menu-arsip-pointer/${this.idSelected}`, {
         kodePointerArsip: this.form.kodePointerArsip,
         namaPointerArsip: this.form.namaPointerArsip,
         keterangan: this.form.keterangan,
         petugas: this.kodeUser
                })
                .then(res => {
                    if(res.data.ret==="0"){
                      this.overlay = false
                      this.$swal("Berhasil", `Arsip Pointer ${this.objectEdit} berhasil diupdate`, "success");
                      this.close();
                      this.getListData();
                      this.dialog = false;
                    } else {
                       this.$swal("Gagal!", "error", "error");
                      this.overlay = false
                    }    
                })
                .catch(err => {
                    // handle error
                    this.$swal("Gagal!", "error", "error");
                    this.overlay = false
                    console.log(err);
                })

      } else {
       //entri item
       console.log('entri here')
       await this.$axios.post("/master/menu-arsip-pointer",{
         kodePointerArsip: this.form.kodePointerArsip,
         namaPointerArsip: this.form.namaPointerArsip,
         keterangan: this.form.keterangan,
         petugas: this.kodeUser  
       })
       .then(res => {
                if(res.data.ret==="0")
                {
                    this.overlay = false;
                    this.$swal("Berhasil", `Arsip Pointer ${this.form.namaPointerArsip} berhasil ditambahkan`, "success");
                    this.close();
                    this.getListData();
                    this.dialog = false;
                } else {
                  this.overlay = false;
                  this.$swal("Gagal!", "error", "error");
                  this.close();
                  this.dialog = false;
                  }
                })
                .catch(err => {
                    // handle error
                    this.overlay = false
                    console.log(err)
                    this.$swal("Gagal!", "error", "error");
                    this.close();
                    this.dialog = false;
                })
      }
  },
  },

};
</script>
