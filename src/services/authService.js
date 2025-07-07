const API = 'https://simulador-corretora-de-valores.onrender.com/api';

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
}

export default {
  async login(email, senha) {
    const data = await request(`${API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('ultimaHoraNegociacao', data.ultimaHoraNegociacao);
    return data;
  },

  async register(email, senha) {
    return request(`${API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });
  },

  async logout() {
    const token = localStorage.getItem('token');
    const data = await request(`${API}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('ultimaHoraNegociacao');
    return data;
  },

  async requestResetToken(email) {
    const token = localStorage.getItem('token');

    return request(`${API}/auth/pwd-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(tokenRecSenha, novaSenha) {
    const token = localStorage.getItem('token');

    return request(`${API}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ tokenRecSenha, novaSenha })
    });
  },

  async changePassword(senhaAtual, novaSenha) {
    const token = localStorage.getItem('token');
    return request(`${API}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ senhaAtual, novaSenha })
    });
  }
};
