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
          <v-toolbar-title></v-toolbar-title>SETUP / ROLE MENU
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn  @click="doEntriItem()" color="success" class="mb-2" v-bind="attrs" v-on="on"
                >New Role Menu</v-btn
              >
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-4">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" :lazy-validation="false">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-autocomplete
                          v-model="form.kodeMenu"
                          :items="listMenu"
                          :item-text="item=> item.kodeMenu + ' - ' + item.namaMenu " 
                          item-value="kodeMenu"
                          label="Kode Menu*"
                          placeholder="Pilih Kode Menu"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.kodeFungsi"
                          label="Kode Fungsi"
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
          <td>{{ item.no}}</td>
          <td>{{ item.kodeMenu }}</td>
          <td>{{ item.kodeFungsi }}</td>
          <td align="center">
        <v-tooltip bottom>
          <template  v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on" class="mr-2" @click="editRoleMenu(item)"> mdi-pencil </v-icon>
        </template>
             <span>Edit</span>
         </v-tooltip>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on" @click="nonActiveRoleMenu(item)"> mdi-close-box </v-icon>
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
      listMenu:[],
      formTitle:'Penambahan Role Menu',
      rows:[],
      url: '',
      rowsActive:[],
      editedIndex: -1,
      idSelected:null,
      petugas:'ER154300',
      status:'Y',
      entri:true,
      form:{},
      rules: {
        required: [(v) => !!v || "Field is required"],
      },
      valid: false,
      kodeUser:null,
      objectEdit:null,
       headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "Kode Menu", value: "kodeMenu", sortable: false },
      { text: "Kode Fungsi", value: "KodeFungsi", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    };
  },
  components: {},
  created() {
    this.getDetailData();
    this.getKodeMenu();
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
      this.formTitle = "PENAMBAHAN MENU";
      this.form = Object.assign({},{});
      this.dialog = true;
    },
    async getKodeMenu(){
      await this.$axios.get("/master/menu")
        .then((res)=>{
          if(res.data.ret === "0"){
          this.listMenu = [];
          if (res.data.ret === "0" && res.data.data.length > 0) {
            res.data.data.forEach((item) => {
              this.listMenu.push({
                ...item,
              });
            });
            console.log(this.listMenu)
          } else {
            this.listMenu = [];
          }
          }})
        .catch((error) => {
          this.listMenu = [];
          console.error(error);
        });
    },
    async getDetailData() {
      await this.$axios.get("/master/menu-role")
      .then((res)=>{
          if(res.data.ret === "0"){
            const items = [];
            let seq = 0;
            res.data.data.forEach(item => {
              seq++;
              items.push({
                ...item,
              no: seq
              })
            });
            this.rows = items;
          }
          else {
            this.$swal("Gagal!", "Gagal request ke server!", "error");
            this.rows = [];

            
          }
        })
        .catch((error) => {
          this.rows = [];
          console.error(error);
        });
    },
    close(){
      this.$nextTick(() => {
        this.form = Object.assign({}, {})
        this.$refs.form.reset()
        this.editedIndex = -1;
      });
      this.entri = true;
      this.dialog = false
    },
    editRoleMenu(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id
      this.objectEdit = val.kodeMenu
      this.entri = false;
      this.formTitle = 'UPDATE ROLE MENU'
      this.form = Object.assign({}, val);
      console.log(val)
      this.dialog = true;
    },
    nonActiveRoleMenu(val){
      this.idSelected = val.id;
      this.objectEdit = val.kodeMenu;
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan Role Menu",
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
        petugas: this.kodeUser,
      }
      let url = '/master/menu-role/'+val;
      console.log(url);
      console.log(params);
       await this.$axios({
                  method: 'delete',
                  url: url,
                  data: params
                })
            .then(res => {
               console.log(res.data)
                  if(res.data.ret === "0"){
                        // handle success
                    this.overlay = false
                    this.$swal("Berhasil", `Role Menu ${this.objectEdit} berhasil dihapus`, "success");
                    this.getDetailData();
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
                    this.$swal("Gagal!", "Gagal request ke server!", "error");
                    this.dialog = false;
                })
     },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rows[this.editedIndex], this.form);
        this.overlay = true
        await this.$axios.put(`/master/menu-role/${this.idSelected}`, {
          kodeMenu: this.form.kodeMenu,
          kodeFungsi: this.form.kodeFungsi,
          petugas: this.kodeUser,
                })
                .then(res => {
                    // handle success
                    this.overlay = false
                    this.$swal("Berhasil", `Role Menu ${this.objectEdit} berhasil diupdate`, "success");
                    this.close()
                    this.getDetailData();
                    this.dialog = false;
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
       console.log(this.form)
       await this.$axios.post("/master/menu-role",{
          kodeMenu: this.form.kodeMenu,
          kodeFungsi: this.form.kodeFungsi,
          petugas: this.kodeUser,
       })
        .then(res => {
              if(res.data.ret === "0"){
                    // handle success
                    this.overlay = false
                    this.$swal("Berhasil", `Role Menu ${this.form.kodeMenu} berhasil ditambahkan`, "success");
                    this.close();
                    this.getDetailData();
              } else {
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                    this.overlay = false
              }
                })
                .catch(err => {
                    // handle error
                    this.$swal.fire("Gagal!", "Gagal request ke server!", "error");
                    this.overlay = false
                    console.log(err);
                })
      }
      this.close();
  },
  },
};
</script>
