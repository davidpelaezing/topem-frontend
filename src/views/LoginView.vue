<template>
  <div class="col-12 col-md-4 shadow rounded p-3 mx-auto">
      <h2 class="text-muted text-center">Login</h2>
      <form @submit.prevent="login">
            <div class="mb-3">
                <label for="email">Correo</label>
                <input type="email" v-model="form.email" id="email" class="form-control" placeholder="Correo" required>
            </div>
            <div class="mb-3">
                <label for="password">Contraseña</label>
                <input type="password" v-model="form.password" id="password" class="form-control" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary">
                <div class="spinner-border text-primary" role="status" v-if="cargando">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span v-else>Login</span>
            </button>
      </form>
  </div>
</template>

<script>
import auth from "@/logic/auth";
export default {
  data: () => ({
      form: {
          email: null,
          password: null,
      },
      cargando: false
  }),

  methods: {
    login: async function(){
        try{
            this.cargando = true;
            const response = await auth.login(this.form);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('loggedIn', true);
            window.location.href = "/";
            this.cargando = false;
        }catch(error){
            this.cargando = false;
            this.$toastr.e('Las credenciales no coinciden.');
        }
    }

  }
}
</script>
