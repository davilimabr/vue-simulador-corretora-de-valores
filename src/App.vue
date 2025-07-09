<script>
import './style.css';
import { ref, provide, watch } from 'vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import ChangePasswordModal from './components/modals/ChangePasswordModal.vue';

// Importe os novos composables
import { useAuth } from './composables/useAuth';
import { useMarket } from './composables/useMarket';
import { useAccount } from './composables/useAccount';

export default {
  name: 'App',
  components: { TheNavbar, ChangePasswordModal },
  setup() {
    // --- COMPOSABLES ---
    const { user, login, logout, handleChangePassword, checkUserSession } = useAuth();
    const {
      simulationTime,
      marketStocks,
      availableToAddStocks,
      fetchWatchlist,
      addStockToMarket,
      removeStockFromMarket,
      advanceSimulationTime,
      moveStock,
      clearMarketData,
    } = useMarket(user);
    const {
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
      clearAccountData,
    } = useAccount(user);

    // --- UI STATE & METHODS ---
    const isChangePasswordModalVisible = ref(false);
    const openChangePasswordModal = () => (isChangePasswordModalVisible.value = true);
    const closeChangePasswordModal = () => (isChangePasswordModalVisible.value = false);

    // --- WATCHERS & LIFECYCLE ---
    watch(
      () => user.token,
      (newToken) => {
        if (newToken) {
          // Busca todos os dados quando o usuário loga
          fetchWatchlist();
          fetchAccountStatement();
          fetchPortfolioData();
        } else {
          // Limpa os dados quando o usuário desloga
          clearMarketData();
          clearAccountData();
        }
      },
      { immediate: true } // `immediate` garante que rode na inicialização
    );

    // --- INITIAL EXECUTION ---
    checkUserSession(); // Verifica se já existe uma sessão no localStorage

    // --- PROVIDE (disponibiliza tudo para os componentes filhos) ---
    // A interface (nomes) para os componentes filhos permanece a mesma!
    provide('user', user);
    provide('login', login);
    provide('logout', logout);

    provide('simulationTime', simulationTime);
    provide('marketStocks', marketStocks);
    provide('availableToAddStocks', availableToAddStocks);
    provide('addStockToMarket', addStockToMarket);
    provide('removeStockFromMarket', removeStockFromMarket);
    provide('advanceSimulationTime', advanceSimulationTime);
    provide('fetchWatchlist', fetchWatchlist);
    provide('moveStock', moveStock);

    provide('portfolioData', portfolioData);
    provide('buyOrders', buyOrders);
    provide('sellOrders', sellOrders);
    provide('accountStatement', accountStatement);
    provide('buyStock', buyStock);
    provide('sellStock', sellStock);
    provide('makeDeposit', makeDeposit);
    provide('makeWithdrawal', makeWithdrawal);
    provide('fetchPortfolioData', fetchPortfolioData);
    provide('fetchAccountStatement', fetchAccountStatement);

    provide('openChangePasswordModal', openChangePasswordModal);

    // Retorna apenas o que o template do App.vue precisa
    return {
      user,
      isChangePasswordModalVisible,
      closeChangePasswordModal,
      handleChangePassword,
    };
  },
};
</script>

<template>
  <TheNavbar :user="user" />

  <main class="container mt-4">
    <router-view />
  </main>

  <ChangePasswordModal
    v-if="isChangePasswordModalVisible"
    @closed="closeChangePasswordModal"
    @change-password-confirmed="handleChangePassword"
  />
</template>
