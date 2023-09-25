<template>
 <div>
    <v-data-table
      dense
      :headers="headers"
      :items="rows"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="totalData"
    >
      <template v-slot:top>
        <v-toolbar text dark style="background: #eee; color: #000">
          <v-toolbar-title></v-toolbar-title>SETUP / ARSIP USER SIGN
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
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
                          v-model="form.idUserSign"
                          label="User Sign"
                          :rules="rules.required"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                        v-model="form.npk"
                          label="NPK"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.nik"
                          label="NIK"
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
          <td>{{ item.idUserSign }}</td>
          <td>{{ item.npk }}</td>
          <td>{{ item.nik }}</td>
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
      rows:[],
      formTitle:'Setup Arsip User Sign',
      form:{
        idUserSign: '',
        npk: '',
        nik: '',
      },
      editedIndex:-1,
      idSelected:null,
      petugas:'ER154300',
      valid:false,
      kodeUser:null,
      totalData: 0,
      page: 0,
      numberOfPages: 0,
      options: {},
      entri:true,
      headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "ID User Sign", value: "idUserSign",},
      { text: "NPK", value: "npkUserSign", },
      { text: "NIK", value: "nikUserSign",},
      { text: "Actions", value: "actions",},
    ],
        rules: {
      required: [(v) => !!v || "Field is required"],
    },
    };
  },
  components: {},
  created() {
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
  watch:{
    options: {
      handler() {
        this.getListData();
      },
      deep: true,

    },
  },
  methods: {
    async save() {
      this.overlay = true
      if (this.editedIndex > -1) {
        console.log('update here')
        Object.assign(this.rows[this.editedIndex], this.form);
        await this.$axios.put(`/master/menu-arsip-user-sign/${this.idSelected}`, {
          idUserSign: this.form.idUserSign,
          npk: this.form.npk,
          nik: this.form.nik,
          petugas: this.kodeUser,
                })
                .then(res => {
                    if(res.data.ret==="0"){
                      this.overlay = false
                      this.$swal("Berhasil", "User Sign berhasil diupdate", "success");
                      this.close();
                      this.getListData();
                      this.dialog = false;
                    } else {
                       this.$swal("Gagal!", "error", "error");
                      this.overlay = false
                      console.log(err);
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
       await this.$axios.post("/master/menu-arsip-user-sign",{
          idUserSign: this.form.idUserSign,
          npk: this.form.npk,
          nik: this.form.nik,
          petugas: this.kodeUser,
       })
       .then(res => {
                if(res.data.ret==="0")
                {
                    this.overlay = false;
                    this.$swal("Berhasil", "User Sign berhasil ditambahkan", "success");
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
    close(){
      this.form = Object.assign({},{})
      this.entri=false;
      this.dialog = false;


    },
    doEntriItem(){
      this.formTitle = "PENAMBAHAN USER SIGN"
      this.dialog = true;
    },
    async getListData() {
      let params= {
            page: this.options.page,
            length: this.options.itemsPerPage
        };
      let url = '/master/menu-arsip-user-sign';
      let noIndex = (this.options.page - 1) * this.options.itemsPerPage + 1;
      await this.$axios({
                  method: 'get',
                  url: url,
                  params: params
          })
        .then((res)=>{
          if(res.data.ret === "0"){
            const items = [];
            res.data.data.forEach(item => {
              items.push({
              ...item,
              noIndex: noIndex++,
              })
              this.totalData = res.data.rowCount
            });
            this.rows = [...items]
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
    editItem(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id
      this.entri = false;
      this.formTitle = 'UPDATE USER SIGN'
      console.log(this.idSelected)
      this.form = Object.assign({}, val);
      this.dialog = true;

    },
    nonActiveItem(val){
      this.idSelected = val.id;
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan User Sign ",
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
      let url = '/master/menu-arsip-user-sign/'+this.idSelected
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
                    this.$swal("Berhasil", "User Sign berhasil dihapus", "success");
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
  },
};
</script>
