<template>
  <v-layout column justify-center align-center>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm12 md12>
          <v-card>
            <v-tabs v-model="tabs" dark>
              <v-tab v-for="n in items.length" :key="n">{{
                items[n - 1]
              }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabs">
              <!-- <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <naskahjenis></naskahjenis>
                  </v-card-text>
                </v-card>
              </v-tab-item> -->
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <cutoffNaskahDinas></cutoffNaskahDinas>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import cutoffNaskahDinas from "~/components/cutoffNaskahDinas.vue";

import helper from "@/helpers/index";

export default {
  data() {
    return {
      items: [
        "Naskah Dinas"
      ],
      tabs: null,
      kodeUser: null,
    };
  },
  created: async function () {
    if (localStorage.hasOwnProperty("authSikd")) {
      var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      var dataUser = JSON.parse(dataLoginDecrypted);
      if (dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        if (localStorage.hasOwnProperty("authPage")) {
        //   var dataPage = helper.decrypt(localStorage.authPage);
        //   var listPage = JSON.parse(dataPage);
        //   if (listPage.includes(this.$route.path.split("/")[1])) {
        //console.log()
          this.kodeUser = dataUser.kodeUser;
        //   } else {
        //     this.$router.push({ path: "/error" });
        //   }
        } else {
           this.$router.push({ path: "/error" });
        }
      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  components: {
    // inisial,
    cutoffNaskahDinas
  },
};
</script>
