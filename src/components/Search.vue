<template>
    <section v-on:click="toBack()">
    </section>
</template>

<script>
export default {
    name : "Search",

    computed:{
        beforeSearch:
        {
            get()
            {
                return this.$store.getters.BeforeSearch
            }
        } 
    },

    methods:{
        toBack()
        {
            this.$router.push(this.beforeSearch)
        }
    }
}
</script>