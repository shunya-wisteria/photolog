<template>
    <section>
        <h2>Register New PhotoLog Entry</h2>

        <div style="margin-bottom:40px;">
            <div style="margin-left:10px;">
                <v-text-field
                    label="場所名"
                    color="blue-grey lighten-1"
                    v-model="posInput"
                    v-on:keyup.enter="toSearch"
                ></v-text-field>
            </div>
            <v-btn block color="primary" v-on:click="toSearch">検索</v-btn>

            <div id='map' style="width:100%; height:300px;margin-top:30px;" v-show="showMap"></div>
        </div>

        <div>
            <h3>Notes</h3>
            <v-form style="margin-left:10px;">
                <v-text-field
                    label="名称"
                    required
                    color="blue-grey lighten-1"
                    v-model="name"
                ></v-text-field>
                <v-textarea
                    label="コメント"
                    color="blue-grey lighten-1"
                    v-model="desc"
                ></v-textarea>
                <v-text-field
                    label="画像URL"
                    color="blue-grey lighten-1"
                    v-model="photo"
                ></v-text-field>
                <v-text-field
                    label="関連記事URL"
                    color="blue-grey lighten-1"
                    v-model="refurl"
                ></v-text-field>
            </v-form>

            <v-btn block color="primary" v-on:click="toInsert">登録</v-btn>
        </div>

    </section>
</template>

<script>
export default {
    name : "Insert",

    data: () => ({
        posInput : "",

        name : "",
        photo : "",
        desc:"",
        refurl:"",

        showMap : false
    }),

    computed:{
        pos:{
            get()
            {
                return this.$store.getters.PosSearch
            }
        }
    },

    methods:{
        async toSearch()
        {
            if(this.posInput == "")
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"場所名を入力してください。"})
                return
            }

            await this.$store.dispatch('SearchPos', this.posInput)

            // initMap
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: this.pos
            })
            var maker =  new google.maps.Marker({
                position: this.pos,
                map: map
            });

            this.showMap = true

        },

        async toInsert()
        {
            // check pos
            if(this.pos.lat == null)
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"場所の指定が不正です。"})
                return
            }

            // 必須チェック
            if(this.name == "")
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"名称を入力してください。"})
                return
            }

            let insObj = {
                name    : this.name,
                desc    : this.desc,
                photo   : this.photo,
                refurl  : this.refurl,
                pos : {
                        _lat : this.pos.lat,
                        _long : this.pos.lng
                    }
            }

            await this.$store.dispatch('InsertPos', insObj)

            this.name = ""
            this.desc = ""
            this.photo = ""
            this.refurl = ""
            this.posInput = ""
            this.showMap = false

        }
    }

}
</script>