<template>
    <section>
        <h2>My PhotoLog Data</h2>

        <v-container>
            <v-text-field
                label="Entry Search"
                v-model="search"
                single-line
                hide-details
                style="margin-bottom:30px;margin-top:0px;"
                filled
                solo
            />

            <v-data-table
                :headers="headers"
                :items="PosData"
                :custom-filter="filterOnlyCapsText" :search="search"
                @click:row='onClickRow'
            />
        </v-container>

    </section>
</template>

<script>
export default {
    name : "List",

    data(){
        return{
            search : "",

            headers:[
                {
                    text : "名称",
                    value : "name"
                },
                {
                    text : "登録日",
                    value : "created-at"
                },
                {
                    text : "更新日",
                    value : "updated-at"
                }
            ]
        }
    },


    computed:{
        uid : {
            get()
            {
                return this.$store.getters['firebaseCommon/userInfo'].uid
            }
        },
        PosData:
        {
            get()
            {
                return this.$store.getters.PosMarkers
            }
        }
    },

    mounted:async function(){
        await this.$store.dispatch('GetMyPosData')
    },

    methods:{
        filterOnlyCapsText (value, search, item) {
        return value != null &&
            search != null &&
            typeof value === 'string' &&
            value.toString().toLocaleUpperCase().indexOf(search) !== -1
        },

        async onClickRow(data)
        {
            let routeData = this.$router.resolve('/detail/' + data.id)
            window.open(routeData.href, '_blank');

        }
    }
}
</script>

