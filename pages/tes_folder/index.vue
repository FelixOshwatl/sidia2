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
        Media Saya
      </p>
    </v-row>
    <sub-folders :folders="subItem" @getFolder="toggleFolder"></sub-folders>
    <div>
      <!-- Tombol untuk membuka dialog -->
      <!-- Dialog Vuetify -->
      <!-- <v-dialog v-model="dialog" hide-overlay> -->
      <!-- <v-card class=" fixed ml-16 mr-16  mt-10" v-model="dialog" hide-overlay>
        <div class="bg-grey d-flex" style="background-color: grey;">
          <v-row class="d-flex justify-space-between align-center mb-5 mt-5 mr-3">
            <v-row class="d-flex justify-start ml-5" style="color: white;">mengunggah 3 item</v-row>
            <v-button><v-icon class="mr-2" style="color: white;">mdi-chevron-down</v-icon></v-button>
            <v-button><v-icon style="color: white;">mdi-close</v-icon></v-button>
          </v-row>
        </div>
        <v-row class="d-flex justify-space-between mb-6 mt-4 mr-3">
          <v-row class="d-flex justify-start ml-3 mt-1 ml-4">
            <v-icon>mdi-image</v-icon>surat laporan.png
          </v-row>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
        <v-divider></v-divider>
        <v-row class="d-flex justify-space-between mb-6 mt-4 mr-3">
          <v-row class="d-flex justify-start ml-3 mt-1 ml-4">
            <v-icon>mdi-image</v-icon>surat masuk.png
          </v-row>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
        <v-divider></v-divider>
      </v-card> -->
      <loadingUpload></loadingUpload>
      <!-- </v-dialog> -->
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,

    items: [

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
