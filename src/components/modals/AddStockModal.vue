<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'AddStockModal',
  props: {
    availableStocks: Array,
  },
  emits: ['closed', 'stock-add'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;
    const selectedTicker = ref('');

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

    function confirmAdd() {
      if (selectedTicker.value) {
        emit('stock-add', selectedTicker.value);
        closeModal();
      }
    }

    return {
      modalRef,
      selectedTicker,
      closeModal,
      confirmAdd,
    };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Adicionar Ação</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <label for="stockSelect" class="form-label">Selecione o ticker da ação</label>
          <select class="form-select" id="stockSelect" v-model="selectedTicker">
            <option disabled value="">Escolha...</option>
            <option v-for="stock in availableStocks" :key="stock.id" :value="stock.ticker">
              {{ stock.ticker }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="confirmAdd">Adicionar</button>
        </div>
      </div>
    </div>
  </div>
</template>
