<template>
  <v-card :loading="isLoading">
    <v-row no-gutters>
      <v-col cols="8">
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab key="tabStatus" @click="isDownloadAll = false"
            >Status Pengajuan</v-tab
          >
          <v-tab key="daftarArsip" @click="isDownloadAll = true"
            >Daftar Peminjaman Arsip</v-tab
          >
        </v-tabs>
      </v-col>
      <v-col cols="4" align-self="end" class="text-right">
        <v-btn
          v-if="isDownloadAll"
          small
          color="green"
          class="ma-2 white--text"
          @click="downloadAll()"
        >
          Download All
          <v-icon right dark> mdi-cloud-download </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-tabs-items v-model="tab" v-if="!isLoading">
          <v-tab-item key="tabStatus">
            <v-timeline
              align-top
              :dense="$vuetify.breakpoint.smAndDown"
              class="mx-2"
            >
              <v-timeline-item
                v-for="(item, i) in dataListApproval"
                :key="i"
                :color="item.color"
                :icon="item.icon"
                fill-dot
              >
                <v-card :color="item.color" dark>
                  <v-card-title class="font-weight-bold ma-0 px-4 py-1">
                    {{ item.statusApproval }}
                  </v-card-title>
                  <v-card-text class="white text--primary">
                    Nama: {{ item.namaPetugasAprooval }}<br />
                    Jabatan: {{ item.namaJabatan }}<br />
                    Kode Kantor: {{ item.kodeKantor }}<br />
                    Keterangan: {{ item.keterangan }}<br />
                    Waktu: {{ formatDate(item.tglApproval) }}
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-tab-item>
          <v-tab-item key="daftarArsip">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th scope="col" class="text-left">Form</th>
                    <th scope="col" class="text-center">Download</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dataListDocument" :key="item.name">
                    <td>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <td
                            align="left"
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            class="text-breaks"
                          >
                            {{ item.rincian }}
                          </td>
                        </template>
                        <span>{{ item.rincian }}</span>
                      </v-tooltip>
                    </td>
                    <td class="text-center">
                      <v-btn
                        @click="getPdf(item.idArsip)"
                        icon
                        :color="item.color"
                        :disabled="item.stDownload != 'Y'"
                      >
                        <v-icon>mdi-download-circle</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import helper from "@/helpers/index";
