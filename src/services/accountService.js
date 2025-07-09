const API = 'https://simulador-corretora-de-valores.onrender.com/api';

async function getStatement(token) {
  return fetch(`${API}/account/statement`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function makeDeposit(payload, token) {
  return fetch(`${API}/account/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      valor: payload.amount,
      descricao: payload.description,
    }),
  });
}

async function makeWithdrawal(payload, token) {
  return fetch(`${API}/account/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      valor: payload.amount,
      descricao: payload.description,
    }),
  });
}

async function getWallet(token) {
  return fetch(`${API}/wallet`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function getBuyOrders(token) {
  return fetch(`${API}/orders/buy`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function getSellOrders(token) {
  return fetch(`${API}/orders/sell`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function createBuyOrder(orderPayload, token) {
  return fetch(`${API}/orders/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });
}

async function createSellOrder(orderPayload, token) {
  return fetch(`${API}/orders/sell`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });
}

export default {
  getStatement,
  makeDeposit,
  makeWithdrawal,
  getWallet,
  getBuyOrders,
  getSellOrders,
  createBuyOrder,
  createSellOrder,
};
