<template>
    <section>
        <h2>{{ $t("message.userSettings.title") }}</h2>

        <div v-if="!logined">
            <p>{{ $t('message.infoMsg.loginRequire') }}</p>
        </div>

        <div v-if="logined">
            <h3>{{ $t("message.userSettings.refUrl") }}</h3>
            <v-switch
                v-bind:label="$t('message.userSettings.mypage')"
                v-model="showUserSettings.refUrlMypage"
            />
            <v-switch
                v-bind:label="$t('message.userSettings.openpage')"
                v-model="showUserSettings.refUrlOpen"
            />

            <v-btn block color="secondary" v-on:click="save()">{{ $t("message.userSettings.updateBtn") }}</v-btn>
        </div>
    </section>
</template>

<script>
export default {
    name : "UserSettings",

    data: () => ({

    }),

    computed:{
        showUserSettings : {
            get()
            {
                return this.$store.getters.ShowUserSettings
            },
            set(value)
            {
                this.settings = value
                this.$store.dispatch('SetUserSettings',value)
            }
        },
        logined :{
            get(){
                return this.$store.getters['firebaseCommon/loginState'].logined
            }
        }
    },

    mounted:async function(){
        await this.$store.dispatch('GetUserSettings')
    },


    methods:{
        async save()
        {
            await this.$store.dispatch('SaveUserSettings')
        }
    }
}
</script>