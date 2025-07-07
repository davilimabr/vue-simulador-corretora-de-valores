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
  async getWallet() {
    const token = localStorage.getItem('token');
    return request(`${API}/wallet`, {
      headers: {
        Authorization: token,
      },
    });
  },
};
