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
          <v-toolbar-title></v-toolbar-title>SETUP / MENU
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success" @click="doEntriItem" class="mb-2" v-bind="attrs" v-on="on"
                >New Menu</v-btn
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
                        <v-text-field
                          v-if="!entri"
                          v-model="form.kodeMenu"
                          label="Kode Menu"
                          :rules="rules.required"
                          :readonly="!entri"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.namaMenu"
                          label="Nama Menu"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.icon"
                          label="Icon"
                          :rules="rules.required"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="form.page"
                          label="Path Menu"
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
          <td>{{ item.no }}</td>
          <td>{{ item.kodeMenu }}</td>
          <td>{{ item.namaMenu }}</td>
          <td>{{ item.icon }}</td>
          <td>{{ item.page }}</td>
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
      entri:true,
      overlay:false,
      dialog:false,
      listMenu: [],
      formTitle:'Penambahan Menu',
      editedIndex: -1,
      idSelected:null,
      valid: false,
      rows:[],
      kodeUser:null,
      petugas:'ER154300',
      status:'Y',
      menuSelected: null,
      url:"",
      form:{
        versi: null,
        kodeMenu: null,
        namaMenu: null,
        icon: null,
        page: null,
      },
       headers: [
      { text: "No", value: "noIndex", sortable: false },
      { text: "Kode Menu", value: "kodeJenisNaskah", sortable: false },
      { text: "Nama Menu", value: "namaMenu", sortable: false },
      { text: "Icon", value: "icon", sortable: false },
      { text: "Path Menu", value: "page", sortable: false },
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
    async getListData() {
      //  await this.$axios.get("/master/menu");
      //  this.rows = data.data;
      this.overlay = true;
      this.$axios.get("/master/menu")
        .then((res)=>{
          if(res.data.ret === "0"){
            this.overlay = false;
            const items = [];
            let seq = 0;
            res.data.data.forEach(item => {
              seq++;
              items.push({
              kodeMenu: item.kodeMenu,
              versi: item.versi,
              id: item.id,
              icon: item.icon,
              namaMenu: item.namaMenu,
              page: item.page,
              aktif: item.aktif,
              no: seq
              })
              
            });
            this.rows = items
          }
          else {
            this.rows = [];
            this.overlay = false;
            
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
        this.entri = true;
      });
      this.dialog = false;
    },
    editItem(val){
      this.editedIndex = this.rows.indexOf(val);
      this.idSelected = val.id
      this.entri=false;
      this.formTitle = 'UPDATE MENU'
      this.form = Object.assign({}, val);
      this.dialog = true;
    },
    doEntriItem(){
      this.formTitle = "PENAMBAHAN MENU"
      this.dialog = true;
    },
    nonActiveItem(val){
      this.idSelected = val.id;
      this.menuSelected = val.namaMenu;
      this.$swal({
        title: "Anda Yakin?",
        text: "Menonaktifkan Menu "+this.menuSelected,
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
      let url = '/master/menu/'+val
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
                    this.$swal("Berhasil", "Menu berhasil dihapus", "success");
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
        this.overlay = true
        await this.$axios.put(`/master/menu/${this.idSelected}`, {
          kodeMenu: this.form.kodeMenu,
          namaMenu: this.form.namaMenu,
          icon: this.form.icon,
          page: this.form.page,
          petugas: this.kodeUser,
                })
                .then(res => {
                    if(res.data.ret==="0"){
                      this.overlay = false
                      this.$swal("Berhasil", "Menu berhasil diupdate", "success");
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
       await this.$axios.post("/master/menu",{
          namaMenu: this.form.namaMenu,
          icon: this.form.icon,
          page: this.form.page,
          petugas: this.kodeUser,
       })
       .then(res => {
                if(res.data.ret==="0")
                {
                    this.overlay = false;
                    this.$swal("Berhasil", "Menu berhasil ditambahkan", "success");
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
  }
}
</script>
