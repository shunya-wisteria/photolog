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
        <h1 style="font-weight:300;font-size:160%;">PhotoLog</h1>
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

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position:fixed; top:0; left:0;"
    >
      <v-list-item v-if="loginState.logined">
        <v-list-item-avatar>
          <img v-bind:src="userInfo.photoURL">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{userInfo.displayName}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider v-if="loginState.logined" />

      <v-list dense v-if="loginState.logined">
        <router-link :to="{name:'home'}" style="text-decoration:none">
          <v-list-item v-on:click="toLink()">
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{name:'insert'}" style="text-decoration:none">
          <v-list-item v-on:click="toLink()">
            <v-list-item-content>
              <v-list-item-title>AddEntry</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link v-bind:to="'/map/'+userInfo.uid" style="text-decoration:none">
          <v-list-item v-on:click="toLink()">
            <v-list-item-content>
              <v-list-item-title>MyMap</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <v-list-item v-on:click="toLogout()">
          <v-list-item-content>
            <v-list-item-title>LogOut</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense v-if="!loginState.logined">
        <router-link :to="{name:'login'}" style="text-decoration:none">
          <v-list-item v-on:click="toLink()">
            <v-list-item-content>
              <v-list-item-title>LogIn</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>

    </v-navigation-drawer>

    <v-dialog
      v-model="modalDialog.enabled"
      max-width="290"
    >
      <v-card>
        <v-card-title>{{modalDialog.title}}</v-card-title>
        <v-card-text>
          {{modalDialog.body}}
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="accent" @click="modalDialog.enabled=false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    },

    loginState:{
      get()
      {
        return this.$store.state.firebaseCommon.loginState
      },
      set(value)
      {
        this.$store.dispatch('SetModalMsg',value)
      }
    },

    modalDialog:{
      get()
      {
        return this.$store.getters['widget/ModalDialog']
      }
    },

    userInfo:{
      get()
      {
        return this.$store.state.firebaseCommon.userInfo
      }
    }
  },

  mounted: async function(){
    await this.$store.dispatch('firebaseCommon/checkLogined')
  },

  data: () => ({
    menu : true,
    drawer : false,
    // userInfo:{
    //   photoURL : ""
    // }
  }),

  methods:{
    toLogout()
    {
      this.$store.dispatch('firebaseCommon/LogoutFirebase')
    },
    toLink()
    {

    }
  }

};
</script>

<style>
  h1{
    font-weight: 400;
  }

  section{
      color: #737373;
  }
  h2{
      font-weight: 400;
      margin-bottom: 10px;
  }
  h3{
    font-weight: 400;
  }

</style>