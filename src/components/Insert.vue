<template>
    <section>
        <h2>{{ $t('message.entry.insertTitle') }}</h2>

        <div v-if="!logined">
            <p>{{ $t('message.infoMsg.loginRequire') }}</p>
        </div>

        <div v-if="logined">
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
                <v-btn block color="secondary" v-on:click="toCurPos" style="margin-top:15px;">{{ $t('message.entry.curPosButton') }}</v-btn>

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
                        v-bind:label="$t('message.entry.posComment')"
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

        showMap : false,

        navOption : {
            enableHighAccuracy : true,
            timeout : 8000,
            maximumAge : 5000
        }

    }),

    computed:{
        pos:{
            get()
            {
                return this.$store.getters.PosSearch
            }
        },
        logined :{
            get(){
                return this.$store.getters['firebaseCommon/loginState'].logined
            }
        },
        searchedWord:{
            get()
            {
                return this.$store.getters.SearchedWord 
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
            this.name = this.searchedWord
            this.showMap = true   
        }
        // init desc textarea
        let dt = new Date()
        this.desc = dt.getFullYear().toString() + "." + ('0' + (dt.getMonth() + 1)).slice(-2) + "." + ('0' + dt.getDate()).slice(-2)

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
            this.name = this.searchedWord

        },

        toCurPos()
        {
            navigator.geolocation.getCurrentPosition(this.onNavSuccess , this.onNavError, this.navOption);
        },
        onNavSuccess(pos)
        {
            this.$store.dispatch('SetPosSearch', {lat:pos.coords.latitude, lng:pos.coords.longitude})

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
        onNavError(error)
        {
            console.log(error.code)
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
                insArgs["img"] = this.imgFile[0]
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
<style scoped>
</style>