import { reactive, readonly } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const user = reactive({ id: null, email: null, token: null });

export function useAuth() {
  const router = useRouter();

  const login = (userData) => {
    console.log('Login efetuado com sucesso!', userData);
    user.id = userData.userId;
    user.email = userData.email;
    user.token = userData.token;

    localStorage.setItem('user', JSON.stringify(user));
    router.push('/market');
  };

  const logout = async () => {
    try {
      await authService.logout(user.token);
      console.log('Logout efetuado com sucesso no servidor!');
    } catch (error) {
      console.error('Erro no logout do servidor, mas deslogando localmente:', error);
    } finally {
      user.id = null;
      user.email = null;
      user.token = null;
      localStorage.removeItem('user');
      router.push('/auth');
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      const response = await authService.changePassword(payload, user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao alterar a senha.');
      alert(data.message);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert(error.message);
    }
  };

  const checkUserSession = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      user.id = userData.id;
      user.email = userData.email;
      user.token = userData.token;
    }
  };

  return {
    user: readonly(user),
    login,
    logout,
    handleChangePassword,
    checkUserSession,
  };
}
