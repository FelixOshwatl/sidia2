<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" class="text-center">
              <h1
                class="pb-5"
                style="font-size: xxx-large;"
                v-if="error.statusCode === 404"
              >{{ pageNotFound.toUpperCase() }}</h1>
              <h1 class="pb-5" style="font-size: xxx-large;" v-else>{{ otherError }}</h1>
              <v-btn text color="error" to="/">Home page</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  layout: "page",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
