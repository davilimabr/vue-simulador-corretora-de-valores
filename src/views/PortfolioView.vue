<script>
import { onMounted, ref, inject } from 'vue';
import SellStockModal from '../components/modals/SellStockModal.vue';
import ClockControls from '../components/common/ClockControls.vue';

export default {
  name: 'PortfolioView',
  components: { SellStockModal, ClockControls },
  setup() {
    // --- DEPENDENCY INJECTIONS ---
    const portfolioData = inject('portfolioData');
    const buyOrders = inject('buyOrders');
    const sellOrders = inject('sellOrders');
    const time = inject('simulationTime');
    const sellStock = inject('sellStock');
    const advanceTime = inject('advanceSimulationTime');
    const fetchPortfolioData = inject('fetchPortfolioData');

    // --- LIFECYCLE HOOKS ---
    onMounted(() => {
      fetchPortfolioData();
    });

    // --- LOCAL STATE ---
    const selectedItemForSell = ref(null);

    // --- UI CONTROL METHODS ---
    const openSellModal = (item) => (selectedItemForSell.value = item);
    const handleSellModalClose = () => (selectedItemForSell.value = null);

    // --- EVENT HANDLERS ---
    const handleSell = (payload) => sellStock(payload);
    const handleAdvanceTime = (minutes) => {
      advanceTime(minutes).then(() => fetchPortfolioData());
    };

    // --- HELPER / FORMATTER FUNCTIONS ---
    function formatCurrency(value) {
      const num = Number(value);
      if (isNaN(num) || num == 0) return '-';
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function getStatusClass(status) {
      if (status === 'executada') return 'bg-success';
      if (status === 'pendente') return 'bg-warning text-dark';
      if (status === 'cancelada') return 'bg-danger';
      return 'bg-secondary';
    }

    return {
      portfolioData,
      buyOrders,
      sellOrders,
      time,
      handleAdvanceTime,
      selectedItemForSell,
      openSellModal,
      handleSellModalClose,
      handleSell,
      formatCurrency,
      getStatusClass,
    };
  },
};
</script>

<template>
  <div>
    <section id="carteira-page" class="mb-4">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Minha Carteira</h4>
          <ClockControls :time="time" @advance-time="handleAdvanceTime" />
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Qtde.</th>
                  <th>Preço Médio</th>
                  <th>Preço Atual</th>
                  <th>Lucro/Prejuízo Total</th>
                  <th class="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in portfolioData.acoesCarteira" :key="item.tickerAcao">
                  <td class="fw-bold">{{ item.tickerAcao }}</td>
                  <td>{{ item.qtde }}</td>
                  <td>{{ formatCurrency(item.precoCompraMedio) }}</td>
                  <td>{{ formatCurrency(item.precoAtual) }}</td>
                  <td
                    :class="
                      item.ganhoPerdaTotal >= 0.001
                        ? 'variation-positive'
                        : item.ganhoPerdaTotal <= -0.001
                        ? 'variation-negative'
                        : 'variation-neutral'
                    "
                  >
                    {{ item.ganhoPerdaTotal >= 0.001 ? '▲' : item.ganhoPerdaTotal <= -0.001 ? '▼' : '▬' }}
                    {{ formatCurrency(Math.abs(item.ganhoPerdaTotal)) }}
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
            <span :class="portfolioData.totalGanhosPerdas >= 0 ? 'variation-positive' : 'variation-negative'">
              {{ formatCurrency(portfolioData.totalGanhosPerdas) }}
            </span>
          </h5>
        </div>
      </div>
    </section>

    <section id="buy-orders-section" class="mb-4">
      <div class="card">
        <div class="card-header"><h5 class="mb-0">Ordens de Compra</h5></div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Qtde</th>
                  <th>Modo</th>
                  <th>Preço Ref.</th>
                  <th>Preço Exec.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in buyOrders" :key="order.id">
                  <td>{{ order.ticker }}</td>
                  <td>{{ order.quantidade }}</td>
                  <td>{{ order.modo }}</td>
                  <td>{{ formatCurrency(order.precoReferencia) }}</td>
                  <td>{{ formatCurrency(order.precoExecucao) }}</td>
                  <td>
                    <span class="badge" :class="getStatusClass(order.status)">{{ order.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section id="sell-orders-section">
      <div class="card">
        <div class="card-header"><h5 class="mb-0">Ordens de Venda</h5></div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Qtde</th>
                  <th>Modo</th>
                  <th>Preço Ref.</th>
                  <th>Preço Exec.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in sellOrders" :key="order.id">
                  <td>{{ order.ticker }}</td>
                  <td>{{ order.quantidade }}</td>
                  <td>{{ order.modo }}</td>
                  <td>{{ formatCurrency(order.precoReferencia) }}</td>
                  <td>{{ formatCurrency(order.precoExecucao) }}</td>
                  <td>
                    <span class="badge" :class="getStatusClass(order.status)">{{ order.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <SellStockModal
      v-if="selectedItemForSell"
      :portfolio-item="selectedItemForSell"
      @closed="handleSellModalClose"
      @sell-confirmed="handleSell"
    />
  </div>
</template>
