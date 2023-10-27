<template>
  <div>
    <!-- Tombol untuk membuka dialog -->
    <!-- <v-btn :disabled="dialog" :loading="dialog" class="white--text" color="purple darken-2" @click="dialog = true"
      style="position: absolute; right: 100px; bottom: 20px;">
      Start loading
    </v-btn> -->
    <v-btn @click="expand = !expand" class="fixed ml-0 mr-10 shrink rounded-lg rounded-b-0">tes card</v-btn>
    <!-- Dialog Vuetify -->
    <!-- <v-dialog class="fixed" v-model="dialog" hide-overlay> -->
    <v-expand-transition>
      <v-card class="fixed ml-0 mr-10 shrink rounded-lg rounded-b-0" v-show="expand" width="400" v-model="dialog">
        <div class="bg-grey d-flex" style="background-color: grey;">
          <v-row class="d-flex justify-space-between align-center mb-5 mt-5 mr-3">
            <v-row class="d-flex justify-start ml-4" style="color: white;">mengunggah 3 item</v-row>
            <v-button><v-icon class="mr-2 " @click="expand = !expand"
                style="color: white;">mdi-chevron-down</v-icon></v-button>
            <v-button><v-icon style="color: white;">mdi-close</v-icon></v-button>
          </v-row>
        </div>
        <v-row class="d-flex justify-space-between mb-6 mt-4 mr-3">
          <v-row class="d-flex justify-start ml-3 mt-1 ml-4">
            <v-icon class="mb-3">mdi-image</v-icon>surat laporan.png
          </v-row>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
        <v-divider></v-divider>
        <v-row class="d-flex justify-space-between mb-6 mt-4 mr-3">
          <v-row class="d-flex justify-start ml-3 mt-1 ml-4">
            <v-icon class="mb-3">mdi-image</v-icon>surat masuk.png
          </v-row>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-expand-transition>
    <!-- </v-dialog> -->
  </div>
</template>

<script>
export default {
  data: () => ({
    expand: false,
  }),
}

</script>

<style scoped>
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
