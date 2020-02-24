import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    displayControl:{
      showAsFull : null
    },

    // poslMakers
    posMarkers : []
    // posMarkers : [
    //   {
    //     name:"六義園",
    //     desc:"2019.12.01",
    //     lat:35.7331093,
    //     lng:139.7464807,
    //     photo:"https://dl.dropboxusercontent.com/s/txvqb0jq9vnpa3s/rikugien.jpg",
    //     refurl:"https://shunya-wisteria.tumblr.com/post/189526513968/2019%E5%85%AD%E7%BE%A9%E5%9C%92pn1"
    //   },
    //   {
    //     name:"清澄庭園",
    //     desc:"2019.12.01",
    //     lat:35.6806762,
    //     lng:139.7978044,
    //     photo:"https://dl.dropboxusercontent.com/s/pqktphdce4d9ylp/IMG_2473.JPG",
    //     refurl:"https://shunya-wisteria.tumblr.com/post/189526513968/2019%E5%85%AD%E7%BE%A9%E5%9C%92pn1"
    //   }
    // ]
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
        let cd     = new Date(posRec["created-at"].seconds * 1000)
        let cyear  = cd.getFullYear()
        let cmonth = (`0${cd.getMonth() + 1}`).slice(-2)
        let cday   = (`0${cd.getDate()}`).slice(-2)

        let ud     = new Date(posRec["updated-at"].seconds * 1000)
        let uyear  = ud.getFullYear()
        let umonth = (`0${ud.getMonth() + 1}`).slice(-2)
        let uday   = (`0${ud.getDate()}`).slice(-2)

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
  }
})
