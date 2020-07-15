<template>
    <section>
        <v-container style="padding-top:0px;">
            <h2>My PhotoLog Data</h2>
            <v-text-field
                label="Search Entry"
                v-model="search"
                single-line
                hide-details
                style="margin-bottom:30px;margin-top:0px;padding-top:10px;"
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
        <v-dialog
            v-model="modal"
            max-width="95%"
        >
            <v-card
                style="padding:30px;"
            >
                <Edit 
                    :pid="pid"
                    style="margin-bottom:-20px;"
                />
                <v-btn block color="secondary" v-on:click="modal=false">{{ $t("message.entry.closeButton") }}</v-btn>
            </v-card>
        </v-dialog>


    </section>
</template>

<script>
import Edit from '@/components/Edit'

export default {
    name : "List",

    components:{
        Edit
    },

    data(){
        return{
            search : "",
            pid : null,

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
        },

        modal:
        {
            get()
            {
                return this.$store.getters['EditModal']
            },
            set(value)
            {
                this.$store.dispatch('SetEditModal', value)
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
            this.pid = data.id

            await this.$store.dispatch('GetPosDataSingle', this.pid)

            this.modal = true
        }
    }
}
</script>

