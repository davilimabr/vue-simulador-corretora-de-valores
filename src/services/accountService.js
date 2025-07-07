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
  async getStatement() {
    const token = localStorage.getItem('token');
    return request(`${API}/account/statement`, {
      headers: {
        Authorization: token
      }
    });
  },

  async deposit(descricao, valor) {
    const token = localStorage.getItem('token');
    return request(`${API}/account/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ descricao, valor })
    });
  },

  async withdraw(descricao, valor) {
    const token = localStorage.getItem('token');
    return request(`${API}/account/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ descricao, valor })
    });
  }
};
