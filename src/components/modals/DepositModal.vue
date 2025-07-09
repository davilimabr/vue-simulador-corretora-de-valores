<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'DepositModal',
  emits: ['closed', 'deposit-confirmed'],
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

    function confirmDeposit() {
      if (description.value && amount.value > 0) {
        emit('deposit-confirmed', {
          description: description.value,
          amount: parseFloat(amount.value),
        });
        closeModal();
      }
    }

    return { modalRef, description, amount, closeModal, confirmDeposit };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registrar Depósito</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="depositDescription" class="form-label">Descrição</label>
            <input
              type="text"
              class="form-control"
              id="depositDescription"
              placeholder="Ex: Transferência bancária"
              v-model="description"
            />
          </div>
          <div class="mb-3">
            <label for="depositValue" class="form-label">Valor</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input
                type="number"
                class="form-control"
                id="depositValue"
                placeholder="1000.00"
                min="0.01"
                step="0.01"
                v-model="amount"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="confirmDeposit">Confirmar Depósito</button>
        </div>
      </div>
    </div>
  </div>
</template>
