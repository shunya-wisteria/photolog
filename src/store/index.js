import Vue        from 'vue'
import Vuex       from 'vuex'
import router     from '@/router'
import firebase   from 'firebase'
import i18n       from '@/i18n';

import {widget}         from './modules/widget'
import {restcall}       from './modules/restcall'
import {firebaseCommon} from './modules/firebaseCommon'
import {migrate}        from './modules/migrate'

import imageCompression from "browser-image-compression";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    displayControl:{
      showAsFull : null,
      loading    : false,
      editModal  : false
    },

    userSettings:{
      refUrlMypage : false,
      refUrlOpen : false
    },

    beforeSearch : "",

    // poslMakers
    posMarkers : [],
    posData : {},

    // pos search
    posSearch : null,
    searchedWord : null
  },

  getters:{
    ShowAsFull(state)
    {
      return state.displayControl.showAsFull
    },

    ShowUserSettings(state)
    {
      return state.userSettings
    },

    Loading(state)
    {
      return state.displayControl.loading
    },

    EditModal(state)
    {
      return state.displayControl.editModal
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
    },
    SearchedWord(state)
    {
      return state.searchedWord
    },

    BeforeSearch(state)
    {
      return state.beforeSearch
    }
  },

  mutations: {
    setShowAsFull(state,payload)
    {
      state.displayControl.showAsFull = payload
    },

    setUserSettings(state, payload)
    {
      state.userSettings = payload
    },

    setLoading(state,payload)
    {
      state.displayControl.loading = payload
    },

    setEditModal(state, payload)
    {
      state.displayControl.editModal = payload
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
    },
    setSearchedWord(state, payload)
    {
      state.searchedWord = payload
    },

    setBeforeSearch(state, payload)
    {
      state.beforeSearch = payload
    }
  },
  actions: {
    SetShowAsFull({commit}, showState)
    {
      commit('setShowAsFull', showState)
    },

    SetBeforeSearch({commit}, path)
    {
      commit('setBeforeSearch', path)
    },

    SetEditModal({commit}, input)
    {
      commit('setEditModal', input)
    },

    SetUserSettings({commit}, input)
    {
      commit('setUserSettings', input)
    },

    SetPosSearch({commit}, input)
    {
      commit('setPosSearch', input)
    },

    //---------------------------
    //  Read User Settings local
    //---------------------------
    async getUserSettings({commit}, uid)
    {
      let db = firebase.firestore()
      let fbUserSettings = (await db.collection("PhotoLog").doc(uid).get()).data()

      let userSettings = 
      {
        refUrlMypage : false,
        refUrlOpen : false
      }

      // MypageのrefUrl
      if(fbUserSettings["refUrlMypage"] != null)
      {
        userSettings.refUrlMypage = fbUserSettings["refUrlMypage"]
      }

      // OpenPageのrefUrl
      {
        userSettings.refUrlOpen = fbUserSettings["refUrlOpen"]
      }

      commit('setUserSettings', userSettings)
    },

    async GetUserSettings({commit})
    {
      commit('setLoading',true)

      let self = this
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          await self.dispatch('getUserSettings', user.uid)
        }
      });

      commit('setLoading',false)
    },

    //---------------------------
    // Save User Settings
    //---------------------------  
    async SaveUserSettings({commit})
    {
      commit('setLoading',true)

      let user = this.getters['firebaseCommon/userInfo']
      let db = firebase.firestore()

      let self = this

      // DB更新
      db.collection("PhotoLog").doc(user.uid).set(
        {
          refUrlMypage : this.state.userSettings.refUrlMypage,
          refUrlOpen : this.state.userSettings.refUrlOpen
        }
      )
      .then(function(docRef){
        commit('setLoading',false)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.compUpdate')})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:i18n.t('message.infoMsg.failUpdate') + "\n" + error.code + "\n" + error.message})
      });
    },

    //---------------------------
    // Read PosData from Firebase
    //---------------------------
    async GetPosData({commit}, uid)
    {
      commit('setLoading',true)

      this.dispatch('getUserSettings', uid)

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
        commit('setSearchedWord', inputStr)
      }
      else
      {
        commit('setSearchedWord', null)
        this.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:inputStr + i18n.t('message.infoMsg.posNotFound') })
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
      
      let input = {
        uid : user.uid,
        db : db,
        args : args
      }

      // 画像あり
      if(args.img != null)
      {
        // 画像upload
        let url = await this.dispatch('firebaseCommon/uploadImg', input)
        if(url == null)
        {
          this.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.failUpdate')})
          return
        }
        args.insObj.photo = url
      }

      // DB登録
      this.dispatch('insertPosDB', input)
      this.dispatch('SetPosSearch', null)
    },

    //---------------------------
    // InsertPosDB(for local use)
    //---------------------------   
    async insertPosDB({commit}, input)
    {
      let args  = input.args
      let db    = input.db
      let self  = this

      db.collection("PhotoLog").doc(input.uid).collection("Log").doc().set(args.insObj)
      .then(function (docRef) {
        commit('setLoading',false)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.compRegister')})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body: i18n.t('message.infoMsg.failRegister') + "\n" + error.code + "\n" + error.message})
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
      // let self = this

      let input = {
        uid : user.uid,
        db : db,
        args : args
      }

      // 画像あり
      if(args.img != null)
      {
        // 画像upload
        let url = await this.dispatch('firebaseCommon/uploadImg', input)
        if(url == null)
        {
          this.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.failUpdate')})
          return
        }
        args.photo = url
      }

      // DB更新
      this.dispatch('updatePosDB', input)
    },

    //---------------------------
    // UpdatePosDB (for local use)
    //--------------------------- 
    async updatePosDB({commit}, input)
    {
      let args  = input.args
      let db    = input.db
      let self  = this

      // DB更新
      db.collection("PhotoLog").doc(input.uid).collection("Log").doc(args.id).set(
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
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.compUpdate')})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:i18n.t('message.infoMsg.failUpdate') + "\n" + error.code + "\n" + error.message})
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
        if(location.pathname != '/')
        {
          router.push({name : 'home'})
        }
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Info", body:i18n.t('message.infoMsg.compDelete')})
      })
      .catch(function (error) {
        commit('setLoading',false)
        console.log("errorCode:" + error.code)
        console.log("errorMSG:" + error.message)
        self.dispatch('widget/SetModalMsg',{enabled:true, title:"Error", body:i18n.t('message.infoMsg.failDelete') + "\n" + error.code + "\n" + error.message})
      });

    },

    //---------------------------
    // 画像サイズ縮小
    //---------------------------  
    async getCompressImageFileAsync({commit}, file)
    {
      const options = {
        maxSizeMB: 1, // 最大ファイルサイズ
        maxWidthOrHeight: 1200 // 最大画像幅もしくは高さ
      }
      try {
        // 圧縮画像の生成
        return await imageCompression(file, options);
      } catch (error) {
        console.error("getCompressImageFileAsync is error", error);
        throw error;
      }
    }

  },
  modules: {
    widget,
    restcall,
    firebaseCommon,
    migrate
  }
})
