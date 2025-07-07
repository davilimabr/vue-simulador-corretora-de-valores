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
  async advanceClock(incrementoMinutos) {
    const token = localStorage.getItem('token');
    return request(`${API}/market/clock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ incrementoMinutos })
    });
  },

  async addToWatchlist(ticker) {
    const token = localStorage.getItem('token');
    return request(`${API}/market/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ ticker })
    });
  },

  async removeFromWatchlist(ticker) {
    const token = localStorage.getItem('token');
    return request(`${API}/market/watchlist/${ticker}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    });
  },

  async getWatchlist() {
    const token = localStorage.getItem('token');
    return request(`${API}/market/watchlist`, {
      headers: {
        Authorization: token
      }
    });
  }
};
