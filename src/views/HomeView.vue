<script>
import '../style.css';
import { ref, reactive, onMounted } from 'vue';
import TheNavbar from '../components/layout/TheNavbar.vue';
import MarketView from './MarketView.vue';
import PortfolioView from './PortfolioView.vue';
import AccountView from './AccountView.vue';
import marketService from '../services/marketService';
import accountService from '../services/accountService';
import orderService from '../services/orderService';
import walletService from '../services/walletService';

export default {
  name: 'HomeView',
  components: { TheNavbar, MarketView, PortfolioView, AccountView },

  setup() {
    // --- STATE MANAGEMENT ---

    // Controle da página ativa
    const activePage = ref('mercado');

    // --- DADOS SIMULADOS ---

    const user = reactive({
      name: 'Usuário',
    });

    const simulationTime = ref('14:00');

    const marketStocks = reactive([]);

    const availableToAddStocks = reactive([
      { id: 5, ticker: 'MGLU3', price: 2.5, variationValue: 0.1, variationPercent: 4.17 },
      { id: 6, ticker: 'ITUB4', price: 32.15, variationValue: -0.05, variationPercent: -0.16 },
      { id: 7, ticker: 'BBAS3', price: 28.9, variationValue: 0.25, variationPercent: 0.87 },
    ]);

    const portfolio = reactive([]);

    const accountStatement = reactive({
      balance: 0,
      transactions: []
    });

    // --- METHODS ---

    function showPage(page) {
      activePage.value = page;
    }

    async function fetchWatchlist() {
      try {
        const data = await marketService.getWatchlist();
        simulationTime.value = data.horaNegociacao;
        marketStocks.splice(0, marketStocks.length, ...data.acoes.map(mapStock));
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchStatement() {
      try {
        const data = await accountService.getStatement();
        const mapped = data.map(mapTransaction);
        accountStatement.transactions.splice(0, accountStatement.transactions.length, ...mapped);
        accountStatement.balance = mapped.length > 0 ? mapped[mapped.length - 1].resultingBalance : 0;
      } catch (e) {
        console.error(e);
      }
    }

    function mapStock(apiStock) {
      return {
        ticker: apiStock.ticker,
        price: apiStock.precoAtual,
        variationValue: apiStock.variacaoNominal,
        variationPercent: apiStock.variacaoPercentual,
      };
    }

    function mapTransaction(apiTx) {
      return {
        id: apiTx.id,
        dateTime: new Date(apiTx.dataHora).toLocaleString('pt-BR'),
        description: apiTx.descricao,
        type: apiTx.tipo === 'deposito' ? 'Depósito' : 'Retirada',
        value: apiTx.tipo === 'deposito' ? parseFloat(apiTx.valor) : -parseFloat(apiTx.valor),
        resultingBalance: parseFloat(apiTx.saldoApos)
      };
    }

    function mapWalletItem(apiItem, index) {
      return {
        id: index + 1,
        ticker: apiItem.tickerAcao,
        currentPrice: apiItem.precoAtual,
        quantity: apiItem.qtde,
        averagePrice: apiItem.precoCompraMedio,
      };
    }

    async function fetchWallet() {
      try {
        const data = await walletService.getWallet();
        simulationTime.value = data.horaNegociacao;
        const mapped = data.acoesCarteira.map(mapWalletItem);
        portfolio.splice(0, portfolio.length, ...mapped);
      } catch (e) {
        console.error(e);
      }
    }

    async function addStockToMarket(tickerToAdd) {
      try {
        await marketService.addToWatchlist(tickerToAdd);
        await fetchWatchlist();
      } catch (e) {
        console.error(e);
      }
    }

    async function makeDeposit(payload) {
      try {
        await accountService.deposit(payload.description, payload.amount);
        await fetchStatement();
      } catch (e) {
        console.error(e);
      }
    }

    async function makeWithdrawal(payload) {
      try {
        await accountService.withdraw(payload.description, payload.amount);
        await fetchStatement();
      } catch (e) {
        console.error(e);
      }
    }

    async function buyStock(payload) {
      try {
        const order = await orderService.placeBuyOrder(payload.ticker, payload.quantity);
        await orderService.executeBuyOrder(order.id);
        await fetchWallet();
      } catch (e) {
        console.error(e);
      }
    }

    async function sellStock(payload) {
      try {
        const order = await orderService.placeSellOrder(payload.ticker, payload.quantity);
        await orderService.executeSellOrder(order.id);
        await fetchWallet();
      } catch (e) {
        console.error(e);
      }
    }

    async function removeStockFromMarket(tickerToRemove) {
      try {
        await marketService.removeFromWatchlist(tickerToRemove);
        await fetchWatchlist();
      } catch (e) {
        console.error(e);
      }
    }

    async function advanceTime(minutes) {
      try {
        const data = await marketService.advanceClock(minutes);
        simulationTime.value = data.novaHoraNegociacao;
        marketStocks.splice(0, marketStocks.length, ...data.acoes.map(mapStock));
      } catch (e) {
        console.error(e);
      }
    }

   onMounted(() => {
     fetchWatchlist();
     fetchStatement();
      fetchWallet();
   });

    return {
      activePage,
      user,
      simulationTime,
      marketStocks,
      availableToAddStocks,
      portfolio,
      accountStatement,
      showPage,
      addStockToMarket,
      makeDeposit,
      makeWithdrawal,
      buyStock,
      sellStock,
      removeStockFromMarket,
      advanceTime,
    };
  },
};
</script>

<template>
  <TheNavbar :user="user" :active-page="activePage" @navigate="showPage" />

  <main class="container mt-4">
    <MarketView
      v-if="activePage === 'mercado'"
      :stocks="marketStocks"
      :time="simulationTime"
      :available-stocks="availableToAddStocks"
      @buy-stock="buyStock"
      @add-stock="addStockToMarket"
      @remove-stock="removeStockFromMarket"
      @advance-time="advanceTime"
    />
    <PortfolioView
      v-if="activePage === 'carteira'"
      :portfolio-items="portfolio"
      :time="simulationTime"
      @sell-stock="sellStock"
      @advance-time="advanceTime"
    />
    <AccountView
      v-if="activePage === 'conta-corrente'"
      :statement="accountStatement"
      @make-deposit="makeDeposit"
      @make-withdrawal="makeWithdrawal"
    />
  </main>
</template>
