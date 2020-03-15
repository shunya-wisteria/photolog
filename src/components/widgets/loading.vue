<template>
  <transition name="loading">
    <div class="loading-mask">
        <div class="loading-wrapper">
          <div class="loading-container">
              <img src="@/assets/loading.gif" class="loading">
          </div>
        </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Loading"
  }
</script>


<style scoped>
  img.loading
  {
    width:40px;
    height: 40px;
    object-fit: cover;
    margin-top:10px;
    margin-right:10px;
  }

 .loading-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    background-color: rgba(255, 255, 255, .5);
    display: table;
    transition: opacity .3s ease;
  }
  
  .loading-wrapper {
    display: table-cell;
    vertical-align: top;
    float: right;
  }
  
  .loading-container {
    /* width: 80%;
    max-width: 256px;
    margin: 0px auto;
    margin-top: -20%; */
    transition: all .3s ease;
  }
  
  .loading-enter {
    opacity: 0;
  }
  
  .loading-leave-active {
    opacity: 0;
  }
  
  .loading-enter .loading-container,
  .loading-leave-active .loading-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>