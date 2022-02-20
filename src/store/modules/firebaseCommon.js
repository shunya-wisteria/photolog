import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

export const firebaseCommon = {
    namespaced : true,

    state:{
        loginState:{
            logined : null
        },

        userInfo:{
            photoURL : null
        }
    },

    getters:{
        loginState(state)
        {
          return state.loginState
        },

        userInfo(state)
        {
            return state.userInfo
        }
    },

    mutations:{
        setLoginState(state, payload)
        {
          state.loginState = payload
        },

        setUserInfo(state, payload)
        {
            state.userInfo = payload
        }
    },

    actions:{
    
        //---------------------------
        // Firebase 認証
        //---------------------------
        async CredentialFirabase({commit})
        {
            let logined = await this.dispatch('firebaseCommon/checkLogined')
            if(logined)
            {
              return
            }

            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
            .then(function(result){
              commit('setLoginState',{logined:true})
            })
            .catch(function(error)
            {
              console.log("errorCode:" + error.code)
              console.log("errorMSG:" + error.message)
            })
        },
        //---------------------------
        // Firebase ログアウト
        //---------------------------
        LogoutFirebase({commit})
        {
            firebase.auth().signOut()
            .then(function(result){
                commit('setLoginState',{logined:false})
            })
            .catch(function(error)
            {
                console.log("errorCode:" + error.code)
                console.log("errorMSG:" + error.message)
            })
        },

        async checkLogined({commit})
        {
            firebase.auth().onAuthStateChanged(async function(user) {
                if (user) {                    
                    commit('setUserInfo', user)
                    commit('setLoginState',{logined:true})
                }
            });
        },

        //---------------------------
        // upload Image to Storage
        //---------------------------        
        async uploadImg({commit}, input)
        {
            let args = input.args
            let db    = input.db
            let self  = this
            let url   = null

            // リサイズ
            let resizedImg = await this.dispatch('getCompressImageFileAsync', args.img)
            if(resizedImg == null)
            {
                return null
            }

            // ファイルアップロード
            try{
                let reg = /(.*)(?:\.([^.]+$))/
                let date = new Date()
                let fileName = args.img.name.match(reg)[1]
                let suffix   = args.img.name.match(reg)[2]
                fileName = fileName + "_" + date.getTime() + "." + suffix

                let storageRef = firebase.storage().ref('photolog/' + input.uid + '/' + fileName);

                await storageRef.put(resizedImg)

                let pathReference = firebase.storage().ref('photolog/' + input.uid + '/' + fileName);
                url = await pathReference.getDownloadURL()
                return url
            }
            catch(error)
            {
                console.error("file upload is error", error);
                throw error;
            }
        }


        
    }
}