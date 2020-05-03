<template>
    <section>
        <div id="map"></div>
        
        <div
            v-if="!showAsFull"
            style="margin-top:30px;"
        >
            <p style="margin:0px;">{{ $t("message.maplink") }}</p>
            <v-text-field
                color="blue-grey lighten-1"
                v-model="mapUrl"
                readonly
                style="padding:0px;"
            ></v-text-field>
        </div>
    </section>
</template>

<script>
export default {
    name : "PhotoMap",

    data(){
        return {
            map         :   null,
            marker      :   [],
            infoWindow  :   [],

            newsData    :   [],

            infoMsgs : this.$store.getters.portalInfos,

            mapUrl : ""
        }
    },

    computed:{
        showAsFull : {
            get()
            {
                return this.$store.getters.ShowAsFull
            }
        },

        showRefUrl : {
            get()
            {
                return this.$store.getters.ShowRefUrl
            }
        }

    },

    mounted:async function(){
        // UID特定
        let uid = this.$route.params.uid

        // データ読み込み
        await this.$store.dispatch('GetPosData', uid)

        //  地図描画
        this.initMap()

        this.mapUrl = location.href + "?mode=1&refurl=1"
    },

    methods:{
        initMap(){
            let mapLatLng = new google.maps.LatLng({lat: 35.4644342, lng: 136.7389885});
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: mapLatLng,
                zoom: 7
            });

            for (var i = 0; i < this.$store.getters.PosMarkers.length; i++) {
                let markerLatLng = new google.maps.LatLng({lat: this.$store.getters.PosMarkers[i].lat, lng: this.$store.getters.PosMarkers[i].lng}); // 緯度経度のデータ作成
                
                this.marker[i] = new google.maps.Marker({ // マーカーの追加
                    position: markerLatLng, // マーカーを立てる位置を指定
                    map: this.map // マーカーを立てる地図を指定
                });

                let contentHtml = "<div style='padding: 5px 10px 10px 10px; display:block;'><p style='color:#555555; font-size:150%; font-weight:400; margin-bottom:8px;'>" + this.$store.getters.PosMarkers[i].name + "</p>"
                contentHtml = contentHtml + "<p style='color:#555555; margin-bottom:8px;'>" + this.$store.getters.PosMarkers[i].desc + "</p>"
                if(this.$store.getters.PosMarkers[i].refurl != null && this.$store.getters.PosMarkers[i].refurl != "" && this.showRefUrl)
                {
                    contentHtml = contentHtml + "<p style='margin-bottom:8px;'><a href='" + this.$store.getters.PosMarkers[i].refurl +  "' target='_blank' style='color:#555555;'>" + this.$t('message.posInfo.refUrl') + "</a></p>"
                }
                if(this.$store.getters.PosMarkers[i].photo != null && this.$store.getters.PosMarkers[i].photo != "")
                {
                    contentHtml = contentHtml + "<img src='" + this.$store.getters.PosMarkers[i].photo + "' width=250px>"
                }
                contentHtml = contentHtml + "</div>"

                this.infoWindow[i] = new google.maps.InfoWindow({ 
                    content : contentHtml
                });

                this.markerEvent(i); // マーカーにクリックイベントを追加
            }
        },

        markerEvent(i) {
            var self = this
            this.marker[i].addListener('click', function() { // マーカーをクリックしたとき
                self.infoWindow[i].open(self.map, self.marker[i]); // 吹き出しの表示
            });
        }
    }

}
</script>

<style scoped>
    #map {
        height: 600px;
        width: 100%;
    }
</style>