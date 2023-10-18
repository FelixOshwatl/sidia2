
<template class="mx-auto">
  <!-- <v-file-input label="File input"></v-file-input> -->
  <div style="margin: 10px;">
    <p>Alih Media</p>
    <div align="center">
      <div class="dropzone" @drop.prevent="onDrop($event)" @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true" @dragleave.prevent="dragover = false"
        :class="{ 'grey lighten-2': dragover }">
        <v-icon color="black" c lass="mx-4 " :class="[dragover ? 'mt-2, mb-6' : 'mt-5']"
          size="60">mdi-cloud-upload</v-icon>
        <span>Drag or Drop File</span>
        <span>OR</span>

        <v-btn prepend-icon="$vuetify" color="success" variant="flat">
          <v-file-input>
            Upload</v-file-input>
        </v-btn>

        <input type="file" id="dropzoneFile" class="dropzoneFile" />
      </div>

      <div style="margin: 3%;">
      </div>

      <!-- <v-col style="margin: ;">

        <div align="left" style="margin: 0px;">
          <v-icon margin="0px">mdi-file </v-icon> Surat1.pdf
        </div>
        <div align="right" style="margin: 0px;">
          <v-icon>mdi-close</v-icon>
        </div>
      </v-col> -->


      <!-- <v-progress-linear color="grey" indeterminate :height="7"></v-progress-linear> -->
      <!-- <strong>{{ Math.ceil(knowledge) }}%</strong> -->





      <v-icon style="margin: 10px;">mdi-file </v-icon> Surat-pengesahan.pdf
      <v-icon style="margin-left: 1207px ;">mdi-close</v-icon>

      <v-progress-linear color="grey" indeterminate :height="7"></v-progress-linear>


      <v-icon style="margin: 10px;">mdi-file </v-icon> Surat-dokumenSAS.pdf
      <v-icon style="margin-left: 1200px ;">mdi-close</v-icon>

      <v-progress-linear color="grey" indeterminate :height="7"></v-progress-linear>


    </div>
  </div>
</template>


<script>
import { ref } from "vue";
export default {
  name: "DropZone",
  setup() {
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return { active, toggleActive };
  },
};

</script>

<script>
export default {
  name: "Upload",
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragover: false,
      uploadedFiles: []
    };
  },
  methods: {
    removeFile(fileName) {
      // Find the index of the
      const index = this.uploadedFiles.findIndex(
        file => file.name === fileName
      );
      // If file is in uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1);
    },
    onDrop(e) {
      this.dragover = false;
      // If there are already uploaded files remove them
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      // If user has uploaded multiple files but the component is not multiple throw error
      if (!this.multiple && e.dataTransfer.files.length > 1) {
        this.$store.dispatch("addNotification", {
          message: "Only one file can be uploaded at a time..",
          colour: "error"
        });
      }
      // Add each file to the array of uploaded files
      else
        e.dataTransfer.files.forEach(element =>
          this.uploadedFiles.push(element)
        );
        console.log(this.uploadedFiles);
    },
    submit() {
      // If there aren't any files to be uploaded throw error
      if (!this.uploadedFiles.length > 0) {
        this.$store.dispatch("addNotification", {
          message: "There are no files to upload",
          colour: "error"
        });
      } else {
        // Send uploaded files to parent component
        this.$emit("filesUploaded", this.uploadedFiles);
        // Close the dialog box
        this.closeDialog();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.file-drop {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.dropzone {
  width: 1000px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #41b883;

  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    color: #fff;
    background-color: #41b883;
    transition: 0.3s ease all;
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #41b883;

  label {
    background-color: #fff;
    color: #41b883;
  }
}
</style>

