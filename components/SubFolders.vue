<template>
  <v-col style="margin: ;">
    <v-divider></v-divider>
    <v-col>
      <v-row class="d-flex justify-space-between folder" style="margin: 10px;" v-for="folder in folders"
        @click="toggleFolder(folder.subfolders)">
        <v-col class="d-flex align-center">
          <v-icon>mdi-folder</v-icon>
          <p class="ma-0">{{ folder.name }}</p>
        </v-col>
        <v-col align="center">{{ folder.dateModified }}</v-col>
        <v-col align="right">{{ folder.size }}</v-col>
      </v-row>
      <v-divider v-if="index === folders.length - 1"></v-divider>
    </v-col>

    <!-- <v-row class="d-flex justify-space-between folder" style="margin: 10px;" v-for="folder in folders"
      v-if="folder.showSubfolders" @click="navigateToFolder(folder.id)">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">{{ subfolder.name }}</p>
      </v-col>
      <v-col align="center">{{ subfolder.dateModified }}</v-col>
      <v-col align="right">{{ subfolder.size }}</v-col>
    </v-row> -->
  </v-col>
</template>
<script>
export default {
  props: {
    folders: { type: Object },
  },
  methods: {
    toggleFolder(folder) {
      console.log(folder)
      this.$emit('getFolder', folder)
    }
  }
}
</script>


