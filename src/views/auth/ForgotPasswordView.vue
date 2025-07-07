<template>
  <div class="auth-container">
    <h2>Recuperar Senha</h2>
    <form @submit.prevent="requestToken">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <button type="submit">Enviar</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </form>
    <div class="auth-links">
      <router-link to="/login">Voltar para login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '../../services/authService';

const email = ref('');
const error = ref('');
const success = ref('');

const requestToken = async () => {
  error.value = '';
  success.value = '';
  try {
    await authService.requestResetToken(email.value);
    success.value = 'Token enviado para o email informado.';
  } catch (err) {
    error.value = err?.error || 'Erro ao solicitar token.';
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
.success {
  color: #080;
  margin-top: 1rem;
}
.auth-links {
  margin-top: 1rem;
  text-align: center;
}
</style>
