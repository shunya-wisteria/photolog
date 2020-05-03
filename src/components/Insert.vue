<template>
    <section>
        <h2>{{ $t('message.entry.insertTitle') }}</h2>

        <div style="margin-bottom:40px;">
            <div style="margin-left:10px;">
                <v-text-field
                    v-bind:label="$t('message.entry.searchKeyword')"
                    color="blue-grey lighten-1"
                    v-model="posInput"
                    v-on:keyup.enter="toSearch"
                ></v-text-field>
            </div>
            <v-btn block color="secondary" v-on:click="toSearch">{{ $t('message.entry.searchButton') }}</v-btn>

            <div id='map' style="width:100%; height:300px;margin-top:30px;" v-show="showMap"></div>
        </div>

        <div style="margin-bottom:50px;">
            <h3>Notes</h3>
            <v-form style="margin-left:10px;">
                <v-text-field
                    v-bind:label="$t('message.entry.posName')"
                    required
                    color="blue-grey lighten-1"
                    v-model="name"
                ></v-text-field>
                <v-textarea
                    v-bind:label="$t('message.entry.posName')"
                    color="blue-grey lighten-1"
                    v-model="desc"
                ></v-textarea>

                <v-file-input multiple v-bind:label="$t('message.entry.img')" v-on:change="selectFile" v-model="imgFile"></v-file-input>

                <v-text-field
                    v-bind:label="$t('message.entry.refUrl')"
                    color="blue-grey lighten-1"
                    v-model="refurl"
                ></v-text-field>
            </v-form>

            <v-btn block color="secondary" v-on:click="toInsert">{{ $t('message.entry.regButton') }}</v-btn>
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
        imgFile : null,

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

    mounted(){
        if(this.pos != null)
        {
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
        }
        scrollTo(0, 0);
    },

    methods:{
        async toSearch()
        {
            if(this.posInput == "")
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:this.$t('message.infoMsg.posNameValidation')})
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
            if(this.pos == null || this.pos.lat == null)
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:this.$t('message.infoMsg.invalidPos')})
                return
            }

            // 必須チェック
            if(this.name == "")
            {
                this.$store.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:this.$t('message.infoMsg.nameValidation')})
                return
            }

            let dt = new Date()

            let insObj = {
                name    : this.name,
                desc    : this.desc,
                photo   : this.photo,
                refurl  : this.refurl,
                pos : {
                        _lat : this.pos.lat,
                        _long : this.pos.lng
                    },
                'created-at' : dt,
                'updated-at' : dt
            }

            let insArgs = {}
            insArgs["insObj"] = insObj
            if(this.imgFile != null)
            {
                insArgs["insImg"] = this.imgFile[0]
            }
            
            await this.$store.dispatch('InsertPos', insArgs)

            this.name = ""
            this.desc = ""
            this.photo = ""
            this.refurl = ""
            this.posInput = ""
            this.showMap = false
            this.imgFile = null
        },

        selectFile()
        {

        }
    }

}
</script>