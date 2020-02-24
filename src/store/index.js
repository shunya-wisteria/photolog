import Vue        from 'vue'
import Vuex       from 'vuex'
import router     from '@/router'
import firebase   from 'firebase'

import {migrate}  from './modules/migrate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    displayControl:{
      showAsFull : null
    },

    // poslMakers
    posMarkers : []
  },

  getters:{
    ShowAsFull(state)
    {
      return state.displayControl.showAsFull
    },

    PosMarkers(state)
    {
      return state.posMarkers
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
    }


  },
  modules: {
    migrate
  }
})
