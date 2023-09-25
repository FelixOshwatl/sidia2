<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
      dark
      color="#3e4859"
    >
      <v-list nav dense>
        <v-list-item class="pb-3">
          <v-list-item-title>
            <img alt="logo" src="/sidialogo_v3.png" style="width: 95%" />
            <br />
            <small style="font-weight: 600">{{ namaUser }}</small>
            <br />
            <small>{{ namaRole }}</small>
          </v-list-item-title>
        </v-list-item>
        <v-divider class="mb-1" />
        <!-- <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          dense
        >

          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

          <v-badge
           v-if="item.badges>0"
           class="mr-5"
           color="success"
           overlap
           :content="item.badges"
          >
          </v-badge>
        </v-list-item> -->
        <template v-for="item of items">
          <template v-if="item.jenis == 'ITEM'">
            <v-list-item :key="item.title" :to="item.to" router exact dense>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>

              <v-badge
                v-if="item.badges > 0"
                class="mr-5"
                color="success"
                overlap
                :content="item.badges"
              >
              </v-badge>
            </v-list-item>
          </template>
          <template v-if="item.jenis == 'GROUP'">
            <v-list-group
              :value="false"
              :key="item.title"
              no-action
              color="white"
            >
              <template v-slot:activator>
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
                <v-badge
                  v-if="item.badges > 0"
                  color="success"
                  overlap
                  :content="item.badges"
                >
                </v-badge>
              </template>
              <template v-for="item2 of itemsLvl2">
                <v-list-item
                  v-if="item2.kodeGroup == item.kodeMenu"
                  :key="item2.title"
                  :to="item2.to"
                  @click="localstorage(item2.to)"
                  router
                  exact
                  dense
                >
                  <!-- <v-list-item-action>
                      <v-icon>{{ item2.icon }}</v-icon>
                    </v-list-item-action> -->
                  <v-list-item-content>
                    <v-list-item-title v-text="item2.title" />
                  </v-list-item-content>

                  <v-badge
                    v-if="item2.badges > 0"
                    class="mr-5"
                    color="success"
                    overlap
                    :content="item2.badges"
                  >
                  </v-badge>
                </v-list-item>
              </template>
            </v-list-group>
          </template>
        </template>
      </v-list>
      <template v-slot:append>
        <p class="mb-0">
          <v-footer>
            <small>&copy; 2021 PTI BPJS Ketenagakerjaan</small>
          </v-footer>
        </p>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      dense
      :collapse="!collapseOnScroll"
      :collapse-on-scroll="collapseOnScroll"
      app
      class="green white--text"
    >
      <v-app-bar-nav-icon class="white--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <!--
        [remainder] fitur HELP

        <v-menu rounded transition="slide-y-reverse-transition" style="display:none;">
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click="viewHelp" style="display:none;">
            <v-icon color="white">mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <v-card class="my-0 mx-0" width="270" max-width="270">
          <v-overlay :value="loading">
            <v-progress-circular indeterminate size="39"></v-progress-circular>
          </v-overlay>
          <v-dialog
            color="#4CAF50"
            v-model="dialogDetil"
            width="700"
            scrollable
            persistent
          >
            <v-card>
              <v-card-title class="text-h5 success">
                <v-row>
                  <v-col class="white--text text--lighten-1">Help</v-col>
                  <v-col class="text-right"
                    ><v-btn
                      type="button"
                      text-right
                      icon
                      @click="detilClose"
                      color="default"
                      ><v-icon>mdi-close</v-icon></v-btn
                    ></v-col
                  >
                </v-row>
              </v-card-title>
              <v-card-text v-if="result">
                <div style="white-space: pre-line">
                  <v-carousel
                    v-model="caroselModel"
                    height="100%"
                    hide-delimiters
                    :show-arrows="false"
                  >
                    <v-carousel-item v-for="(item, i) in result" :key="i">
                      <v-sheet height="100%">
                        <iframe
                          width="650"
                          height="500"
                          :src="item.content"
                          frameborder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                        ></iframe>
                      </v-sheet>
                    </v-carousel-item>
                  </v-carousel>
                  <div class="d-flex justify-space-around align-center py-4">
                    <v-btn
                      variant="text"
                      icon
                      @click="caroselModel = Math.max(caroselModel - 1, 0)"
                      :disabled="caroselModel == 0"
                      ><v-icon>mdi-chevron-left</v-icon></v-btn
                    >
                    <v-btn
                      variant="text"
                      icon
                      @click="caroselModel = Math.min(caroselModel + 1, 4)"
                      :disabled="caroselModel == result.length - 1"
                      ><v-icon>mdi-chevron-right</v-icon></v-btn
                    >
                  </div>
                </div>
              </v-card-text>
              <v-card-text v-else>
                <div style="white-space: pre-line">
                  <div class="text-h5 font-weight-black text-center">
                    Content Belum Tersedia
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-menu> -->
      <v-menu rounded offset-y transition="slide-y-transition" v-if="showMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="white">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense @click="gantirole">
            <v-list-item-icon>
              <v-icon color="blue">mdi-account-convert-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title style="font-weight: unset"
              >Ganti Role</v-list-item-title
            >
          </v-list-item>
          <!-- <v-list-item @click="getNotif">
            <v-list-item-title>tes</v-list-item-title>
          </v-list-item> -->
          <v-list-item dense @click="logout">
            <v-list-item-icon>
              <v-icon color="blue">mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title style="font-weight: unset"
              >Logout</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>-->
    </v-app-bar>
    <v-main style="background-color: #f8f9fe">
      <!-- <v-container> -->
      <nuxt />
      <!-- </v-container> -->
      <v-snackbar multi-line v-model="snackbar">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <!-- <v-footer :absolute="!fixed" app>
      <span style="font-size: 12px">
        PTI - BPJS Ketenagakerjaan &copy; 2021
      </span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { EventBus } from "@/eventBus.js";
