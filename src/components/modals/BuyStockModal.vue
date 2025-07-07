<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'BuyStockModal',
  props: {
    stock: Object,
  },
  emits: ['closed', 'buy-confirmed'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;

    const quantityToBuy = ref(1);

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

    function confirmBuy() {
      const quantity = parseInt(quantityToBuy.value, 10);
      if (quantity > 0 /* todo: validar se saldo suficiente */) {
        emit('buy-confirmed', {
          ticker: props.stock.ticker,
          quantity: quantity,
        });
        closeModal();
      } else {
        alert('Quantidade inválida!');
      }
    }

    function formatCurrency(value) {
      if (typeof value !== 'number') return '';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return {
      modalRef,
      quantityToBuy,
      closeModal,
      confirmBuy,
      formatCurrency,
    };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ordem de Compra: {{ stock?.ticker }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p v-if="stock">
            Preço atual:
            <strong class="text-primary">{{ formatCurrency(stock.price) }}</strong>
          </p>
          <div class="mb-3">
            <label for="buyQuantity" class="form-label">Quantidade</label>
            <!-- <input type="number" class="form-control" id="buyQuantity" value="100" min="1" /> -->
            <input type="number" class="form-control" id="buyQuantity" v-model="quantityToBuy" value="100" min="1" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-success" @click="confirmBuy">Confirmar Compra</button>
        </div>
      </div>
    </div>
  </div>
</template>
