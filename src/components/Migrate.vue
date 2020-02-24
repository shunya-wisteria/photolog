<template>
    <section>
        <div>migrate</div>
    </section>
</template>

<script>
export default {
    mounted:async function(){
        console.log("call migrate method")
        await this.$store.dispatch('migrate/InsertDB')
        console.log("end migrate method")
    }
}
</script>
