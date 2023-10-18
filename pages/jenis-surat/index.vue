<template class="mx-auto" v-slot:activator="{ on, attrs }">
  <div style="margin: 20px;">
    <p style="margin-top: 10px;">Jenis Surat</p>

    <v-col cols="auto">

      <v-btn :class="active1 === true && tabs === 1 ? 'success' : ''" height="72" min-width="250" @click="tab(1)"> <v-icon
          style=";">mdi-note </v-icon>
        Berita Acara
      </v-btn>

      <v-btn :class="active2 === true && tabs === 2 ? 'success' : ''" height="72" min-width="250" @click="tab(2)"> <v-icon
          style=";">mdi-note </v-icon>
        Surat Keluar
      </v-btn>
    </v-col>

    <div v-if="tabs == 1">
      <p style="margin: 20px;">Atribut Surat</p>
      <v-form @submit.prevent="submit" v-model="isFormValid">
        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Short Name</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="name"
              :rules="nameRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Date</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="date1" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null" :rules="date1Rules"></v-text-field>
              </template>
              <v-date-picker v-model="due"></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="1">
            <v-list-subheader class="">curent version</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="version1"
              :rules="version1Rules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Filling Date</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="menu2" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due2" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null" :rules="menu2Rules"></v-text-field>
              </template>
              <v-date-picker v-model="due2"></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="1">
            <v-list-subheader class="">User</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="user"
              :rules="userRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Nomor BA</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="nomor"
              :rules="nomorRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Perihal</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="perihal"
              :rules="perihalRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Tanggal Berita Acara</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due3" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null" :rules="menu3Rules"></v-text-field>
              </template>
              <v-date-picker v-model="due3"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Pihak Pertama</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="pihak_pertama"
              :rules="pihak_pertamaRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Pihak Kedua</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="pihak_kedua"
              :rules="pihak_keduaRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Tipe</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select v-model="select1" :rules="select1Rules" required :items="items" label="Outlined style" dense
              outlined>
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Klasifikasi</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select v-model="klasifikasi" :rules="klasifikasiRules" :items="items_klasifikasi" label="Outlined style"
              dense outlined>
              dsd
            </v-select>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Sub Klasifikasi</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select v-model="sub_klasifikasi" :rules="sub_klasifikasiRules" :items="items_sub" label="Outlined style"
              dense outlined>
            </v-select>
          </v-col>
        </v-row>


        <v-col cols="auto" align="center">
          <v-btn height="50" min-width="200" color="red" style="color: white;" @click="resetForm">
            Batal
          </v-btn>

          <v-btn type="submit" height="50" min-width="200" color="green" style="color: white;" :disabled="!isFormValid">
            simpan
          </v-btn>
        </v-col>
      </v-form>
    </div>

    <div v-if="tabs == 2">
      <v-form @submit.prevent="submit2" v-model="isFormValid2">
        <p style="margin: 20px;">Atribut Surat</p>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Short Name</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="name2"
              :rules="name2Rules"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Date</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due1" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null"></v-text-field>
              </template>
              <v-date-picker v-model="due1"></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="1">
            <v-list-subheader class="">curent version</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="version2" :rules="version2Rules" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field></v-text-field>
              </template>

            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Filling Date</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="menu2" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due2_2" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null"></v-text-field>
              </template>
              <v-date-picker v-model="due2_2"></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="1">
            <v-list-subheader class="">User</v-list-subheader>
          </v-col>

          <v-col cols="3">
            <v-menu v-model="user2" :rules="user2Rules" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field></v-text-field>
              </template>

            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Tipe Surat</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select :items="items" label="Outlined style" dense outlined v-model="tipe_surat2"
              :rules="tipe_surat2Rules">
              dsd
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Jenis Surat</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select :items="items_jenis_surat" label="Outlined style" dense outlined v-model="jenis_surat2"
              :rules="jenis_surat2Rules">
              dsd
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Nomor Surat</v-list-subheader>
          </v-col>

          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="nomor_surat2"
              :rules="nomor_surat2Rules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader class="">Perihal Surat</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="perihal_surat2"
              :rules="perihal_surat2Rules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Kepada</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="kepada"
              :rules="kepadaRules"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Tanggal Surat</v-list-subheader>
          </v-col>
          <v-col cols="3">
            <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :value="due3_3" clearable label="Formatted with datefns" readonly v-bind="attrs" v-on="on"
                  @click:clear="date = null"></v-text-field>
              </template>
              <v-date-picker v-model="due3_3"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Klasifikasi Surat</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select :items="items_klasifikasi" label="Outlined style" dense outlined v-model="klasifikasi_surat2"
              :rules="klasifikasi_surat2Rules">
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Sub Klasifikasi</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-select :items="items_sub" label="Outlined style" dense outlined v-model="sub_klasifikasi2"
              :rules="sub_klasifikasi2Rules">
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-list-subheader :items="items" label="Outlined style" dense outlined>Kode Ruang</v-list-subheader>
          </v-col>
          <v-col cols="9">
            <v-text-field label="Outlined" placeholder="Placeholder" variant="outlined" v-model="kode_ruang2"
              :rules="kode_ruang2Rules"></v-text-field>
          </v-col>
        </v-row>

        <v-col cols="auto" align="center">
          <v-btn height="50" min-width="200" color="red" style="color: white;" @click="resetForm">
            Batal
          </v-btn>

          <v-btn type="submit" height="50" min-width="200" color="green" style="color: white;" :disabled="!isFormValid">
            simpan
          </v-btn>
        </v-col>
      </v-form>
    </div>


  </div>
