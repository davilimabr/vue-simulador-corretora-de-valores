<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'RemoveStockModal',
  props: {
    stock: Object,
  },
  emits: ['closed', 'remove-confirmed'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;

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

    function confirmRemove() {
      emit('remove-confirmed', props.stock.ticker);
      closeModal();
    }

    return { modalRef, closeModal, confirmRemove };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Remoção</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p v-if="stock">
            Deseja parar de acompanhar a ação <strong class="text-danger">{{ stock.ticker }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="confirmRemove">Confirmar Remoção</button>
        </div>
      </div>
    </div>
  </div>
</template>
