<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow mb-5">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">TOPEM</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Lista</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/crear">Crear</router-link>
            </li>
            <li class="nav-item" v-if="loggedIn">
              <a class="nav-link" href="#" @click.prevent="logout()">Salir</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view/>

  </div>
</template>
<script>
import auth from '@/logic/auth'
export default {

  data: () => ({
    loggedIn: false
  }),

  mounted(){
    this.loggedIn = localStorage.getItem('loggedIn') ? true : false;
  },

  methods:{
    logout: async function(){
      try {
        await auth.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        //this.$router.push('/login');
        window.location.href = "/login";
      } catch (error) {
        this.$toastr.e('Problemas al cerrar la sesion.');
        console.log(error.response)
      }
    }
  }
}
</script>
<style>
