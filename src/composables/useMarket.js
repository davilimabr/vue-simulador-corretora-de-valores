import { ref, reactive, computed } from 'vue';
import marketService from '../services/marketService';

const allPossibleStocks = reactive(['PETR4', 'VALE5', 'COGN3', 'B3SA3', 'MGLU3', 'ITUB4', 'BBAS3']);

export function useMarket(user) {
  const simulationTime = ref('14:00');
  const marketStocks = reactive([]);

  const availableToAddStocks = computed(() => {
    const trackedTickers = new Set(marketStocks.map((s) => s.ticker));
    return allPossibleStocks.filter((s) => !trackedTickers.has(s));
  });

  const fetchWatchlist = async () => {
    if (!user.token) return;
    try {
      const response = await marketService.getWatchlist(user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao buscar watchlist');

      marketStocks.length = 0;
      Object.assign(marketStocks, data.acoes);
      simulationTime.value = data.horaNegociacao;
    } catch (error) {
      console.error(error);
    }
  };

  const addStockToMarket = async (tickerToAdd) => {
    try {
      const response = await marketService.addToWatchlist(tickerToAdd, user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      await fetchWatchlist();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const removeStockFromMarket = async (tickerToRemove) => {
    try {
      const response = await marketService.removeFromWatchlist(tickerToRemove, user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await fetchWatchlist();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const advanceSimulationTime = async (minutes) => {
    try {
      const response = await marketService.advanceClock(minutes, user.token);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao avançar o relógio');
      }
      const updateData = await response.json();
      console.log('Atualização de cotações recebida:', updateData);

      const updates = new Map(updateData.acoes.map((stock) => [stock.ticker, stock]));

      marketStocks.forEach((stock) => {
        if (updates.has(stock.ticker)) {
          const updatedStock = updates.get(stock.ticker);
          stock.precoAtual = updatedStock.precoAtual;
          stock.variacaoNominal = updatedStock.variacaoNominal;
          stock.variacaoPercentual = updatedStock.variacaoPercentual;
          stock.corVariacao = updatedStock.corVariacao;

          stock.justUpdated = true;
          setTimeout(() => {
            stock.justUpdated = false;
          }, 1000);
        }
      });

      simulationTime.value = updateData.novaHoraNegociacao;
    } catch (error) {
      console.log(4);
      console.error(error);
      alert(error.message);
    }
  };

  const moveStock = async (tickerA, tickerB) => {
    try {
      const response = await marketService.moveWatchlistStock(tickerA, tickerB, user.token);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao mover ações.');
      }
      await fetchWatchlist();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const clearMarketData = () => {
    marketStocks.length = 0;
  };

  return {
    simulationTime,
    marketStocks,
    availableToAddStocks,
    fetchWatchlist,
    addStockToMarket,
    removeStockFromMarket,
    advanceSimulationTime,
    moveStock,
    clearMarketData,
  };
}
