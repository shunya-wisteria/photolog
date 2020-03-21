import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            secondary: colors.blue.lighten1,
            accent: colors.orange.accent4,
          },
        },
      },
});
