<template>
  <v-container
    style="padding-top:0px;"
  >
    <v-row class="text-center" v-if="!logined">

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to PhotoLog
        </h1>
        <p class="subheading font-weight-regular">
          
        </p>
      </v-col>
    </v-row>

    <ListTable
      v-if="logined"
    />
  </v-container>
</template>

<script>
  import ListTable from './ListTable'

  export default {
    name: 'Home',

    components:{
      ListTable
    },

    computed:{
      logined :{
        get(){
          return this.$store.getters['firebaseCommon/loginState'].logined
        }
      }
    },

    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  }
</script>
