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
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <naskahjenis></naskahjenis>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <inisial></inisial>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <klasifikasi></klasifikasi>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <klasifikasiPokokMasalah></klasifikasiPokokMasalah>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <klasifikasiJenis></klasifikasiJenis>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <templatenaskah></templatenaskah>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupatribut></setupatribut>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupmenu></setupmenu>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <rolemenu></rolemenu>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <tindaklanjutNaskah></tindaklanjutNaskah>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupArsipJenis></setupArsipJenis>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupArsipPointer></setupArsipPointer>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupArsipUserSign></setupArsipUserSign>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card text>
                  <v-card-text class="pa-0">
                    <setupPenugasanSekretaris
                      :kode-user="kodeUser"
                    ></setupPenugasanSekretaris>
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
import inisial from "~/components/setupInisial.vue";
import naskahjenis from "~/components/setupNaskahJenis.vue";
import klasifikasi from "~/components/setupKodeKlasifikasi.vue";
import klasifikasiPokokMasalah from "~/components/setupKlasifikasiPokokMasalah.vue";
import klasifikasiJenis from "~/components/setupKlasifikasiJenis.vue";
import templatenaskah from "~/components/setupTemplateNaskah.vue";
import setupatribut from "~/components/setupAtribut.vue";
import setupmenu from "~/components/setupMenu.vue";
import rolemenu from "~/components/setupRoleMenu.vue";
import tindaklanjutNaskah from "~/components/setupTindakLanjutNaskah.vue";
import setupArsipJenis from "~/components/setupArsipJenis.vue";
import setupArsipPointer from "~/components/setupArsipPointer.vue";
import setupArsipUserSign from "~/components/setupArsipUserSign.vue";
import setupPenugasanSekretaris from "~/components/setupPenugasanSekretaris.vue";

import helper from "@/helpers/index";

export default {
  data() {
    return {
      items: [
        "Jenis Naskah",
        "Inisial",
        "Klasifikasi",
        "Klasifikasi Pokok Masalah",
        "Klasifikasi Jenis",
        "Template Naskah",
        "Atribut",
        "Menu",
        "Role Menu",
        "Tindak Lanjut Naskah",
        "Jenis Arsip",
        "Pointer Arsip",
        "User Sign Arsip",
        "Penugasan Sekretaris",
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
    inisial,
    naskahjenis,
    klasifikasi,
    klasifikasiPokokMasalah,
    klasifikasiJenis,
    templatenaskah,
    setupatribut,
    setupmenu,
    rolemenu,
    tindaklanjutNaskah,
    setupArsipJenis,
    setupArsipPointer,
    setupArsipUserSign,
    setupPenugasanSekretaris,
  },
};
</script>
