<template>
  <v-col style="margin: 20px;">
    <v-col style="margin: 10px;">
      <v-row>

        <v-breadcump :items="items" divider=">">

        </v-breadcump>
        <v-icon>mdi-chevron-right</v-icon>
      </v-row>
      <v-col align="center" style="margin: 20px;"></v-col>
      <v-row style="color: grey;">
        <v-col style="">
          Name
        </v-col>
        <v-col align="center" style="margin: auto;">
          <span>Date Modified</span>
        </v-col>
        <v-col align="right" style="margin-right: 20px ;">
          Size
        </v-col>
      </v-row>
    </v-col>
    <v-divider></v-divider>
    <v-row class="d-flex justify-space-between" style="margin: 10px;">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">Administration</p>
      </v-col>
      <v-col align="center">
        2002-2-2
      </v-col>
      <v-col align="right">12MB</v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row class="d-flex justify-space-between" style="margin: 10px;">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">Content</p>
      </v-col>
      <v-col align="center">
        2002-2-2
      </v-col>
      <v-col align="right">12MB</v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row class="d-flex justify-space-between" style="margin: 10px;">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">Kronologi</p>
      </v-col>
      <v-col align="center">
        2002-2-2
      </v-col>
      <v-col align="right">12MB</v-col>
    </v-row>

    <v-divider></v-divider>
    <v-row class="d-flex justify-space-between" style="margin: 10px;">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">Kronologi</p>
      </v-col>
      <v-col align="center">
        2002-2-2
      </v-col>
      <v-col align="right">12MB</v-col>
    </v-row>

    <v-divider></v-divider>
    <v-row class="d-flex justify-space-between" style="margin: 10px;">
      <v-col class="d-flex align-center">
        <v-icon>mdi-folder</v-icon>
        <p class="ma-0">Kronologi</p>
      </v-col>
      <v-col align="center">
        2002-2-2
      </v-col>
      <v-col align="right">12MB</v-col>
    </v-row>


  </v-col>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        text: 'folder',
        disabled: false,
        href: 'folder',
      },
      {
        text: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2',
      },
    ],
  }),
}
</script>

