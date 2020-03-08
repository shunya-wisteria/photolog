export const widget = {
    namespaced : true,

    state:{
        modalDialog:{
            enabled : false,
            title   : "",
            body    : ""
        }
    },

    getters:{
        ModalDialog(state)
        {
            return state.modalDialog
        }

    },

    mutations:{
        setModalDialog(state, payload)
        {
            state.modalDialog = payload
        }
    },

    actions:{
        SetModalMsg({commit}, msg)
        {
            commit('setModalDialog',{enabled:msg.enabled, title:msg.title, body:msg.body})
        },

        CloseModal({commit})
        {
            commit('setModalDialog',{enabled:false, title:this.modalDialog.title, msg:this.modalDialog.title})
        }
    }   
}