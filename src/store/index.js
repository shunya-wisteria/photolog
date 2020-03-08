import Vue        from 'vue'
import Vuex       from 'vuex'
import router     from '@/router'
import firebase   from 'firebase'

import {widget}         from './modules/widget'
import {restcall}       from './modules/restcall'
import {firebaseCommon} from './modules/firebaseCommon'
import {migrate}        from './modules/migrate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    displayControl:{
      showAsFull : null
    },

    // poslMakers
    posMarkers : [],

    // pos search
    posSearch : {}
  },

  getters:{
    ShowAsFull(state)
    {
      return state.displayControl.showAsFull
    },

    PosMarkers(state)
    {
      return state.posMarkers
    },

    PosSearch(state)
    {
      return state.posSearch
    }
  },

  mutations: {
    setShowAsFull(state,payload)
    {
      state.displayControl.showAsFull = payload
    },

    setPosMarkers(state, payload)
    {
      state.posMarkers = payload
    },

    setPosSearch(state,payload)
    {
      state.posSearch = payload
    }
  },
  actions: {
    SetShowAsFull({commit}, showState)
    {
      commit('setShowAsFull', showState)
    },

    //---------------------------
    // Read PosData from Firebase
    //---------------------------
    async GetPosData({commit}, uid)
    {
      let posMarkers = []

      let db = firebase.firestore()
      let posDataList = (await db.collection("PhotoLog").doc(uid).collection("Log").get()).docs
      posDataList.forEach(function(posData){
        let posRec = posData.data()

        // format datetime
        let cyear
        let cmonth
        let cday
        let uyear
        let umonth
        let uday

        if(posRec["created-at"] != null)
        {
          let cd     = new Date(posRec["created-at"].seconds * 1000)
          cyear  = cd.getFullYear()
          cmonth = (`0${cd.getMonth() + 1}`).slice(-2)
          cday   = (`0${cd.getDate()}`).slice(-2)
        }

        if(posRec["updated-at"] != null)
        {
          let ud     = new Date(posRec["updated-at"].seconds * 1000)
          uyear  = ud.getFullYear()
          umonth = (`0${ud.getMonth() + 1}`).slice(-2)
          uday   = (`0${ud.getDate()}`).slice(-2)
        }

        let posMarker = {}
        posMarker["name"]  = posRec.name
        posMarker["desc"]  = posRec.desc
        posMarker["lat"]   = posRec.pos._lat
        posMarker["lng"]   = posRec.pos._long
        posMarker["photo"] = posRec.photo
        posMarker["refurl"]  = posRec.refurl
        
        posMarker["created-at"]  = cyear + "/" + cmonth + "/" + cday
        posMarker["updated-at"]  = uyear + "/" + umonth + "/" + uday
        
        posMarkers.push(posMarker)
      })

      commit('setPosMarkers',posMarkers)
    },

    //---------------------------
    // Search Pos
    //---------------------------
    async SearchPos({commit}, inputStr)
    {
      let self = this

      let req = {
        url : "",
        header : null
      }
      req.url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputStr + "&key=" + process.env.VUE_APP_MAP_API_KEY

      let posRes = await this.dispatch('restcall/RestGet', req)
      if(posRes.status == 200 && posRes.data.status == "OK")
      {
        commit('setPosSearch',{lat:posRes.data.results[0].geometry.location.lat, lng:posRes.data.results[0].geometry.location.lng})
      }
      else
      {
        this.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:inputStr + " が見つかりません。"})
      }
    },

    //---------------------------
    // InsertPos
    //---------------------------    
    async InsertPos({commit}, posObj)
    {
      let user = this.getters['firebaseCommon/userInfo']
      let db = firebase.firestore()
      let self = this
      
      db.collection("PhotoLog").doc(user.uid).collection("Log").doc().set(posObj)
      .then(function (docRef) {
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"登録しました。"})
      })
      .catch(function (error) {
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"登録に失敗しました。\n" + error.code + "\n" + error.message})
      });

    }


  },
  modules: {
    widget,
    restcall,
    firebaseCommon,
    migrate
  }
})
