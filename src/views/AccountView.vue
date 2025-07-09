<script>
import { ref, inject, onMounted } from 'vue';
import DepositModal from '../components/modals/DepositModal.vue';
import WithdrawModal from '../components/modals/WithdrawModal.vue';

export default {
  name: 'AccountView',
  components: {
    DepositModal,
    WithdrawModal,
  },
  setup() {
    // --- DEPENDENCY INJECTIONS ---
    const statement = inject('accountStatement');
    const makeDeposit = inject('makeDeposit');
    const makeWithdrawal = inject('makeWithdrawal');
    const fetchAccountStatement = inject('fetchAccountStatement');

    // --- LIFECYCLE HOOKS ---
    onMounted(() => {
      fetchAccountStatement();
    });

    // --- LOCAL STATE ---
    const isDepositModalVisible = ref(false);
    const isWithdrawModalVisible = ref(false);

    // --- UI CONTROL METHODS ---
    const openDepositModal = () => (isDepositModalVisible.value = true);
    const closeDepositModal = () => (isDepositModalVisible.value = false);
    const openWithdrawModal = () => (isWithdrawModalVisible.value = true);
    const closeWithdrawModal = () => (isWithdrawModalVisible.value = false);

    // --- EVENT HANDLERS ---
    const handleDeposit = (payload) => {
      makeDeposit(payload);
    };
    const handleWithdraw = (payload) => {
      makeWithdrawal(payload);
    };

    // --- HELPER / FORMATTER FUNCTIONS ---
    function formatDateTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleString('pt-BR');
    }
    function formatCurrency(value) {
      const formattedValue = Math.abs(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return value < 0 ? `-${formattedValue}` : `+${formattedValue}`;
    }
    function formatBalance(value) {
      if (value === undefined || value === null) return '';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return {
      statement,
      isDepositModalVisible,
      isWithdrawModalVisible,
      openDepositModal,
      closeDepositModal,
      openWithdrawModal,
      closeWithdrawModal,
      handleDeposit,
      handleWithdraw,
      formatCurrency,
      formatBalance,
      formatDateTime,
    };
  },
};
</script>

<template>
  <section id="conta-corrente-page">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">Extrato da Conta Corrente</h4>
      </div>
      <div class="card-body">
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-primary" @click="openDepositModal">Fazer Depósito</button>
          <button class="btn btn-warning" @click="openWithdrawModal">Fazer Retirada</button>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Data/Hora</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th class="text-end">Valor</th>
                <th class="text-end">Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in statement.transactions" :key="tx.id">
                <td>{{ formatDateTime(tx.dataHora) }}</td>
                <td>{{ tx.descricao }}</td>
                <td>
                  <span class="badge" :class="tx.tipo === 'deposito' ? 'bg-success' : 'bg-danger'">
                    {{ tx.tipo }}
                  </span>
                </td>
                <td class="text-end" :class="tx.tipo === 'deposito' ? 'variation-positive' : 'variation-negative'">
                  {{ formatCurrency(Number(tx.tipo === 'deposito' ? tx.valor:-tx.valor)) }}
                </td>
                <td class="text-end fw-bold">
                  {{ formatBalance(Number(tx.saldoApos)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer text-end">
        <h5 class="mb-0">
          Saldo Atual:
          <span class="fw-bold">{{ formatBalance(statement.balance) }}</span>
        </h5>
      </div>
    </div>
  </section>

  <DepositModal v-if="isDepositModalVisible" @closed="closeDepositModal" @deposit-confirmed="handleDeposit" />
  <WithdrawModal v-if="isWithdrawModalVisible" @closed="closeWithdrawModal" @withdraw-confirmed="handleWithdraw" />
</template>
