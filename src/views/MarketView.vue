<script>
import { ref } from 'vue';
import BuyStockModal from '../components/modals/BuyStockModal.vue';
import AddStockModal from '../components/modals/AddStockModal.vue';
import RemoveStockModal from '../components/modals/RemoveStockModal.vue';
import ClockControls from '../components/common/ClockControls.vue';

export default {
  name: 'MarketView',
  components: { BuyStockModal, AddStockModal, RemoveStockModal, ClockControls },
  props: { stocks: Array, time: String, availableStocks: Array },
  emits: ['buy-stock', 'add-stock', 'remove-stock', 'advance-time'],
  setup(props, { emit }) {
    const isAddModalVisible = ref(false);
    const selectedStockForBuy = ref(null);
    const selectedStockForRemove = ref(null);

    function openBuyModal(stock) {
      selectedStockForBuy.value = stock;
    }

    function handleBuyModalClose() {
      selectedStockForBuy.value = null;
    }

    const handleBuy = (payload) => {
      emit('buy-stock', payload);
    };

    function openAddModal() {
      isAddModalVisible.value = true;
    }

    function handleAddModalClose() {
      isAddModalVisible.value = false;
    }

    function handleAddStock(ticker) {
      emit('add-stock', ticker);
    }

    function openRemoveModal(stock) {
      selectedStockForRemove.value = stock;
    }
    function handleRemoveModalClose() {
      selectedStockForRemove.value = null;
    }
    function handleRemoveStock(ticker) {
      emit('remove-stock', ticker);
    }

    function handleAdvance(minutes) {
      emit('advance-time', minutes);
    }

    function formatCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    return {
      formatCurrency,
      selectedStockForBuy,
      openBuyModal,
      handleBuyModalClose,
      handleBuy,
      isAddModalVisible,
      openAddModal,
      handleAddModalClose,
      handleAddStock,
      selectedStockForRemove,
      openRemoveModal,
      handleRemoveModalClose,
      handleRemoveStock,
      handleAdvance,
    };
  },
};
</script>

<template>
  <section id="mercado-page">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Cotações do Mercado</h4>
        <ClockControls :time="time" @advance-time="handleAdvance" />
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
                <td>{{ formatCurrency(stock.price) }}</td>
                <td :class="stock.variationValue >= 0 ? 'variation-positive' : 'variation-negative'">
                  {{ stock.variationValue >= 0 ? '▲' : '▼' }}
                  {{ formatCurrency(stock.variationValue) }}
                </td>
                <td :class="stock.variationPercent >= 0 ? 'variation-positive' : 'variation-negative'">
                  {{ stock.variationPercent >= 0 ? '▲' : '▼' }}
                  {{ stock.variationPercent.toFixed(2) }}%
                </td>
                <td class="text-end">
                  <button class="btn btn-success btn-sm" @click="openBuyModal(stock)">Comprar</button>
                  <button class="btn btn-outline-danger btn-sm ms-2" @click="openRemoveModal(stock)">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary mt-3" @click="openAddModal">Adicionar Ação</button>
      </div>
    </div>
  </section>
  <p>{{}}</p>
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
