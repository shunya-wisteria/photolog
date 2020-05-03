import Vue from 'vue'
import VueI18n from 'vue-i18n'

const messages = require('@/i18n/message.json')

Vue.use(VueI18n)

export default new VueI18n({
    locale: process.env.VUE_APP_LOCALE,
    messages
})