export default {
  name: "PeminjamanStatusView",
  props: {
    idPeminjaman: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      isDownloadAll: false,
      tab: "tabStatus",
      dataListApproval: [],
      dataListDocument: [],
      isLoading: true,
    };
  },
  mounted() {
    this.getStatus();
    this.getDocument();
  },
  async created() {
    if (localStorage.hasOwnProperty("authSikd")) {
      let dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
      this.dataUser = JSON.parse(dataLoginDecrypted);
      console.log(this.dataUser);
      this.kodeKantorRole = this.dataUser.kodeKantorRole;
      // console.log(this.kodeKantorRole)
      if (this.dataUser.kodeUser == 0) {
        this.$router.push({ path: "/login" });
      } else if (!this.dataUser.setRole) {
        this.$router.push({ path: "/role" });
      } else {
        this.kodeUser = "dataUser.kodeUser";
        if (localStorage.hasOwnProperty("authPage")) {
          let dataPage = helper.decrypt(localStorage.authPage);
          let listPage = JSON.parse(dataPage);
          if (listPage.includes(this.$route.path.split("/")[1])) {
            this.getLovListTL();
            this.getLovJenisNaskah();
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
  methods: {
    getLovListTL: async function () {
      // this.overlay = true
      this.$axios
        .get("/master/jenis-tl")
        .then((res) => {
          // this.overlay = false;
          const itemKategoriTL = [
            {
              value: "",
              text: "Semua Kategori Tindak Lanjut",
            },
          ];
          res.data.data.forEach((item) => {
            itemKategoriTL.push({
              value: item.namaTl,
              text: item.namaTl,
            });
          });
          this.itemKategoriTL = itemKategoriTL;
          // console.log(this.itemKategoriTL);
        })
        .catch((err) => {
          console.log(err);
          // this.overlay = false;
        });
    },
    getLovJenisNaskah: async function () {
      // this.overlay = true
      this.$axios
        .get("/master/naskah-jenis")
        .then((res) => {
          // this.overlay = false;
          const itemsJenisNaskah = [
            {
              value: "",
              text: "Semua Jenis Naskah",
            },
          ];
          res.data.data.forEach((item) => {
            itemsJenisNaskah.push({
              value: item.kodeJenisNaskah,
              text: item.namaJenisNaskah,
            });
          });
          this.itemsJenisNaskah = itemsJenisNaskah;
          // console.log(this.itemsJenisNaskah);
        })
        .catch((err) => {
          // this.overlay = false;
          console.log(err);
        });
    },
    downloadAll() {
      console.log("downloadall", this.dataListDocument);
      this.dataListDocument.forEach((item) => {
        if (item.stDownload == "Y") this.getPdf(item.idArsip);
      });
    },
    getPdf: async function (idArsip) {
      try {
        this.overlay = true;
        let { data } = await this.$axios.get("/arsip/download/" + idArsip, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          baseURL: process.env.baseURL2,
          responseType: "blob",
          transformResponse: [],
          params: {
            kodeUser: this.dataUser.kodeUser,
            kodeKantor: this.kodeKantorRole,
            npk: this.dataUser.npk,
            kodeRole: this.dataUser.kodeRole,
          },
        });
        var url = await URL.createObjectURL(
          new Blob([data], { type: data.type })
        );
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.$swal("Error", "Gagal request ke server!", "error");
        console.log(error.message.toString());
      }
    },

    formatDate(val) {
      console.log(this.$moment(val).isValid());
      return this.$moment(val).isValid()
        ? this.$moment(val).format("DD-MM-YYYY")
        : "";
    },
    getStatus() {
      const itemData = [];
      console.log(this.idPeminjaman);
      this.isLoading = true;
      this.$axios
        .get(
          "/arsip/" + this.idPeminjaman + "/getDataAproovalPeminjamanArsip",
          {
            params: {},
          }
        )
        .then((res) => {
          console.log(res.data.data);
          res.data.data.forEach((item) => {
            itemData.push({
              color:
                item.stApproval == "Y"
                  ? "green lighten-1"
                  : item.stApproval == "T"
                  ? "red"
                  : "grey",
              icon:
                item.stApproval == "Y"
                  ? "mdi-check-bold"
                  : item.stApproval == "T"
                  ? "mdi-close-octagon"
                  : "mdi-timer-sand",
              statusApproval:
                item.stApproval == "Y"
                  ? "DISETUJUI"
                  : item.stApproval == "T"
                  ? "DITOLAK"
                  : "MENUNGGU PERSETUJUAN",
              ...item,
            });
          });
          this.isLoading = false;
          this.dataListApproval = itemData;
          // console.log(dataListApproval)
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    truncate(input) {
      console.log("input", input);
      if (input != null) {
        if (input.length > 5) {
          return input.substring(0, 50) + "...";
        }
      } else {
        return input;
      }
    },
    getDocument() {
      const itemDocument = [];
      console.log(this.idPeminjaman);
      this.isLoading = true;
      this.$axios
        .get("/arsip/" + this.idPeminjaman + "/getListPeminjamanArsip", {
          params: {},
        })
        .then((res) => {
          console.log("dokumen", res.data.data);
          res.data.data.forEach((item, i) => {
            console.log("testt itemmm", item);
            item.noSurat =
              item.kodeJenisArsip == "A00000001" ||
              item.kodeJenisArsip == "A00000002" ||
              item.kodeJenisArsip == "A00000003" ||
              item.kodeJenisArsip == "A00000004"
                ? JSON.parse(item.formData).KODE_TRANSAKSI_VOUCHER == null
                  ? JSON.parse(item.formData).KODE_TRANSAKSI_VOUCHER
                  : "-"
                : item.kodeJenisArsip == "N00000001"
                ? JSON.parse(item.formData).NO_SURAT
                : "-";
            item.perihal = JSON.parse(item.formData).PERIHAL;
            let tempData = Object.keys(JSON.parse(item.formData));
            let rincian = [];
            tempData.forEach((idx, i) => {
              if (i == 0) {
                rincian.push(
                  idx.replace(/_/g, " ") +
                    " : " +
                    (JSON.parse(item.formData)[idx] == null ||
                    JSON.parse(item.formData)[idx] == ""
                      ? "-"
                      : JSON.parse(item.formData)[idx])
                );
              } else {
                rincian.push(
                  "\n " +
                    idx.replace(/_/g, " ") +
                    " : " +
                    (JSON.parse(item.formData)[idx] == null ||
                    JSON.parse(item.formData)[idx] == ""
                      ? "-"
                      : JSON.parse(item.formData)[idx])
                );
              }
            });
            console.log("adwadwas", rincian);
            item.rincian = rincian.toString();
            itemDocument.push({
              color: item.stDownload == "Y" ? "green lighten-1" : "grey",
              no: i + 1,
              ...item,
            });
          });
          this.isLoading = false;
          this.dataListDocument = itemDocument;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
<style scoped>
.text-breaks {
  white-space: pre-line;
}
</style>
