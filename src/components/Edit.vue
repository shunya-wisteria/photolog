<template>
    <section>
        <h2>{{posData.name}}</h2>
        <v-container>
            <h3>Photo</h3>
            <v-row>
                <v-col cols=12>
                    <img v-bind:src="posData.photo" v-if="posData.photo != null" width="100%">
                </v-col>
            </v-row>
        </v-container>

        <div style="margin-bottom:50px;">
            <h3>Notes</h3>
            <v-form style="margin-left:10px;">
                <v-text-field
                    label="名称"
                    required
                    color="blue-grey lighten-1"
                    v-model="posData.name"
                ></v-text-field>
                <v-textarea
                    label="コメント"
                    color="blue-grey lighten-1"
                    v-model="posData.desc"
                ></v-textarea>

                <v-file-input multiple label="添付画像" v-model="imgFile"></v-file-input>

                <v-text-field
                    label="関連記事URL"
                    color="blue-grey lighten-1"
                    v-model="posData.refurl"
                ></v-text-field>
            </v-form>

            <!-- <v-btn block color="primary" v-on:click="toInsert">登録</v-btn> -->
        </div>


    </section>
</template>

<script>
export default {
    name : "Edit",

    data: () => ({
        name : "",
        photo : "",
        desc:"",
        refurl:"",
        imgFile : null,
    }),   

    computed:{
        posData :{
            get(){
                return this.$store.getters.PosData
            },
            set(value)
            {
                this.$store.dispatch('SetPosData',value)
            }

        }
    },

    mounted:async function(){
        let id = this.$route.params.id

        await this.$store.dispatch('GetPosDataSingle', id)
    }

}
</script>