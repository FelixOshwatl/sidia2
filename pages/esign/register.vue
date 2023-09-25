<template>
  <v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-breadcrumbs large :items="breadcrumbItems">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :href="item.href"
              >
                {{ item.text.toUpperCase() }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="pa-5">
              <v-form ref="form" v-model="valid" :lazy-validation="false">
                <v-row>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-text-field
                      outlined
                      @input="ruleNpk=[]"
                      :rules="ruleNpk?ruleNpk:required"
                      v-model="nip"
                      dense
                      v-mask="'#########'"
                      label="NPK"
                      :disabled="checkNpk"
                      :loading="checkNpk"
                      :append-icon="nip.length===9?'mdi-magnify':''"
                      @click:append="cekNpk"
                    ></v-text-field>
                    <v-text-field
                      readonly
                      outlined
                      v-model="nama"
                      dense
                      label="Nama"
                    ></v-text-field>
                    <v-text-field
                      readonly
                      outlined
                      v-model="jabatan"
                      dense
                      label="Jabatan"
                    ></v-text-field>
                    <v-text-field
                      readonly
                      outlined
                      v-model="unitKerja"
                      dense
                      label="Unit Kerja"
                    ></v-text-field>
                    <v-text-field
                      v-mask="'#############'"
                      outlined
                      :rules="required"
                      v-model="nomorTelepon"
                      dense
                      label="HP"
                    ></v-text-field>
                    <v-text-field
                      maxlength="100"
                      outlined
                      :rules="emailRules"
                      v-model="email"
                      dense
                      label="E-mail"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-text-field
                      v-mask="'################'"
                      outlined
                      :rules="required"
                      v-model="nik"
                      dense
                      label="NIK"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      :rules="required"
                      v-model="kota"
                      dense
                      label="Kota"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      :rules="required"
                      v-model="provinsi"
                      dense
                      label="Provinsi"
                    ></v-text-field>
                    <v-file-input
                      outlined
                      @change="change2"
                      :rules="fileRules"
                      dense
                      label="KTP"
                      accept=".jpg,.jpeg,.png"
                      show-size
                      prepend-icon="mdi-file-document"
                    ></v-file-input>
                    <v-file-input
                      outlined
                      @change="change3"
                      :rules="fileRules"
                      dense
                      label="Surat Rekomendasi"
                      accept=".pdf"
                      show-size
                      prepend-icon="mdi-file-document"
                    ></v-file-input>
                    <v-file-input
                      outlined
                      @change="change1"
                      :rules="imageTtdBase64?[]:fileRules"
                      dense
                      label="Image TTD"
                      accept=".jpg,.jpeg,.png"
                      show-size
                      prepend-icon="mdi-file-document"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-5">
              <v-spacer />
              <v-btn color="success darken-1" :disabled="!valid" @click="submit"
                >Registrasi</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>


<script>
import Vue from 'vue'
import VueMask from 'v-mask'
Vue.use(VueMask)
import pdf from "vue-pdf-signature";
import helper from "@/helpers/index";

export default {
  components: { pdf },
  data() {
    return {
      valid: false,
      checkNpk: false,
      fileRules: [
        (v) => !!v || "File is required",
        (file) =>
          (file && file.size < 2 * 1024 * 1024) || "File size should be less than 2 MB!",
      ],
      ruleNpk:[],
      required: [(v) => !!v || "Field is required"],
      emailRules: [
        (v) => {
          if (!v) {
            return "Email is required";
          } else {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              (pattern.test(v) && v.includes("@bpjsketenagakerjaan.go.id")) ||
              "Email is not valid"
            );
          }
        },
      ],
      breadcrumbItems: [
        {
          text: "E-sign",
          disabled: false,
          href: "/esign/",
        },
        {
          text: "Registrasi",
          disabled: true,
          href: "",
        },
      ],
      nik: "",
      nip: "",
      nama: "",
      email: "",
      nomorTelepon: "",
      kota: "",
      provinsi: "",
      jabatan: "",
      unitKerja: "",
      unitKantor: "",
      imageTtdBase64: null,
      ktpBase64: null,
      suratRekomendasiBase64: null,
      overlay:false
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
          var dataPage = helper.decrypt(localStorage.authPage);
          var listPage = JSON.parse(dataPage);
          if (true) {
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
    change1(file) {
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          self.imageTtdBase64 = reader.result;
        },
        false
      );
      if (file) reader.readAsDataURL(file);
    },
    change2(file) {
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          self.ktpBase64 = reader.result;
        },
        false
      );
      if (file) reader.readAsDataURL(file);
    },
    change3(file) {
      const self = this;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          self.suratRekomendasiBase64 = reader.result;
        },
        false
      );
      if (file) reader.readAsDataURL(file);
    },
    async cekNpk() {
      this.checkNpk = true;
      let result = await this.$axios.get("/esign/npk/", { params: { npk:this.nip} } );
      let resultNpk = result.data;
      // console.log(this.resultNpk);
      if (resultNpk.ret == 0 && resultNpk.data != undefined) {
        // console.log(resultNpk);
        this.ruleNpk=[]
        this.nama = resultNpk.data.namaPegawai;
        this.jabatan = resultNpk.data.namaJobtitle;
        this.unitKerja = resultNpk.data.namaUnit;
        this.unitKantor = resultNpk.data.unitKantor;
        this.checkNpk = false;
        await this.$axios
            .get("/esign/image",
            { 
              params: { npk:this.nip, pps: this.inPps } , 
              responseType: "arraybuffer" 
            })
            .then((response) => {
              let b64 = Buffer.from(response.data, "binary").toString("base64");
              this.imageTtdBase64 = b64;
              console.log("Image TTD Data ditemukan");
            })
            .catch((error) => {
              console.error(error);
              this.$swal("Error", "Data TTD tidak ditemukan!", "error");
            });
        return;
      } else {
        this.ruleNpk=["NPK is not valid"]
        this.nama = null;
        this.jabatan = null;
        this.unitKerja = null;
        this.unitKantor = null;
        this.imageTtdBase64=null;
        this.checkNpk = false;
        return;
      }
    },
    async submit() {
      this.overlay = true;
      const reqBody = {
        nik: this.nik,
        nip: this.nip,
        nama: this.nama,
        email: this.email,
        nomorTelepon: this.nomorTelepon,
        kota: this.kota,
        provinsi: this.provinsi,
        jabatan: this.jabatan,
        unitKerja: this.unitKantor,
        ktpBase64: this.ktpBase64,
        suratRekomendasiBase64: this.suratRekomendasiBase64,
        imageTtdBase64: this.imageTtdBase64,
      };
      this.$axios({
        url: "/esign/register",
        method: "POST",
        data: reqBody,
      })
        .then((response) => {
          this.overlay = false;
          this.$swal(
            "",
            "Registrasi Tandatangan Elektronik berhasil.<br> Mohon cek e-mail Anda untuk instruksi selanjutnya.",
            "success"
          );
        })
        .catch((error) => {
          this.overlay = false;
          if (error.response) {
            this.$swal("Galat", error.response.data.error, "error");
          } else {
            this.$swal(
              "Galat",
              "Registrasi Tandatangan Elektronik gagal!",
              "error"
            );
          }
        });
    },
  },
};
</script>