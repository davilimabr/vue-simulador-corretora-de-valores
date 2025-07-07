<template>
  <div class="landing">
    <h1>Bem-vindo ao CorretoraSim</h1>
    <p>Para acessar sua conta, realize o login.</p>
    <router-link class="btn btn-primary" to="/login">Entrar</router-link>
  </div>
</template>

<script>
export default {
  name: 'LandingView',
};
</script>

<style scoped>
.landing {
  max-width: 600px;
  margin: 60px auto;
  text-align: center;
}
</style>
