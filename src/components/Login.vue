<template>
    <section>
        <div v-if="!this.loginState.logined">
            <h2>LogIn</h2>
            <div>Googleアカウントを利用しログインしてください。</div>
            <div class="login">
                <input type="image" src="/googleauth.png" alt="login" style="width:200px;" v-on:click="toLogin">
            </div>
        </div>

        <div v-if="this.loginState.logined">
            <v-btn block color="primary" v-on:click="toLogOut">LogOut</v-btn>
        </div>
        
    </section>
</template>

<script>
export default {
    name : "Login",

    computed:{
        loginState:{
            get()
            {
                return this.$store.getters['firebaseCommon/loginState']
            }
        }
    },

    mounted: async function(){
        await this.$store.dispatch('firebaseCommon/checkLogined')
    },

    methods:{
        async toLogin()
        {
            await this.$store.dispatch('firebaseCommon/CredentialFirabase')
        },

        toLogOut()
        {
            this.$store.dispatch('firebaseCommon/LogoutFirebase')
        }
    }
}
</script>

<style scoped>
    .login{
        margin: 10px 0px;
    }

</style>