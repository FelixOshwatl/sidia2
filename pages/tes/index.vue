<template>
  <div class="folder-view">
    <!-- ... konten folder ... -->
    <router-link :to="{ name: 'Folder', params: { id: 'folder1' } }">Folder 1</router-link>
    <router-link :to="{ name: 'File', params: { id: 'file1' } }">File 1.txt</router-link>
    <!-- ... tambahkan link untuk folder dan file lainnya ... -->
  </div>
</template>

<script>
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: FolderView // Komponen FolderView Anda
    },
    {
      path: '/folder/:id',
      name: 'Folder',
      component: FolderView // Komponen FolderView untuk folder
    },
    {
      path: '/file/:id',
      name: 'File',
      component: FileView // Komponen FileView Anda
    }
  ]
});
</script>


