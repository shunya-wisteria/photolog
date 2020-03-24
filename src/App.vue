<template>
  <v-app>
    <v-app-bar
      app
      color="white"
      light
      v-if="!showAsFull"
    >
      <v-container style="margin-top:20px; margin-left:-10px;">
        <v-row justify="center" align-content="center">
          <v-col cols=2>
            <v-app-bar-nav-icon 
              @click="drawer=true" 
              v-if="menu"
            ></v-app-bar-nav-icon>

          </v-col>
          <v-col cols=10>
            <v-text-field
              filled
              label="Search Pos"
              solo
              dense
              v-model="posInput"
              v-on:keyup.enter="toSearch"
              v-on:focus="toFocusSearch"
              v-on:keyup="toUpdate"
              v-on:blur ="toBack"
              style="margin-top:5px;"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-content style="background-color:#F5F5F5">
      <v-container style="margin-top:10px;">
        <v-row align="center" justify="center">
          <v-col cols=12>
            <transition name="fade">
              <router-view />
            </transition>
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

        <router-link v-bind:to="'/map/'+userInfo.uid" style="text-decoration:none">
          <v-list-item v-on:click="toLink()">
            <v-list-item-content>
              <v-list-item-title>MyMap</v-list-item-title>
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

    <Loading v-if="this.loading" />

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Loading    from './components/widgets/loading'

export default {
  name: 'App',

  components: {
    HelloWorld,
    Loading
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

    loading:{
      get()
      {
        return this.$store.getters.Loading
      }
    },

    userInfo:{
      get()
      {
        return this.$store.state.firebaseCommon.userInfo
      }
    },

    beforeSearch:
    {
        get()
        {
            return this.$store.getters.BeforeSearch
        }
    } 
  },

  mounted: async function(){
    await this.$store.dispatch('firebaseCommon/checkLogined')
  },

  data: () => ({
    menu : true,
    drawer : false,
    posInput : ""
  }),

  methods:{
    toLogout()
    {
      this.$store.dispatch('firebaseCommon/LogoutFirebase')
    },
    toLink()
    {

    },

    async toSearch()
    {
      if(this.posInput == "")
      {
          this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"場所名を入力してください。"})
          return
      }
      if(!this.loginState.logined)
      {
        this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"ログインしてください。"})
        return
      }

      await this.$store.dispatch('SearchPos', this.posInput)
      this.posInput = ""
      this.$router.push({name : 'insert'})
    },

    toFocusSearch()
    {
      if(this.$route.path != "/search")
      {
        this.$store.dispatch('SetBeforeSearch', this.$route.path)
        this.$router.push({name : 'search'})
      }
    },
    toUpdate()
    {
      if(this.$route.path != "/search")
      {
        this.$store.dispatch('SetBeforeSearch', this.$route.path)
        this.$router.push({name : 'search'})
      }
    },
    toBack()
    {
        if(this.$route.path == "/search" && this.beforeSearch != null )
        {
          this.$router.push(this.beforeSearch)
        }
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}

</style>