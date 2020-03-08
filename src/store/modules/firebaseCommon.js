import firebase from 'firebase'

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
                } else {
                    return
                }
            });
        }



        
    }
}