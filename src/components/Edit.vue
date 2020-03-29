<template>
    <section>
        <h2>{{posData.name}}</h2>
        <h3>Photo</h3>
        <v-container>
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

            <v-btn block color="secondary" v-on:click="toUpdate">更新</v-btn>
            <v-btn block color="secondary" v-on:click="toDelete" style="margin-top:10px;">削除</v-btn>
        </div>


    </section>
</template>

<script>
export default {
    name : "Edit",

    data: () => ({
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
        scrollTo(0, 0);
    },

    methods:{
        async toUpdate()
        {
            // 必須チェック
            if(this.posData.name == "")
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"名称を入力してください。"})
                return   
            }

            let dt = new Date()
            this.posData["updated-at"] = dt
            if(this.posData["created-at"] == null)
            {
                this.posData["created-at"] = new Date('00000000')
            }


            if(this.imgFile != null)
            {
                this.posData["img"] = this.imgFile[0]
            }

            await this.$store.dispatch('UpdatePos', this.posData)

            this.posData["img"] = null
        },
        async toDelete()
        {
            await this.$store.dispatch('DeletePos', this.posData.id)
        }

    }

}
</script>