<script>
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BuyStockModal from '../components/modals/BuyStockModal.vue';
import AddStockModal from '../components/modals/AddStockModal.vue';
import RemoveStockModal from '../components/modals/RemoveStockModal.vue';
import ClockControls from '../components/common/ClockControls.vue';

export default {
  name: 'MarketView',
  components: { BuyStockModal, AddStockModal, RemoveStockModal, ClockControls },
  setup() {
    // --- INITIALIZATION ---
    const router = useRouter();

    // --- DEPENDENCY INJECTIONS ---
    const stocks = inject('marketStocks');
    const time = inject('simulationTime');
    const availableStocks = inject('availableToAddStocks');
    const buyStock = inject('buyStock');
    const addStockToMarket = inject('addStockToMarket');
    const removeStockFromMarket = inject('removeStockFromMarket');
    const advanceTime = inject('advanceSimulationTime');
    const fetchWatchlist = inject('fetchWatchlist');
    const moveStock = inject('moveStock');

    // --- LIFECYCLE HOOKS ---
    onMounted(() => {
      fetchWatchlist();
    });

    // --- LOCAL STATE ---
    const selectedStockForBuy = ref(null);
    const isAddModalVisible = ref(false);
    const selectedStockForRemove = ref(null);
    const stockToMove = ref(null);

    // --- UI CONTROL METHODS ---
    const openBuyModal = (stock) => (selectedStockForBuy.value = stock);
    const handleBuyModalClose = () => (selectedStockForBuy.value = null);
    const handleBuy = async (payload) => {
      const success = await buyStock(payload);
      handleBuyModalClose();
      if (success) {
        router.push('/portfolio');
      }
    };
    const openAddModal = () => (isAddModalVisible.value = true);
    const handleAddModalClose = () => (isAddModalVisible.value = false);
    const openRemoveModal = (stock) => (selectedStockForRemove.value = stock);
    const handleRemoveModalClose = () => (selectedStockForRemove.value = null);
    const getMoveButtonClass = (stock) => {
      if (!stockToMove.value) {
        return 'btn-success';
      }
      if (stock.ticker === stockToMove.value.ticker) {
        return 'btn-secondary disabled';
      }
      return 'btn-warning';
    };

    // --- EVENT HANDLERS ---
    const handleAddStock = (ticker) => addStockToMarket(ticker);
    const handleRemoveStock = (stock) => removeStockFromMarket(stock);
    const handleAdvanceTime = (minutes) => advanceTime(minutes);
    const handleMoveClick = async (clickedStock) => {
      if (!stockToMove.value) {
        stockToMove.value = clickedStock;
        return;
      }
      if (stockToMove.value.ticker === clickedStock.ticker) {
        stockToMove.value = null;
        return;
      }
      await moveStock(stockToMove.value.ticker, clickedStock.ticker);
      stockToMove.value = null;
    };

    // --- HELPER / FORMATTER FUNCTIONS ---
    function formatCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    return {
      stocks,
      time,
      availableStocks,
      buyStock,
      addStockToMarket,
      removeStockFromMarket,
      advanceTime,
      stockToMove,
      handleMoveClick,
      getMoveButtonClass,
      formatCurrency,
      selectedStockForBuy,
      openBuyModal,
      handleBuyModalClose,
      handleBuy,
      handleAdvanceTime,
      isAddModalVisible,
      openAddModal,
      handleAddModalClose,
      handleAddStock,
      selectedStockForRemove,
      openRemoveModal,
      handleRemoveModalClose,
      handleRemoveStock,
    };
  },
};
</script>
<template>
  <section id="mercado-page">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Cotações do Mercado</h4>
        <ClockControls :time="time" @advance-time="handleAdvanceTime" />
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Ticker</th>
                <th>Preço</th>
                <th>Variação $</th>
                <th>Variação %</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in stocks" :key="stock.ticker">
                <td class="fw-bold">{{ stock.ticker }}</td>
                <td :class="{ 'flash-update': stock.justUpdated }">
                  {{ formatCurrency(stock.precoAtual) }}
                </td>
                <td
                  :class="
                    stock.variacaoNominal >= 0.001
                      ? 'variation-positive'
                      : stock.variacaoNominal <= -0.001
                      ? 'variation-negative'
                      : 'variation-neutral'
                  "
                >
                  {{ stock.variacaoNominal >= 0.001 ? '▲' : stock.variacaoNominal <= -0.001 ? '▼' : '' }}
                  {{ formatCurrency(stock.variacaoNominal) }}
                </td>
                <td
                  :class="
                    stock.variacaoPercentual >= 0.001
                      ? 'variation-positive'
                      : stock.variacaoPercentual <= -0.001
                      ? 'variation-negative'
                      : 'variation-neutral'
                  "
                >
                  {{ stock.variacaoPercentual >= 0.001 ? '▲' : stock.variacaoPercentual <= -0.001 ? '▼' : '' }}
                  {{ stock.variacaoPercentual.toFixed(2) }}%
                </td>
                <td class="text-end">
                  <button class="btn btn-success btn-sm" @click="openBuyModal(stock)">Comprar</button>
                  <button class="btn btn-outline-danger btn-sm ms-2" @click="openRemoveModal(stock)">Remover</button>
                  <button class="btn btn-sm ms-2" :class="getMoveButtonClass(stock)" @click="handleMoveClick(stock)">
                    ⇄
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary mt-3" @click="openAddModal">Adicionar Ação</button>
      </div>
    </div>
  </section>

  <BuyStockModal
    v-if="selectedStockForBuy"
    :stock="selectedStockForBuy"
    @closed="handleBuyModalClose"
    @buy-confirmed="handleBuy"
  />
  <AddStockModal
    v-if="isAddModalVisible"
    :available-stocks="availableStocks"
    @closed="handleAddModalClose"
    @stock-add="handleAddStock"
  />
  <RemoveStockModal
    v-if="selectedStockForRemove"
    :stock="selectedStockForRemove"
    @closed="handleRemoveModalClose"
    @remove-confirmed="handleRemoveStock"
  />
</template>
