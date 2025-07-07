<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" required />
      </div>
      <button type="submit">Entrar</button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>
    <div class="auth-links">
      <router-link to="/register">Criar conta</router-link> |
      <router-link to="/forgot-password">Esqueci minha senha</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/authService';

const email = ref('');
const senha = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  error.value = '';
  try {
    await authService.login(email.value, senha.value);
    router.push('/app');
  } catch (err) {
    error.value = err?.error || 'Erro ao fazer login.';
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 1rem;
}
.error {
  color: #c00;
  margin-top: 1rem;
}
.auth-links {
  margin-top: 1rem;
  text-align: center;
}
</style>
