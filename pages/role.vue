<template>
  <v-app id="inspire" class="bgrn-login">
    <v-main class="ma-0">
      <v-container  class="ma-0" fill-height fluid v-show="overlay">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <img alt="logo" src="/sidialogo_v2.png" style="width: 100%" />
            <v-progress-linear color="primary" indeterminate height="12" />
          </v-col>
        </v-row>
      </v-container>
      <v-container class="ma-0" fluid v-show="!overlay">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <img alt="logo" src="/sidialogo_v2.png" style="width: 100%" />
            <v-card class="elevation-12">
              <v-toolbar light flat>
                <v-toolbar-title
                  style="color: #fff; width: 100%; text-align: center"
                  >PILIH ROLE</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-autocomplete
                    prepend-icon="mdi-account-key"
                    clearable
                    :items="listRole"
                    :rules="requiredRules"
                    item-text="nama"
                    v-model="kodeRole"
                    label="Pilih Role Akses"
                  ></v-autocomplete>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="default" class="btn-half" @click="logout()"
                  >LOGOUT</v-btn
                >
                <v-btn
                  color="success"
                  class="btn-half"
                  :disabled="!formIsValid"
                  @click="login()"
                  >PILIH</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar" :timeout="3000" :color="color">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbar = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
      <!-- <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->
    </v-main>
  </v-app>
</template>

<style>
.v-card__actions {
  display: block !important;
  text-align: center;
  padding: 20px 5px !important;
}
</style>

<script>
import helper from "@/helpers/index";

