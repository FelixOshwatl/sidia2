<template>
  <v-container>
    <v-flex xs12 sm12 md12>
      <v-layout wrap>
        <v-flex xs12 sm12 md12>
          <v-breadcrumbs large :items="breadcrumbItems">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="item.href">
                {{ item.text.toUpperCase() }}
              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </v-flex>
        <v-row v-if="!isCreated">
          <v-col cols="12">
            <v-skeleton-loader type="table-thead@2" />
          </v-col>
        </v-row>
        <v-flex
          xs12
          sm4
          md3
          v-for="item in resultList"
          :key="item.kodeJenisNaskah"
          v-if="item.role ? item.role.includes(kodeRole) : true"
          v-show="isCreated"
          class="px-3 py-3"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 10 : 2"
              :class="{ 'on-hover': hover }"
              class="mx-auto"
              :to="'/new/' + item.kodeJenisNaskah"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-note-text-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    item.namaJenisNaskah
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-container>
</template>

<script>
import helper from "@/helpers/index";

export default {
  data() {
    return {
      resultList: [],
      kodeRole: "",
      isCreated: false,
      breadcrumbItems: [
        {
          text: "Pembuatan Naskah",
          disabled: false,
          href: "",
        },
      ],
    };
  },
  components: {},
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
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if (listPage.includes("new")) {
            this.kodeRole = dataUser.kodeRole;
            let { data } = await this.$axios.get("/master/naskah-jenis2");
            this.resultList = data.data;
            
            let kantor = await this.$axios.get("/master/kantor/"+dataUser.kodeKantorRole);
            if (!kantor.data || !kantor.data.data) {
              return this.$swal("", dataUser.kodeKantorRole+ ' alamat kantor tidak ditemukan!', "error");
            }
            if (kantor.data.data[0].kodeKantorInduk!='P') {
              this.resultList = this.resultList.filter(item => item.kodeJenisNaskah!='NKH0002')
            }
            this.isCreated = true;
          } else {
            this.$router.push({ path: "/error" });
          }
        } else {
          this.$router.push({ path: "/error" });
        }
      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.7;
}
</style>