</template>

<script>
export default {
  data: () => {

    return {
      isFormValid: false,
      isFormValid2: false,
      active1: false,
      active2: false,
      items: [
        'external',
        'Internal',
      ],

      nameRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      version1Rules: [
        value => {
          if (/^([^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`])+$/.test(value)) {
            return true
          } else if (value && !/^[^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid'
          } else {
            return 'Nama lengkap wajib diisi.'
          }
        },
      ],

      userRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      nomorRules: [
        value => {
          if (/^([^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`])+$/.test(value)) {
            return true
          } else if (value && !/^[^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid'
          } else {
            return 'Nama lengkap wajib diisi.'
          }
        },
      ],

      perihalRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      pihak_pertamaRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      pihak_keduaRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      select1Rules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      klasifikasiRules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      sub_klasifikasiRules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      date1Rules: [
        value => {
          if (!value) {
            return 'Tanggal wajib diisi.';
          } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
            return 'Format tanggal tidak valid (YYYY-MM-DD).';
          } else {
            return true;
          }
        },
      ],

      menu2Rules: [
        value => {
          if (!value) {
            return 'Tanggal wajib diisi.';
          } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
            return 'Format tanggal tidak valid (YYYY-MM-DD).';
          } else {
            return true;
          }
        },
      ],

      menu3Rules: [
        value => {
          if (!value) {
            return 'Tanggal wajib diisi.';
          } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
            return 'Format tanggal tidak valid (YYYY-MM-DD).';
          } else {
            return true;
          }
        },
      ],

      //tab 2
      name2Rules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      version2Rules: [
        value => {
          if (/^([^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`])+$/.test(value)) {
            return true
          } else if (value && !/^[^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid'
          } else {
            return 'Nama lengkap wajib diisi.'
          }
        },
      ],

      user2Rules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      tipe_surat2Rules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      jenis_surat2Rules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      nomor_surat2Rules: [
        value => {
          if (/^([^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`])+$/.test(value)) {
            return true
          } else if (value && !/^[^a-zA-Z!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid'
          } else {
            return 'Nama lengkap wajib diisi.'
          }
        },
      ],

      perihal_surat2Rules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      kepadaRules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      klasifikasi_surat2Rules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      subklasifikasi_surat2Rules: [
        value => !!value || 'Pilih Salah Satu.',
      ],

      kode_ruang2Rules: [
        value => {
          if (!value) {
            return 'Nama lengkap wajib diisi.';
          }
          if (/^([^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]{3,})+$/.test(value)) {
            return true;
          } else if (!/^[^0-9!@#$%^&*()\-=_+{}\t\n[\]:;<>?~\\/|'"`]+$/.test(value)) {
            return 'Nama lengkap tidak valid';
          } else {
            return true; // Form lulus jika tidak ada masalah
          }
        },
      ],

      //data items dropdown
      items_klasifikasi: [
        'DL - Pendidikan Dan Pelatihan',
        'HK - Hukum',
        'HL - Hubungan Kelembagaan',
        'HM - Kehumasan',
        'IF - Informatika',
        'JM - Jaminan',
        'KP - Kepesertaan',
        'KS - Kesekretarian',
        'KU - Keuangan',
        'OT - Organisasi Dan Tata Laksana',
        'PG - Kepegawaian',
        'PP - Pengawasan Dan Pemeriksaan',
        'RP - Perencanaan Dan Pengembangan',
        'SP - Sarana dan Prasarana'
      ],

      items_sub: [
        'PERDIR/09/072015',
        'PERDIR/11/062018'
      ],

      items_jenis_surat: [
        'BERITA ACARA',
        'BIASA',
        'DUKA CITA',
        'EDARAN',
        'IJIN',
        'KEPRES',
        'KEPUTUSAN DIREKSI',
        'KETERANGAN',
        'KUASA',
        'MEMO',
        'PENGUMUMAN',
        'PERATURAN DIREKSI',
        'PERATURAN PEMERINTAH RI',
        'PERJANJIAN',
        'RAHASIA',
        'SURAT TUGAS',
        'TERBATAS'
      ],

      title: '',
      content: '',
      date1: '',
      due: null,
      due1: null,
      due2: null,
      due3: null,
      due2_2: null,
      due3_3: null,
      tabs: 0,
      select1: null,
    }
  },
  methods: {
    submitForm() {

    },

    resetForm() {
      this.name = '';
      this.version1 = '';
      this.user = '';
      this.nomor = '';
      this.perihal = '';
      this.tanggal_ba = '';
      this.pihak_pertama = '';
      this.pihak_kedua = '';
      this.select1 = null;
      this.klasifikasi = null;
      this.sub_klasifikasi = null;

      // Reset data pada bagian Surat Keluar (tab 2)
      this.name2 = '';
      this.due1 = null;
      this.due2_2 = null;
      this.due3_3 = null;
      this.tipe_surat2 = null;
      this.jenis_surat2 = null;
      this.nomor_surat2 = '';
      this.perihal_surat2 = '';
      this.kepada = '';
      this.klasifikasi_surat2 = null;
      this.sub_klasifikasi2 = null;
      this.kode_ruang2 = '';
    },

    tab(value) {
      this.tabs = value
      if (value === 1) {
        this.active1 = true
      }
      else {
        this.active2 = true
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()

      if (valid) alert('Form is valid')
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },

    submit() {
      console.log(this.name);
      console.log(this.menu2);
      console.log(this.version1);
      console.log(this.due);
      console.log(this.due2);
      console.log(this.due3);
      console.log(this.user);
      console.log(this.nomor);
      console.log(this.perihal);
      console.log(this.tanggal_ba);
      console.log(this.pihak_pertama);
      console.log(this.pihak_kedua);
      console.log(this.select1);
      console.log(this.klasifikasi);
      console.log(this.sub_klasifikasi);

    },
    submit2() {
      console.log(this.name2);
      console.log(this.due1);
      console.log(this.due2_2);
      console.log(this.due3_3);
      console.log(this.tipe_surat2);
      console.log(this.jenis_surat2);
      console.log(this.nomor_surat2);
      console.log(this.perihal_surat2);
      console.log(this.kepada);
      console.log(this.klasifikasi_surat2);
      console.log(this.sub_klasifikasi2);
      console.log(this.kode_ruang2);
    }
  }


}
// const state = reactive({
//   ...initialState,
// })

const items = [
  'item1',
  'item2'
]
</script>