export default {
  layout: "page",
  data() {
    return {
      overlay: false,
      snackbar: false,
      text: "",
      color: "error",
      kodeRole: "",
      kodeKantorRole: "",
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      resultRole: [],
      listRole: [],
      dataUser: []
    };
  },
  created: async function () {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (this.dataUser.setRole) {
        this.$router.push({ path: "/" });
      } else {
        await this.getListRole();

        // FIREBASE
        this.startFirebase()

      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  computed: {
    formIsValid() {
      return this.kodeRole;
    },
  },
  components: {},
  methods: {
    login: async function () {
      try {
        if (this.kodeRole) {
          this.overlay = true;
          let { data } = await this.$axios.get(
            "/roles",
            {
              params: { user:this.dataUser.kodeUser , kantor:this.dataUser.kodeKantor },
            }
          );
          this.resultRole = data;
          if (this.resultRole.ret == "0") {
            var dataListRole = this.resultRole.data;
            if (dataListRole != undefined && dataListRole.length > 0) {
              for (var i = 0; i < dataListRole.length; i++) {
                if (dataListRole[i].nama == this.kodeRole) {
                  let  dataKaryawan  = await this.$axios.get("/hcis/getDataKaryawan",{
                      params:{
                        npk: this.dataUser.npk,
                        kodeKantor:this.dataUser.kodeKantor
                      }
                    });
                  let  dataKantor  = await this.$axios.get("/master/master-kantor",{
                      params:{
                        npk: this.dataUser.npk,
                        kodeKantor:dataListRole[i].kantor
                      }
                    });
                  // console.log(dataKantor,'xxxxxxxxxxxxxxxxxxxxxxxxxx')
                  // this.overlay = false
                  if(dataKaryawan.data.ret == 0){
                    let dataKaryawan_=dataKaryawan.data.data[0]
                    let dataUser = {
                      ...this.dataUser,
                      id: 1,
                      setRole: true,
                      kodeRole: dataListRole[i].kode,
                      kodeKantorRole: dataListRole[i].kantor,
                      namaRole: dataListRole[i].nama,
                      positionLevel:dataKaryawan_.positionLevelUnit,
                      kodeKantorIndukRole:dataKantor.data[0].kodeKantorInduk
                    };
                    var dataLogin = await helper.encrypt(
                      JSON.stringify(dataUser)
                    );
                    sessionStorage.setItem("authSikd", dataLogin); //set sessionStorage dataLogin user
                    localStorage.setItem("authSikd", dataLogin);
                    let { data } = await this.$axios.get("/master/sidia-menu", {
                      params: { koderole: dataListRole[i].kode, npk:this.dataUser.npk, kodeKantor: dataListRole[i].kantor },
                    });
                    //menu validation
                    if (data.ret != '0' ) {
                      this.overlay = false;
                      this.snackbar = true;
                      this.text = "Invalid role menu!";
                      this.color = "error";
                      return
                    }

                    let itemsPage = data.data.map((o) => o.page.replace("/",""));
                    var dataPage = await helper.encrypt(JSON.stringify(itemsPage));
                    sessionStorage.setItem("authPage", dataPage); //set sessionStorage dataPage user
                    localStorage.setItem("authPage", dataPage);

                    if (sessionStorage.hasOwnProperty("rd")){
                      var dataPath = helper.decrypt(sessionStorage.rd);
                      this.$router.push({ path: dataPath });
                    } else {
                      this.$router.push({ path: "/" });
                    }
                    // sentry id
                    if(this.$sentry) this.$sentry.setUser({ username:this.dataUser.kodeUser, email:this.dataUser.email });
                  }else{
                    this.overlay = false;
                    this.snackbar = true;
                    this.text = dataKaryawan.data.msg;
                    this.color = "error";
                  }
                } else if (i == dataListRole.length) {
                  this.overlay = false;
                  this.snackbar = true;
                  this.text = "Anda tidak memiliki role!";
                  this.color = "error";
                }
              }
            } else {
              this.overlay = false;
              this.snackbar = true;
              this.text = "Anda tidak memiliki role!";
              this.color = "error";
            }
          } else {
            this.overlay = false;
            this.snackbar = true;
            this.text = "Gagal pilih role!";
            this.color = "error";
          }
        } else {
          this.snackbar = true;
          this.text = "Anda tidak memiliki role!";
          this.color = "error";
        }
      } catch (error) {
        this.overlay = false;
        this.snackbar = true;
        this.text = "Gagal request ke server!";
        this.color = "error";
        console.log(error.message.toString());
      }
    },
    logout: async function () {
      await this.$axios.post("/logout", { username: this.dataUser.kodeUser });
      sessionStorage.clear();
      localStorage.clear();
      localStorage.msgLogout = "Akun anda telah berhasil keluar.";
      localStorage.msgColor = "success";
      this.$router.push({ path: "/login" });
      //sentry id
      if(this.$sentry) this.$sentry.configureScope(scope => scope.setUser(null));
    },
    getListRole: async function () {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get(
          "/roles",
          {
            params: { user:this.dataUser.kodeUser , kantor:this.dataUser.kodeKantor },
          }
        );
        this.resultRole = data;
        if (this.resultRole.ret == "0") {
          this.listRole = [];
          var dataListRole = this.resultRole.data;
          if (dataListRole != undefined) {
            for (var i = 0; i < dataListRole.length; i++) {
              var list = {
                nama: dataListRole[i].nama,
                abr: dataListRole[i].kode,
                id: dataListRole[i].kode,
                kantor: dataListRole[i].kantor,
              };
              this.listRole.push(list);
            }
            this.overlay = false;
          } else {
            this.listRole = [];
          }
        } else {
          this.overlay = false;
          this.snackbar = true;
          this.text = "Gagal menampilkan data!";
          this.color = "error";
        }
      } catch (error) {
        this.overlay = false;
        this.snackbar = true;
        this.text = "Gagal request ke server!";
        this.color = "error";
        console.log(error.message.toString());
      }
    },
    startFirebase() {
      let self = this
      const firebaseConfig = {
          apiKey: "AIzaSyBYnS7uH4IfxA6PnewiNOlRTy4-0MfnLPs",
          authDomain: "push-notif-dfe3f.firebaseapp.com",
          projectId: "push-notif-dfe3f",
          storageBucket: "push-notif-dfe3f.appspot.com",
          messagingSenderId: "168314300812",
          appId: "1:168314300812:web:05a8d74abf194d6b48cea9",
          measurementId: "G-HYCS7J38JW"
      };

      //firebase.initializeApp(firebaseConfig);
      if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
   }else {
      firebase.app(); // if already initialized, use that one
   }

      const messaging = firebase.messaging();
      messaging
        .requestPermission()
        .then(function () {
            console.log("Got notification permission");
            return messaging.getToken();
        })
        .then(function (token) {
            // print the token on the HTML page
            console.log("Token is " + token);
            self.$axios.post('/naskah/updateDeviceByLogin', {
                npk: self.dataUser.npk,
                token: token,
                petugas: self.dataUser.username
                //p256dh: 'xxxx',
                //auth: 'xxxxx'
              })
            //save db
        })
        .catch(function (err) {
            console.log("Didn't get notification permission", err);

          Notification.requestPermission(function () {
              if (Notification.permission === 'granted') {
                  // user approved.
                  // use of new Notification(...) syntax will now be successful
                  console.log('accept')
                  //save to db    
                  // initFirebaseMessagingRegistration();
              } else if (Notification.permission === 'denied') {
                  // user denied.
                  console.log('denied')
              } else { 
                  console.log('no action')
                  // Notification.permission === 'default'
                  // user didn’t make a decision.
                  // You can’t send notifications until they grant permission.
              }
          });

        })

      messaging.onMessage(function (payload) {
          console.log("Message received. ", JSON.stringify(payload));
          // notificationElement.innerHTML = notificationElement.innerHTML + " " + payload.notification;
      });
      messaging.onTokenRefresh(function () {
          messaging.getToken()
              .then(function (refreshedToken) {
                  console.log('Token refreshed.');
                  console.log(refreshedToken)
                  // tokenElement.innerHTML = "Token is " + refreshedToken;
              }).catch(function (err) {
                  // errorElement.innerHTML = "Error: " + err;
                  console.log('Unable to retrieve refreshed token ', err);
              });
      });
    }
  },
  beforeDestroy () {
    this.$recaptcha.destroy()
  },
};
</script>
