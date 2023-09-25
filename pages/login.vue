<template>
  <v-app id="inspire" class="bgrn-login">
    <v-main class="ma-0">
      <v-container class="ma-0" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <img alt="logo" src="/sidialogo_v2.png" style="width: 100%" />
            <v-card class="elevation-12">
              <v-toolbar light flat>
                <v-toolbar-title
                  style="width: 100%; text-align: center"
                  >LOGIN</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text class="pt-0 pb-0">
                <v-form @submit.prevent="login">
                  <v-row>
                    <v-col cols="12" sm="12" md="12" lg="12" class="pl-5 pr-5">
                      <v-text-field
                        autocomplete="off"
                        readonly
                        onfocus="this.removeAttribute('readonly');"
                        label="Username"
                        v-model="username"
                        prepend-icon="mdi-account"
                        type="text"
                        :rules="usernameRules"
                        @keyup.enter="login()"
                      ></v-text-field>
                      <v-text-field
                        autocomplete="off"
                        readonly
                        onfocus="this.removeAttribute('readonly');"
                        id="password"
                        label="Password"
                        v-model="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        :rules="passwordRules"
                        @keyup.enter="login()"
                      ></v-text-field>
                      <!-- <recaptcha 
                        @error="onError"
                        @success="onSuccess"
                        @expired="onExpired"/> -->
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-5 pt-0">
                <v-row align="center" justify="center">
                  <v-btn
                    color="success"
                    class="btn-login"
                    :disabled="!formIsValid"
                    @click="login()"
                  >
                    <v-icon left>mdi-login</v-icon>LOGIN
                  </v-btn>
                </v-row>
                <v-row align="center" justify="center" class="mt-5">
                  <!-- <img src="/logo_bsre.png" style="margin: 5px" /> -->
                  <v-col cols="12" class="pa-0" style=" font-weight: 400; line-height: 1.375rem; letter-spacing: 0.0071428571em; color: rgba(0, 0, 0, 0.6); font-size: 0.875rem; ">
                    <small>This site is protected by reCAPTCHA <br/>and the Google 
                      <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                      <a href="https://policies.google.com/terms">Terms of Service</a> apply.
                    </small>
                  </v-col>
                </v-row>
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
      <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
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
      username: "",
      password: "",
      resultLogin: [],
      resultRole: [],
      usernameRules: [(v) => !!v || "Username harus diisi"],
      passwordRules: [(v) => !!v || "Password harus diisi"],
      recaptchaToken: null,
      userIP:'',
      userAgent:''
    };
  },
  created: async function () {
    if (localStorage.msgLogout) {
      this.snackbar = true;
      this.text = localStorage.msgLogout;
      this.color = localStorage.msgColor;
      localStorage.removeItem("msgLogout");
      localStorage.removeItem("msgColor");
    }
    localStorage.clear();
  },
  computed: {
    formIsValid() {
      return this.username && this.password;
    },
  },
  async mounted() {
    try {
      await this.$recaptcha.init()
      // let { data } = await this.$axios.get(
      //   "https://api.ipify.org?format=json",
      //   { 
      //     headers: {
      //       'Access-Control-Allow-Origin' : '*',
      //     }
      //   });
      // this.userIP = data && data.ip ? data.ip : '';
      // this.userAgent = window.navigator.userAgent
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    onError (error) {
      console.log('Error happened:', error)
    },
    onSuccess (token) {
      console.log('Succeeded')
    },
    onExpired () {
      console.log('Expired')
    },
    login: async function () {
      try {
        this.recaptchaToken = await this.$recaptcha.execute('login');
        // this.recaptchaToken = await this.$recaptcha.getResponse()
        if (!this.recaptchaToken) {
          this.snackbar = true;
          this.text = "ReCaptcha Error!";
          this.color = "error";
        } else  if (this.username && this.password) {
          this.overlay = true;
          var params = {
            username: this.username,
            password: this.password,
            token: this.recaptchaToken,
            //userIP: this.userIP,
            //userAgent: this.userAgent,
          };
          let { data } = await this.$axios.post("/login", params);
          this.resultLogin = data;
          if (this.resultLogin.ret == 0) {
            sessionStorage.setItem("authToken", this.resultLogin.token); //set sessionStorage
            localStorage.setItem("authToken", this.resultLogin.token); //set sessionStorage

            let { data } = await this.$axios.get("/roles",
              {
                params: { user:this.resultLogin.data.username , kantor:this.resultLogin.data.kodeKantor },
              }
            );
            this.resultRole = data;
            if (this.resultRole.ret == "0") {
              var dataListRole = this.resultRole.data;
              if (dataListRole != undefined && dataListRole.length > 0) {
                this.overlay = false;

                let dataTest = {
                  ...this.resultLogin.data,
                  kodeUser: this.resultLogin.data.username,
                  setRole: false
                };
                var dataLogin = await helper.encrypt(JSON.stringify(dataTest));
                sessionStorage.setItem("authSikd", dataLogin); //set sessionStorage dataLogin user
                localStorage.setItem("authSikd", dataLogin); 
                //this.$axios.setHeader('Authorization', 'Bearer ' + this.resultLogin.token)
                // await this.$recaptcha.reset()
                this.$router.push({ path: "/role" });
              } else {
                this.overlay = false;
                this.snackbar = true;
                this.text = "User belum memiliki role!";
                this.color = "error";
              }
            } else {
              this.overlay = false;
              this.snackbar = true;
              this.text = "Gagal request ke server!";
              this.color = "error";
            }
          } else {
            // await this.$recaptcha.reset()
            this.overlay = false;
            this.snackbar = true;
            this.text = this.resultLogin.msg;
            this.color = "error";
          }
        } else {
          // await this.$recaptcha.reset()
          this.snackbar = true;
          this.text = "Username dan password harus diisi!";
          this.color = "error";
        }
      } catch (error) {
        // await this.$recaptcha.reset()
        this.overlay = false;
        this.snackbar = true;
        this.text = "Gagal request ke server!";
        this.color = "error";
        console.error(error);
      }
    },
  },
};
</script>