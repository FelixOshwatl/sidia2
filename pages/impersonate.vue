<style lang="scss" scoped>
.elevation-1 {
  text-align: center;
}
thead {
  background: #e7e7e7;
}
</style>
<template>
  <v-layout column justify-center align-center>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm12 md12>
          <v-layout wrap>
            <v-flex xs12 sm3 md3>
              <v-text-field
                :rules="requiredRules"
                v-model="npk"
                label="NPK"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 md3>
              <v-text-field
                :rules="requiredRules"
                v-model="kodeKantor"
                label="Kode Kantor"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 md3>
              <v-text-field v-model="kodeRole" label="Kode Role"></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm3 md3>
          <v-btn :disabled="!formIsValid" color="primary" left @click="setuser"
            >IMPERSONATE</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>
    <v-overlay :value="overlay" :opacity="0.5" :z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
import helper from "@/helpers/index";

export default {
  data() {
    return {
      overlay: false,
      snackbar: false,
      text: "",
      color: "error",
      npk: "",
      kodeKantor: "",
      kodeRole: "",
      requiredRules: [(v) => !!v || "Kolom ini harus diisi"],
      resultUser: [],
    };
  },
  components: {},
  computed: {
    formIsValid() {
      return this.npk && this.kodeKantor;
    },
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
        this.resultUser = dataUser;
      }
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  watch: {},
  methods: {
    setuser: async function () {
      this.resultUser.npk = this.npk;
      this.resultUser.kodeKantor = this.kodeKantor;
      this.resultUser.kodeKantorRole = this.kodeKantor;
      if (this.kodeRole != "") {
        this.resultUser.kodeRole = this.kodeRole;
      }
      console.log(JSON.stringify(this.resultUser));
      var dataLogin = await helper.encrypt(JSON.stringify(this.resultUser));
      sessionStorage.setItem("authSikd", dataLogin); //set sessionStorage dataLogin user
      this.$swal("", "Impersonate: " + this.npk, "success");
    },
  },
};
</script>
