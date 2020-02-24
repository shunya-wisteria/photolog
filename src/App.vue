<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      v-if="!showAsFull"
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon 
          @click="drawer=true" 
          v-if="menu"
          style="margin-right: 5px;"
        ></v-app-bar-nav-icon>
        <h1 style="font-weight:300;font-size*160%;">PhotoLog</h1>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <!-- <v-content>
      <router-view />
    </v-content> -->

    <v-content style="background-color:#F5F5F5">
      <v-container style="margin-top:10px;">
        <v-row align="center" justify="center">
          <v-col cols=12>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-content>


  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  computed:{
    showAsFull : {
      get()
      {
        return this.$store.getters.ShowAsFull
      }
    }
  },

  data: () => ({
    menu : true,
    drawer : false
  })
};
</script>

<style scoped>
  h1{
    font-weight: 400;
  }
</style>