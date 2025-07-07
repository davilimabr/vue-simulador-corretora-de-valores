<script>
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'SellStockModal',
  props: {
    portfolioItem: Object,
  },
  emits: ['closed', 'sell-confirmed'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;

    const quantityToSell = ref(1);

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

    function confirmSell() {
      const quantity = parseInt(quantityToSell.value, 10);
      if (quantity > 0 && quantity <= props.portfolioItem.quantity) {
        emit('sell-confirmed', {
          ticker: props.portfolioItem.ticker,
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
      quantityToSell,
      closeModal,
      confirmSell,
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
          <h5 class="modal-title">Ordem de Venda: {{ portfolioItem?.ticker }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>
            Preço atual: <strong class="text-primary">{{ formatCurrency(portfolioItem?.currentPrice) }}</strong>
          </p>
          <p>
            Quantidade em carteira: <strong>{{ portfolioItem?.quantity }}</strong>
          </p>
          <div class="mb-3">
            <label for="sellQuantity" class="form-label">Quantidade para Vender</label>
            <input
              type="number"
              class="form-control"
              id="sellQuantity"
              v-model="quantityToSell"
              min="1"
              :max="portfolioItem?.quantity"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="confirmSell">Confirmar Venda</button>
        </div>
      </div>
    </div>
  </div>
</template>