import helper from "@/helpers/index";

export default {
  name: "layoutMenu",
  data() {
    return {
      kodeKantor: "",
      youtubeURL: "",
      result: [],
      caroselModel: 0,
      getUpdated: null,
      namaUser: "",
      namaRole: "",
      kodeRole: "",
      kodeUser: "",
      clipped: false,
      drawer: true,
      fixed: false,
      items: [],
      itemsPage: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      collapseOnScroll: true,
      getValue: 0,
      title: "",
      npk: "",
      polling: null,
      snackbar: false,
      snackbarText: "",
      showMenu: false,
      kodeKantorIndukRole: "",
      itemsAll: [],
      itemsHistory: [],
      dialog: false,
      dialogDetil: false,
      page: 1,
      perPage: 4,
      detil: [],
      viewForm: {
        id: 0,
        title: "",
        dataItems: [],
      },
      loading: false,
      overLay: false,
      userData: {},
    };
  },
  watch: {
    kodeRole(newVal) {
      if (newVal != null && this.npk != null && this.npk != "") {
        this.getMenu(newVal);
      } else {
        //do nothing
      }
    },
  },
  mounted() {
    EventBus.$on("updateNotifBadgesEvent", () => {
      if (this.npk != null && this.npk != "") {
        this.getMenu(this.kodeRole);
      } else {
        //do nothing
      }
    });
  },
  created: async function () {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      this.kodeRole = dataUser.kodeRole;
      this.kodeUser = dataUser.kodeUser;
      this.npk = dataUser.npk;
      this.kodeKantor = dataUser.kodeKantorRole;
      // console.log(this.dataUser,'sssss')
      this.kodeKantorIndukRole = dataUser.kodeKantorIndukRole;
      if (this.kodeUser == 0) {
        this.showMenu = false;
      } else if (!dataUser.setRole) {
        this.showMenu = false;
      } else {
        this.pollData();
        this.namaUser = dataUser.namaUser;
        this.namaRole = dataUser.namaRole;
        this.showMenu = true;
        // fitur help this.getContentHelp();
        console.log(this.result);
      }
      // this.startInterval();
    } else {
      this.showMenu = false;
      clearInterval(this.polling);
    }
  },
  methods: {
    pollData() {
      this.polling = setInterval(() => {
        this.getNotif();
      }, 240000);
    },
    /* fitur help
    async getContentHelp() {
      this.$axios
        .get("help/faq-all", {
          params: {},
        })
        .then((res) => {
          this.isLoaded = true;
          this.result = res.data.data;
          //this.rows = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    }, */
    localstorage: async function (route) {
      // console.log("getRecent",route)
      this.$router.push({ path: route });
      sessionStorage.setItem("recentPage", route);
    },
    getMenu: async function (koderole) {
      this.items = [];
      this.itemsLvl2 = [];
      try {
        if (localStorage.hasOwnProperty("authSikd")) {
          let { data } = await this.$axios.get("/master/sidia-menu", {
            params: {
              koderole: koderole,
              npk: this.npk,
              kodeKantor: this.kodeKantor,
            },
          });
          // console.log(data.data, "xxxxx")
          for (let index = 0; index < data.data.length; index++) {
            if (data.data[index].level == "1") {
              this.items.push({
                kodeMenu: data.data[index].kodeMenu,
                icon: data.data[index].icon,
                title: data.data[index].namaMenu,
                to: data.data[index].page,
                badges: data.data[index].vBadges,
                stNotif: data.data[index].stNotif,
                notifQuery: data.data[index].notifQuery,
                jenis: data.data[index].jenis,
                level: data.data[index].level,
                kodeGroup: data.data[index].kodeGroup,
                listSubmenu: this.itemsLvl2,
              });
            } else if (data.data[index].level == "2") {
              this.itemsLvl2.push({
                kodeMenu: data.data[index].kodeMenu,
                icon: data.data[index].icon,
                title: data.data[index].namaMenu,
                to: data.data[index].page,
                badges: data.data[index].vBadges,
                stNotif: data.data[index].stNotif,
                notifQuery: data.data[index].notifQuery,
                jenis: data.data[index].jenis,
                level: data.data[index].level,
                kodeGroup: data.data[index].kodeGroup,
              });
            }
          }
          console.log(this.itemsLvl2);
          this.getNotif();
        } else {
          clearInterval(this.polling);
        }
      } catch (error) {
        console.error("error getMenu: " + error);
        //this.$swal("Error", "Gagal request ke server!", "error");
      }
    },
    // startInterval(){
    //   setInterval(()=>{
    //     console.log('aaaaaa')
    //     this.getNotif()
    //   },240000)
    //   //get menu called for 4 minutes
    // },
    logout: async function () {
      await this.$axios.post("/logout", { username: this.kodeUser });
      sessionStorage.clear();
      localStorage.clear();
      localStorage.msgLogout = "Akun anda telah berhasil keluar.";
      localStorage.msgColor = "success";
      clearInterval(this.polling);
      this.$router.push({ path: "/login" });
      // sentry id
      this.$sentry.configureScope((scope) => scope.setUser(null));
    },
    getNotif: async function () {
      if (localStorage.hasOwnProperty("authSikd")) {
        for (var i in this.items) {
          if (this.items[i].stNotif == "Y") {
            try {
              let { data } = await this.$axios.get("/master/sidia-menu-notif", {
                params: {
                  koderole: this.kodeRole,
                  npk: this.npk,
                  kodeKantor: this.kodeKantor,
                  kodeMenu: this.items[i].kodeMenu,
                  notifQuery: this.items[i].notifQuery,
                  kodeKantorIndukRole: this.kodeKantorIndukRole,
                },
              });
              this.items[i].badges = data.data[0].jml;
            } catch (error) {
              console.error("error getNotif: " + error);
            }
            // break; //Stop this loop, we found it!
          }
        }
        for (var i in this.itemsLvl2) {
          if (this.itemsLvl2[i].stNotif == "Y") {
            try {
              let { data } = await this.$axios.get("/master/sidia-menu-notif", {
                params: {
                  koderole: this.kodeRole,
                  npk: this.npk,
                  kodeKantor: this.kodeKantor,
                  kodeMenu: this.itemsLvl2[i].kodeMenu,
                  notifQuery: this.itemsLvl2[i].notifQuery,
                },
              });
              this.itemsLvl2[i].badges = data.data[0].jml;
            } catch (error) {
              console.error("error getNotif: " + error);
            }
            // break; //Stop this loop, we found it!
          }
        }
        let a = this.items.filter(
          (item, index) => item.kodeMenu == "a24dba63-0"
        );
      } else {
        clearInterval(this.polling);
      }
    },
    gantirole: async function () {
      // this.beforeDestroy()
      if (localStorage.hasOwnProperty("authSikd")) {
        var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
        var dataUser = JSON.parse(dataLoginDecrypted);
        this.npk = dataUser.npk;
        if (dataUser.kodeUser == 0) {
          this.$router.push({ path: "/login" });
        } else {
          let dataTest = {
            kodeUser: dataUser.kodeUser,
            namaUser: dataUser.namaUser,
            npk: dataUser.npk,
            kodeKantor: dataUser.kodeKantor,
            email: dataUser.email,
            setRole: false,
            token: dataUser.token,
          };
          var dataLogin = await helper.encrypt(JSON.stringify(dataTest));
          localStorage.setItem("authSikd", dataLogin);
          // clearInterval(
          //   setInterval(()=>{
          //     this.getNotif()
          //   },240000)
          // );
          this.$router.push({ path: "/role" });
        }
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    async viewHelp() {
      this.dialogDetil = true;
    },
    detilClose() {
      this.dialogDetil = false;
    },
  },
  beforeDestroy() {
    console.log("destroy");
    clearInterval(this.polling);
  },
};
</script>


<style>
@import "~/node_modules/@syncfusion/ej2-base/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-lists/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-vue-documenteditor/styles/material.css";
</style>
