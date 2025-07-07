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
  async placeBuyOrder(ticker, quantidade, modo = 'mercado') {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ ticker, quantidade, modo }),
    });
  },

  async executeBuyOrder(orderId) {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/buy/${orderId}/execute`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
  },

  async listBuyOrders(status = 'todas') {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/buy?status=${status}`, {
      headers: {
        Authorization: token,
      },
    });
  },

  async placeSellOrder(ticker, quantidade, modo = 'mercado') {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ ticker, quantidade, modo }),
    });
  },

  async executeSellOrder(orderId) {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/sell/${orderId}/execute`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
  },

  async listSellOrders(status = 'todas') {
    const token = localStorage.getItem('token');
    return request(`${API}/orders/sell?status=${status}`, {
      headers: {
        Authorization: token,
      },
    });
  },
};
