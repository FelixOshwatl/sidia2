<template>
  <v-col style="margin: ;">
    <v-btn @click="goBack" class="mb-5" small outlined>
      <v-icon small>mdi-arrow-left</v-icon>
    </v-btn>
    <v-row style="color: grey;" class="mb-3">
      <v-col class="ml-10">
        Nama
      </v-col>
      <v-col align="center" class="ml-2">
        <span>Tanggal Diubah</span>
      </v-col>
      <v-col align="right" class="mr-10">
        Size
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-col v-if="folders.length">
      <v-col v-for="folder in folders" @click="toggleFolder(folder.subfolders)">
        <v-row class="d-flex justify-space-between folder" style="margin: 10px;">
          <v-col class="d-flex align-center">
            <v-icon class="mr-2">mdi-folder</v-icon>
            <p class="ma-0">{{ folder.name }}</p>
          </v-col>
          <v-col align="center">{{ folder.dateModified }}</v-col>
          <v-col align="right">{{ folder.size }}</v-col>
        </v-row>
        <v-divider></v-divider>
      </v-col>
    </v-col>
    <v-col v-else>
      <p>kosong</p>
    </v-col>
  </v-col>
</template>
<script>
export default {
  props: {
    folders: { type: Object },
  },

  data() {
    return {
      folders: [],
      folderHistory: [],
    };
  },
  methods: {
    toggleFolder(folder) {
      this.folderHistory.push(this.folders); // Mengganti this.folders menjadi folder
      if (folder.length > 0) {
        this.$emit('getFolder', folder);
      } else {
        // Folder is empty, you can choose to navigate and show an empty page or display a message
        this.$emit('getFolder', []);
      }
    },
    goBack() {
      if (this.folderHistory.length > 0) {
        const previousFolder = this.folderHistory.pop();
        this.$emit('getFolder', previousFolder);
      }
    },
  }
}
</script>


