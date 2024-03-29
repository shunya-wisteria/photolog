import firebase from 'firebase/compat/app'

export const migrate = {
    namespaced : true,

    state:{
        input : []
    },

    getters:{
        Input(state)
        {
            return state.input
        }
    },

    actions:{
        async InsertDB({commit})
        {
            console.log("in migrate method")

            let inputData = this.getters['migrate/Input']
            console.log(JSON.stringify(inputData))


            let db = firebase.firestore()
            let uid = "fVP6unCetWaz8GXL3xASqeGCAmb2"

            for(let inputObj of inputData)
            {
                let obj = {
                    name : inputObj.name,
                    desc : inputObj.desc,
                    photo : inputObj.photo,
                    refurl : inputObj.refurl,
                    pos : {
                        _lat : inputObj.lat,
                        _long : inputObj.lng
                    }
                }

                console.log("insert " + JSON.stringify(obj))
                db.collection("PhotoLog").doc(uid).collection("Log").doc().set(obj)
            }            

        }
    }
}