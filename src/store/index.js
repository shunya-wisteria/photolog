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
      showAsFull : null,
      showRefUrl : null,
      loading    : false,
      showSearch : true
    },

    // poslMakers
    posMarkers : [],
    posData : {},

    // pos search
    posSearch : null
  },

  getters:{
    ShowAsFull(state)
    {
      return state.displayControl.showAsFull
    },

    ShowRefUrl(state)
    {
      return state.displayControl.showRefUrl
    },

    ShowSearch(state)
    {
      return state.displayControl.showSearch
    },

    Loading(state)
    {
      return state.displayControl.loading
    },

    PosMarkers(state)
    {
      return state.posMarkers
    },

    PosData(state)
    {
      return state.posData
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

    setShowRefUrl(state,payload)
    {
      state.displayControl.showRefUrl = payload
    },
    
    setShowSearch(state, payload)
    {
      state.displayControl.showSearch = payload
    },

    setLoading(state,payload)
    {
      state.displayControl.loading = payload
    },

    setPosMarkers(state, payload)
    {
      state.posMarkers = payload
    },

    setPosData(state, payload)
    {
      state.posData = payload
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
      commit('setLoading',true)

      let posMarkers = []

      let db = firebase.firestore()
      let posDataList = (await db.collection("PhotoLog").doc(uid).collection("Log").get()).docs
      posDataList.forEach(function(posData){
        let posRec = posData.data()

        // format datetime
        let cyear   = '0000'
        let cmonth  = '00'
        let cday    = '00'
        let uyear   = '0000'
        let umonth  = '00'
        let uday    = '00'

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
        posMarker["id"]    = posData.id
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

      posMarkers.sort(function(a,b){
        if(a["created-at"] > b["created-at"]) return -1
        if(a["created-at"] < b["created-at"]) return 1
        return 0;
      })

      commit('setPosMarkers',posMarkers)
      commit('setLoading',false)
    },

    //---------------------------
    // Read Own PosData from Firebase
    //---------------------------
    async GetMyPosData({commit})
    {
      let self = this
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          self.dispatch('GetPosData', user.uid)
        }
      });
    },

    //---------------------------
    // Read Single PosData from Firebase
    //---------------------------
    async GetPosDataSingle({commit}, id)
    {
      let self = this
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          
          commit('setLoading',true)
          let db = firebase.firestore()
          let posData = await(await (db.collection("PhotoLog").doc(user.uid).collection("Log").doc(id).get())).data()

          posData["id"] = id

          commit('setPosData', posData)

          commit('setLoading', false)
        }
      });
    },

    SetPosData({commit},value)
    {
      commit('setPosData', value)
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
    async InsertPos({commit}, args)
    {
      commit('setLoading',true)

      let user = this.getters['firebaseCommon/userInfo']
      let db = firebase.firestore()
      let self = this
      
      // 画像あり
      if(args.insImg != null)
      {
        // ファイルアップロード
        let uploads = [];
        let reg = /(.*)(?:\.([^.]+$))/
        let date = new Date()
        let fileName = args.insImg.name.match(reg)[1]
        let suffix   = args.insImg.name.match(reg)[2]
        fileName = fileName + "_" + date.getTime() + "." + suffix

        let storageRef = firebase.storage().ref('photolog/' + user.uid + '/' + fileName);
        uploads.push(storageRef.put(args.insImg));

        Promise.all(uploads).then(function () {
          let pathReference = firebase.storage().ref('photolog/' + user.uid + '/' + fileName);

          pathReference.getDownloadURL().then(function(url) {
              args.insObj.photo = url

              // DB登録
              db.collection("PhotoLog").doc(user.uid).collection("Log").doc().set(args.insObj)
              .then(function (docRef) {
                self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"登録しました。"})
                commit('setLoading',false)
              })
              .catch(function (error) {
                commit('setLoading',false)
                console.log("errorCode:" + error.code)
                console.log("errorMSG:" + error.message)
                self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"登録に失敗しました。\n" + error.code + "\n" + error.message})
              });
          })
        })

        return
      }

      // 画像なし
      db.collection("PhotoLog").doc(user.uid).collection("Log").doc().set(args.insObj)
      .then(function (docRef) {
        commit('setLoading',false)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"登録しました。"})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"登録に失敗しました。\n" + error.code + "\n" + error.message})
      });

    },

    //---------------------------
    // UpdatePos
    //---------------------------    
    async UpdatePos({commit}, args)
    {
      commit('setLoading',true)

      let user = this.getters['firebaseCommon/userInfo']
      let db = firebase.firestore()
      let self = this

      // 画像あり
      if(args.img != null)
      {
        // ファイルアップロード
        let uploads = [];
        let reg = /(.*)(?:\.([^.]+$))/
        let date = new Date()
        let fileName = args.img.name.match(reg)[1]
        let suffix   = args.img.name.match(reg)[2]
        fileName = fileName + "_" + date.getTime() + "." + suffix

        let storageRef = firebase.storage().ref('photolog/' + user.uid + '/' + fileName);
        uploads.push(storageRef.put(args.img));

        Promise.all(uploads).then(function () {
          let pathReference = firebase.storage().ref('photolog/' + user.uid + '/' + fileName);

          pathReference.getDownloadURL().then(function(url) {
            args.photo = url

            // DB更新
            db.collection("PhotoLog").doc(user.uid).collection("Log").doc(args.id).set(
              {
                name : args.name,
                desc : args.desc,
                refurl: args.refurl,
                photo: args.photo,
                pos:{
                  _lat : args.pos._lat,
                  _long: args.pos._long
                },
                'created-at' : args['created-at'],
                'updated-at' : args['updated-at']
              }
            )
            .then(function(docRef){
              commit('setLoading',false)
              self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"更新しました。"})
            })
            .catch(function (error) {
              commit('setLoading',false)
              console.log("errorCode:" + error.code)
              console.log("errorMSG:" + error.message)
              self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"更新に失敗しました。\n" + error.code + "\n" + error.message})
            });
          })
        })

        return
      }

      // DB更新
      db.collection("PhotoLog").doc(user.uid).collection("Log").doc(args.id).set(
        {
          name : args.name,
          desc : args.desc,
          refurl: args.refurl,
          photo: args.photo,
          pos:{
            _lat : args.pos._lat,
            _long: args.pos._long
          },
          'created-at' : args['created-at'],
          'updated-at' : args['updated-at']
        }
      )
      .then(function(docRef){
        commit('setLoading',false)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"更新しました。"})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"更新に失敗しました。\n" + error.code + "\n" + error.message})
      });
    },

    //---------------------------
    // DeletePos
    //---------------------------   
    async DeletePos({commit}, id)
    {
      commit('setLoading',true)

      let user = this.getters['firebaseCommon/userInfo']
      let db = firebase.firestore()
      let self = this

      db.collection("PhotoLog").doc(user.uid).collection("Log").doc(id).delete()
      .then(function(docRef){
        commit('setLoading',false)
        router.push({name : 'home'})
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:"削除しました。"})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:"削除に失敗しました。\n" + error.code + "\n" + error.message})
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
