<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-select v-model="select1" :rules="select1Rules" required :items="items" label="filter"
          style="margin-left: 20px;" dense outlined>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <p class="font-weight-black" style="font-size: 1.25rem; margin-left: 30px;">
        Alih Media
      </p>
    </v-row>
    <sub-folders :folders="subItem" @getFolder="toggleFolder"></sub-folders>
    <v-btn :disabled="dialog" :loading="dialog" class="white--text" color="purple darken-2" @click="dialog = true">
      Start loading
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="500px" style="position: absolute; right: 100px; bottom: 20px;">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

  <!-- <v-col style="margin: 20px;">

    <v-row class="d-flex justify-space-between folder" style="margin: 10px;" v-for="folder in folders"
      @click="toggleFolder(folder)">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">{{ folder.name }}</p>
      </v-col>
      <v-col align="center">{{ folder.dateModified }}</v-col>
      <v-col align="right">{{ folder.size }}</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="d-flex justify-space-between folder" style="margin: 10px;" v-for="folder in folders"
      v-if="folder.showSubfolders" @click="navigateToFolder(folder.id)">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">{{ subfolder.name }}</p>
      </v-col>
      <v-col align="center">{{ subfolder.dateModified }}</v-col>
      <v-col align="right">{{ subfolder.size }}</v-col>
    </v-row>
  </v-col> -->
</template>

<script>
export default {
  data: () => ({
    dialog: false,

    items: [
      // {
      //   text: 'Link 1',
      //   disabled: false,
      //   href: 'breadcrumbs_link_1',
      // },
      // {
      //   text: 'Link 2',
      //   disabled: true,
      //   href: 'breadcrumbs_link_2',
      // },
    ],
    folders: [
      {
        name: 'Administration',
        dateModified: '2002-2-2',
        size: '12MB',
        subfolders: [
          {
            name: 'Content1',
            dateModified: '2002-2-2',
            size: '12MB',
            subfolders: [
              {
                name: 'Content1-2',
                dateModified: '2002-2-2',
                size: '12MB',
                subfolders: [
                  {
                    name: 'Content2-1',
                    dateModified: '2002-2-2',
                    size: '12MB',
                  },
                  {
                    name: 'Content2-2',
                    dateModified: '2002-2-2',
                    size: '12MB',
                  },
                ],
              },
              {
                name: 'Content1-3',
                dateModified: '2002-2-2',
                size: '12MB',
              },
            ],
          },
          {
            name: 'Content2',
            dateModified: '2002-2-2',
            size: '12MB',
            subfolders: [
              {
                name: 'Content1',
                dateModified: '2002-2-2',
                size: '12MB',
              },
              {
                name: 'Content2',
                dateModified: '2002-2-2',
                size: '12MB',
              },
            ],
          },
        ],
      },
      {
        name: 'Content',
        dateModified: '2002-2-2',
        size: '12MB',
        subfolders: [
          {
            name: 'Content1',
            dateModified: '2002-2-2',
            size: '12MB',
          },
          {
            name: 'Content2',
            dateModified: '2002-2-2',
            size: '12MB',
          },
        ],
      },
      {
        name: 'Kronologi',
        dateModified: '2002-2-2',
        size: '12MB',
        subfolders: [
          {
            name: 'Content1',
            dateModified: '2002-2-2',
            size: '12MB',
          },
          {
            name: 'Content2',
            dateModified: '2002-2-2',
            size: '12MB',
          },
        ],
      },
      {
        name: 'File Pengesahan',
        dateModified: '2002-2-2',
        size: '12MB',
        subfolders: [
          {
            name: 'Content1',
            dateModified: '2002-2-2',
            size: '12MB',
          },
          {
            name: 'Content2',
            dateModified: '2002-2-2',
            size: '12MB',
          },
        ],
      },
      {
        name: 'Makasar',
        dateModified: '2002-2-2',
        size: '12MB',
        subfolders: [
          {
            name: 'Content1',
            dateModified: '2002-2-2',
            size: '12MB',
          },
          {
            name: 'Content2',
            dateModified: '2002-2-2',
            size: '12MB',
          },
        ],
      },
    ],
    subItem: [

    ],
  }),
  created() {
    this.subItem = this.folders
  },
  watch: {
    dialog(val) {
      if (!val) return

      setTimeout(() => (this.dialog = false), 4000)
    },
  },
  methods: {
    toggleFolder(folder) {
      this.subItem = folder
      this.items.push(
        {
          text: folder.name,
          disabled: false,
          href: 'folder',
        },
      )
      console.log(this.subItem)
      // Perbaikan pengaturan showSubfolders
      //folder.showSubfolders = !folder.showSubfolders;
    },
  },
}

</script>

<style>
.folder,
.file {
  padding: 5px;
  margin: 5px 0;
  cursor: pointer;
}

.folder:hover,
.file:hover {
  background-color: #f0f0f0;
}
</style>
