<script>
import { ref } from 'vue';
import DepositModal from '../components/modals/DepositModal.vue';
import WithdrawModal from '../components/modals/WithdrawModal.vue';

export default {
  name: 'AccountView',
  components: {
    DepositModal,
    WithdrawModal,
  },
  props: {
    statement: Object
  },
  emits: ['make-deposit', 'make-withdrawal'],
  setup(props, { emit }) {
    const isDepositModalVisible = ref(false);
    const isWithdrawModalVisible = ref(false);

    const openDepositModal = () => isDepositModalVisible.value = true;
    const closeDepositModal = () => isDepositModalVisible.value = false;

    const openWithdrawModal = () => isWithdrawModalVisible.value = true;
    const closeWithdrawModal = () => isWithdrawModalVisible.value = false;
    
    const handleDeposit = (payload) => {
      emit('make-deposit', payload);
    };

    const handleWithdraw = (payload) => {
      emit('make-withdrawal', payload);
    };

    function formatCurrency(value) {
      const formattedValue = Math.abs(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return value < 0 ? `-${formattedValue}` : `+${formattedValue}`;
    }

    function formatBalance(value) {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return {
      isDepositModalVisible,
      isWithdrawModalVisible,
      openDepositModal,
      closeDepositModal,
      openWithdrawModal,
      closeWithdrawModal,
      handleDeposit,
      handleWithdraw,
      formatCurrency,
      formatBalance
    };
  }
}

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
                <td>{{ tx.dateTime }}</td>
                <td>{{ tx.description }}</td>
                <td>
                  <span class="badge" :class="tx.type === 'Depósito' ? 'bg-success' : 'bg-danger'">{{ tx.type }}</span>
                </td>
                <td class="text-end" :class="tx.value >= 0 ? 'variation-positive' : 'variation-negative'">
                  {{ formatCurrency(tx.value) }}
                </td>
                <td class="text-end fw-bold">
                  {{ formatBalance(tx.resultingBalance) }}
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
