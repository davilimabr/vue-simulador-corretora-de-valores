<template>
  <div class="auth-container">
    <h2>Trocar Senha</h2>
    <form @submit.prevent="change">
      <div class="form-group">
        <label for="atual">Senha Atual</label>
        <input v-model="senhaAtual" id="atual" type="password" required />
      </div>
      <div class="form-group">
        <label for="nova">Nova Senha</label>
        <input v-model="novaSenha" id="nova" type="password" required />
      </div>
      <button type="submit">Alterar</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </form>
    <div class="auth-links">
      <router-link to="/app">Voltar</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '../../services/authService';
import { useRouter } from 'vue-router';

const senhaAtual = ref('');
const novaSenha = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();

const change = async () => {
  error.value = '';
  success.value = '';
  try {
    await authService.changePassword(senhaAtual.value, novaSenha.value);
    success.value = 'Senha alterada com sucesso!';
    setTimeout(() => router.push('/app'), 1500);
  } catch (err) {
    error.value = err?.error || 'Erro ao trocar senha.';
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
