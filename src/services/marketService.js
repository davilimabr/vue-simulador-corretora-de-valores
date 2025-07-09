const API = 'https://simulador-corretora-de-valores.onrender.com/api';

async function getWatchlist(token) {
  return fetch(`${API}/market/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function addToWatchlist(ticker, token) {
  return fetch(`${API}/market/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticker }),
  });
}

async function removeFromWatchlist(assetId, token) {
  return fetch(`${API}/market/watchlist/${assetId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function advanceClock(minutes, token) {
  return fetch(`${API}/market/clock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ incrementoMinutos: minutes }),
  });
}

async function moveWatchlistStock(tickerA, tickerB, token) {
  return fetch(`${API}/market/watchlist/${tickerA}/move`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tickerA, tickerB }),
  });
}

export default { getWatchlist, addToWatchlist, removeFromWatchlist, advanceClock, moveWatchlistStock };
