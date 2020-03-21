<template>
    <section>
        <h2>My PhotoLog Data</h2>

        <v-container>
            <v-row v-for="(pos, index) in PagePos" :key="index">
                <v-col cols=4>
                    <img v-bind:src="pos.photo" width="100%" v-if="pos.photo != null">
                </v-col>
                <v-col cols=8>
                    <h3>
                        <router-link v-bind:to="'/detail/'+pos.id">
                            {{ pos.name }}
                        </router-link>
                    </h3>
                    <p v-html="pos.desc" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols=3 />
                <v-col cols=3>
                    <v-btn block color="secondary" v-on:click="toBack()" v-if="back">back</v-btn>
                </v-col>
                <v-col cols=3>
                    <v-btn block color="secondary" v-on:click="toNext()" v-if="next">next</v-btn>
                </v-col>
                <v-col cols=3 />
            </v-row>
        </v-container>

    </section>
</template>

<script>
export default {
    name : "List",

    data(){
        return{
            page : 1,
            paging : 10
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

        PagePos()
        {
            let pagePos = []
            let maxCount = this.PosData.length
            let start = this.paging * (this.page - 1)
            let end   = start + this.paging
            if(end > maxCount){
                end = maxCount
            }

            for(let i = start; i< end; i++)
            {
                pagePos.push(this.PosData[i])
            }

            return pagePos
        },

        MaxPage()
        {
            let maxCount = this.PosData.length
            return Math.ceil(maxCount / this.paging)
        },

        next()
        {
            if(this.page == this.MaxPage)
            {
                return false
            }
            return true
            
        },
        back()
        {
            if(this.page == 1)
            {
                return false
            }
            return true
        }
    },

    mounted:async function(){
        await this.$store.dispatch('GetMyPosData')
    },

    methods:
    {
        toNext()
        {
            this.page += 1
            scrollTo(0, 0);
        },
        toBack()
        {
            this.page -= 1
            scrollTo(0, 0);
        }
    }
    
}
</script>

<style scoped>

</style>