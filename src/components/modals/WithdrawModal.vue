<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'WithdrawModal',
  emits: ['closed', 'withdraw-confirmed'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;

    const description = ref('');
    const amount = ref(null);

    onMounted(() => {
      if (modalRef.value) {
        modalInstance = new Modal(modalRef.value);
        modalRef.value.addEventListener('hidden.bs.modal', () => {
          emit('closed');
        });
        modalInstance.show();
      }
    });

    function closeModal() {
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    function confirmWithdraw() {
      if (description.value && amount.value > 0) {
        emit('withdraw-confirmed', {
          description: description.value,
          amount: parseFloat(amount.value),
        });
        closeModal();
      }
    }

    return {
      modalRef,
      description,
      amount,
      closeModal,
      confirmWithdraw,
    };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registrar Retirada</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="withdrawDescription" class="form-label">Descrição</label>
            <input
              type="text"
              class="form-control"
              id="withdrawDescription"
              placeholder="Ex: Pagamento de contas"
              v-model="description"
            />
          </div>
          <div class="mb-3">
            <label for="withdrawValue" class="form-label">Valor</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input
                type="number"
                class="form-control"
                id="withdrawValue"
                placeholder="500.00"
                min="0.01"
                step="0.01"
                v-model="amount"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-warning" @click="confirmWithdraw">Confirmar Retirada</button>
        </div>
      </div>
    </div>
  </div>
</template>
