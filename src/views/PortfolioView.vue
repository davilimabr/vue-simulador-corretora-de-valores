<script>
import { computed, ref } from 'vue';
import SellStockModal from '../components/modals/SellStockModal.vue';
import ClockControls from '../components/common/ClockControls.vue';

export default {
  name: 'PortfolioView',
  components: { SellStockModal, ClockControls },
  props: { portfolioItems: Array, time: String },
  emits: ['sell-stock', 'advance-time'],
  setup(props, { emit }) {
    const selectedItemForSell = ref(null);

    const openSellModal = (item) => {
      selectedItemForSell.value = item;
    };

    const handleSellModalClose = () => {
      selectedItemForSell.value = null;
    };

    const handleSell = (payload) => {
      emit('sell-stock', payload);
    };

    function handleAdvance(minutes) {
      emit('advance-time', minutes);
    }

    function calculateProfitLoss(item) {
      return (item.currentPrice - item.averagePrice) * item.quantity;
    }

    const totalProfitLoss = computed(() => {
      return props.portfolioItems.reduce((total, item) => total + calculateProfitLoss(item), 0);
    });

    function formatCurrency(value) {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return {
      selectedItemForSell,
      openSellModal,
      handleSellModalClose,
      handleSell,
      calculateProfitLoss,
      totalProfitLoss,
      formatCurrency,
      handleAdvance,
    };
  },
};
</script>

<template>
  <section id="carteira-page">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Minha Carteira</h4>
        <ClockControls :time="time" @advance-time="handleAdvance" />
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Ticker</th>
                <th>Preço Atual</th>
                <th>Quantidade</th>
                <th>Preço Médio Compra</th>
                <th>Lucro/Prejuízo</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in portfolioItems" :key="item.id">
                <td class="fw-bold">{{ item.ticker }}</td>
                <td>{{ formatCurrency(item.currentPrice) }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.averagePrice) }}</td>
                <td :class="calculateProfitLoss(item) >= 0 ? 'variation-positive' : 'variation-negative'">
                  {{ calculateProfitLoss(item) >= 0 ? '▲' : '▼' }}
                  {{ formatCurrency(Math.abs(calculateProfitLoss(item))) }}
                </td>
                <td class="text-end">
                  <button class="btn btn-danger btn-sm" @click="openSellModal(item)">Vender</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer text-end">
        <h5 class="mb-0">
          Ganhos/Perdas Totais:
          <span :class="totalProfitLoss >= 0 ? 'variation-positive' : 'variation-negative'">
            {{ formatCurrency(totalProfitLoss) }}
          </span>
        </h5>
      </div>
    </div>
  </section>
  <SellStockModal
    v-if="selectedItemForSell"
    :portfolio-item="selectedItemForSell"
    @closed="handleSellModalClose"
    @sell-confirmed="handleSell"
  />
</template>
