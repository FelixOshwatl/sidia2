
<template>
  <div>
    <v-row>
      <v-btn class="mb-10 ma-4 mr-0 pa-1"> <i class="mdi mdi-arrow-left"></i> </v-btn>
      <v-btn class="ml-0 mb-10 ma-4 pa-1"><i class="mdi mdi-arrow-right"></i></v-btn>
      <v-btn class="mb-10 ma-4 pa-1 "><i class="mdi mdi-trash-can" style="color: red; size: ;"></i></v-btn>
      <!-- <v-card class="mb-10 mt-4 ma-4s pa-1 ml-5" style="width: 34cm ; height: 1cm; "></v-card> -->
      <v-card class="" style="width: 34cm ; height: 50px; margin-top: 10px;">
        <!-- Breadcrumb -->
        <v-breadcrumbs :items="breadcrumbs" separator=">" style="margin: 0px;">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.link">{{ item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>

        <!-- Konten lainnya di dalam card -->
        <v-card-text>
          <!-- Konten card Anda di sini -->
        </v-card-text>
      </v-card>
    </v-row>


    <div>
      <v-row>
        <v-card style="margin-right: 0px;" >
          <v-treeview v-model="tree" :open="open" :items="items" activatable item-key="name" open-on-click style="">
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file] }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card>
      </v-row>
    </div>
    <div>
      <div id="WebViewer">

      </div>
      <v-card>

      </v-card>
    </div>

  </div>
</template>

<script>
export default {

  data: () => ({
    props: {
      path: String,
      url: String
    },
    mounted: function () {
      WebViewer({
        path: this.path,
        initialDoc: this.report.pdf, // replace with your own PDF file
      }, this.$refs.viewer).then((instance) => {
        // call apis here
      });
    },
    breadcrumbs: [
      { text: 'folder 1', link: '/' },
      { text: 'folder 2', link: '/jenis-surat' },
      { text: 'folder 3', link: '/kategori/produk' }
    ],
    open: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    tree: [],
    items: [
      {
        name: '.git'
      },
      {
        name: 'node_modules'
      },
      {
        name: 'public',
        children: [
          {
            name: 'static',
            children: [{
              name: 'logo.png',
              file: 'png'
            },
            {
              name: 'p',
              file: 'png'
            }
            ]
          },
          {
            name: 'favicon.ico',
            file: 'png'
          },

          {
            name: 'index.html',
            file: 'html'
          }
        ]
      },
    ]
  }),
}
</script>

<style>
@import url();
</style>
