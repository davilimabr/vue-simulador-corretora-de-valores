import { ref, reactive } from 'vue';
import accountService from '../services/accountService';

export function useAccount(user) {
  const portfolioData = ref({ acoesCarteira: [], totalGanhosPerdas: 0 });
  const buyOrders = ref([]);
  const sellOrders = ref([]);
  const accountStatement = reactive({ balance: 0, transactions: [] });

  const fetchAccountStatement = async () => {
    if (!user.token) return;
    try {
      const response = await accountService.getStatement(user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao buscar extrato');

      accountStatement.transactions.length = 0;
      Object.assign(accountStatement.transactions, data);
      accountStatement.balance = data.length > 0 ? parseFloat(data[data.length - 1].saldoApos) : 0;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPortfolioData = async () => {
    if (!user.token) return;
    try {
      const [walletRes, buyOrdersRes, sellOrdersRes] = await Promise.all([
        accountService.getWallet(user.token),
        accountService.getBuyOrders(user.token),
        accountService.getSellOrders(user.token),
      ]);
      if (!walletRes.ok || !buyOrdersRes.ok || !sellOrdersRes.ok) {
        throw new Error('Falha ao buscar dados da carteira.');
      }
      portfolioData.value = await walletRes.json();
      buyOrders.value = await buyOrdersRes.json();
      sellOrders.value = await sellOrdersRes.json();
    } catch (error) {
      console.error(error);
    }
  };

  const buyStock = async (payload) => {
    try {
      const response = await accountService.createBuyOrder(payload, user.token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao criar ordem de compra');
      await Promise.all([fetchPortfolioData(), fetchAccountStatement()]);
      return true;
    } catch (error) {
      console.error(error);
      alert(error.message);
      return false;
    }
  };
  
    const sellStock = async (payload) => {
      try {
        const response = await accountService.createSellOrder(payload, user.token);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao criar ordem de venda');
        alert('Ordem de venda registrada com sucesso!');
        await Promise.all([fetchPortfolioData(), fetchAccountStatement()]);
        return true;
      } catch (error) {
        console.error(error);
        alert(error.message);
        return false;
      }
    };

    const makeDeposit = async (payload) => {
      try {
        const response = await accountService.makeDeposit(payload, user.token);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao registrar depósito');
        await fetchAccountStatement();
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

    const makeWithdrawal = async (payload) => {
      try {
        const response = await accountService.makeWithdrawal(payload, user.token);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao registrar retirada');
        await fetchAccountStatement();
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };
    
    const clearAccountData = () => {
      portfolioData.value = { acoesCarteira: [], totalGanhosPerdas: 0 };
      buyOrders.value = [];
      sellOrders.value = [];
      accountStatement.transactions.length = 0;
      accountStatement.balance = 0;
    };


  return {
    portfolioData,
    buyOrders,
    sellOrders,
    accountStatement,
    fetchAccountStatement,
    fetchPortfolioData,
    buyStock,
    sellStock,
    makeDeposit,
    makeWithdrawal,
    clearAccountData
  };
}
