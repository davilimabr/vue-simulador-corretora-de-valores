<script>
import { ref, reactive, inject } from 'vue';
import authService from '../services/authService';

export default {
  name: 'AuthView',
  setup() {
    // --- DEPENDENCY INJECTIONS ---
    const loginFn = inject('login');

    // --- LOCAL STATE ---
    const activeTab = ref('login');
    const tokenSent = ref(false);
    const loginForm = reactive({ email: '', password: '' });
    const registerForm = reactive({ email: '', password: '' });
    const recoverForm = reactive({ email: '' });
    const resetForm = reactive({ token: '', newPassword: '' });

    // --- EVENT HANDLERS ---
    const handleLogin = async () => {
      try {
        const response = await authService.login(loginForm.email, loginForm.password);
        const data = await response.json();

        console.log('Resposta do Login:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Falha no login');
        }

        loginFn({ email: loginForm.email, ...data });
      } catch (error) {
        console.error('Erro no Login:', error);
        alert(error.message);
      }
    };

    const handleRegister = async () => {
      try {
        const response = await authService.register(registerForm.email, registerForm.password);
        const data = await response.json();

        console.log('Resposta do Cadastro:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Falha no cadastro');
        }
        alert(data.message);
        activeTab.value = 'login';
      } catch (error) {
        console.error('Erro no Cadastro:', error);
        alert(error.message);
      }
    };

    const handleRequestToken = async () => {
      try {
        const response = await authService.requestPasswordReset(recoverForm.email);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao solicitar token.');

        alert(data.message);
        tokenSent.value = true;
      } catch (error) {
        console.error('Erro na solicitação de token:', error);
        alert(error.message);
      }
    };

    const handleResetPassword = async () => {
      try {
        const payload = {
          email: recoverForm.email, // Usa o email do formulário anterior
          token: resetForm.token,
          novaSenha: resetForm.newPassword,
        };
        const response = await authService.resetPassword(payload);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao redefinir senha.');

        alert(data.message);

        // Reseta o estado e volta para a tela de login
        tokenSent.value = false;
        activeTab.value = 'login';
        recoverForm.email = '';
        resetForm.token = '';
        resetForm.newPassword = '';
      } catch (error) {
        console.error('Erro na redefinição de senha:', error);
        alert(error.message);
      }
    };

    return {
      activeTab,
      loginForm,
      registerForm,
      handleLogin,
      handleRegister,
      handleRequestToken,
      handleResetPassword,
      tokenSent,
      recoverForm,
      resetForm,
    };
  },
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}
</style>

<template>
  <div class="auth-wrapper">
    <div class="card" style="width: 25rem">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'login' }" @click.prevent="activeTab = 'login'" href="#"
              >Login</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'register' }"
              @click.prevent="activeTab = 'register'"
              href="#"
              >Cadastrar</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'recover' }"
              @click.prevent="activeTab = 'recover'"
              href="#"
              >Recuperar Senha</a
            >
          </li>
        </ul>
      </div>
      <div class="card-body">
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
          <h5 class="card-title">Acessar sua Conta</h5>
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="loginEmail" v-model="loginForm.email" required />
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label">Senha</label>
            <input type="password" class="form-control" id="loginPassword" v-model="loginForm.password" required />
          </div>
          <button type="submit" class="btn btn-primary">Entrar</button>
        </form>

        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister">
          <h5 class="card-title">Crie sua Conta</h5>
          <input type="email" class="form-control mb-3" placeholder="Email" v-model="registerForm.email" required />
          <input type="password" class="form-control" placeholder="Senha" v-model="registerForm.password" required />
          <button type="submit" class="btn btn-primary mt-3">Criar Conta</button>
        </form>

        <div v-if="activeTab === 'recover'">
          <form @submit.prevent="handleRequestToken">
            <h5 class="card-title">Recuperar Senha</h5>
            <p class="card-text text-muted small">Insira seu email para receber o token de redefinição.</p>
            <div class="mb-3">
              <label for="recoverEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="recoverEmail" v-model="recoverForm.email" required />
            </div>
            <button type="submit" class="btn btn-primary">Enviar Token</button>
            <p v-if="tokenSent" class="text-success">Token enviado com sucesso</p>
          </form>

          <form @submit.prevent="handleResetPassword">
            <p class="card-text text-muted small mt-4">Já enviou o token? Insira o token recebido no seu email.</p>
            <div class="mb-3">
              <label for="resetToken" class="form-label">Token</label>
              <input type="text" class="form-control" id="resetToken" v-model="resetForm.token" required />
            </div>
            <div class="mb-3">
              <label for="resetPassword" class="form-label">Nova Senha</label>
              <input type="password" class="form-control" id="resetPassword" v-model="resetForm.newPassword" required />
            </div>
            <button type="submit" class="btn btn-primary">Trocar Senha</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
