<template>
  <div class="auth-container">
    <h2>Redefinir Senha</h2>
    <form @submit.prevent="reset">
      <div class="form-group">
        <label for="token">Token</label>
        <input v-model="tokenRecSenha" id="token" required />
      </div>
      <div class="form-group">
        <label for="novaSenha">Nova Senha</label>
        <input v-model="novaSenha" id="novaSenha" type="password" required />
      </div>
      <button type="submit">Alterar</button>
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

const tokenRecSenha = ref('');
const novaSenha = ref('');
const error = ref('');
const success = ref('');

const reset = async () => {
  error.value = '';
  success.value = '';
  try {
    await authService.resetPassword(tokenRecSenha.value, novaSenha.value);
    success.value = 'Senha alterada com sucesso!';
  } catch (err) {
    error.value = err?.error || 'Erro ao redefinir senha.';
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
