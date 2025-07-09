<script>
import { onMounted, ref, reactive } from 'vue';
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

    const form = reactive({
      quantity: 1,
      orderType: 'mercado', // 'mercado' ou 'abaixo_de_preco'
      limitPrice: null,
    });

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
      if (form.quantity <= 0) {
        return alert('A quantidade deve ser maior que zero.');
      }
      if (form.orderType === 'abaixo_de_preco' && (!form.limitPrice || form.limitPrice <= 0)) {
        return alert('Por favor, insira um preço limite válido.');
      }

      const payload = {
        ticker: props.stock.ticker,
        quantidade: form.quantity,
        modo: form.orderType,
      };

      if (payload.modo === 'abaixo_de_preco') {
        payload.precoReferencia = form.limitPrice;
      }

      emit('buy-confirmed', payload);
      closeModal();
    }

    function formatCurrency(value) {
      if (typeof value !== 'number') return '';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return { modalRef, form, closeModal, confirmBuy, formatCurrency };
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
            Preço atual: <strong class="text-primary">{{ formatCurrency(stock.precoAtual) }}</strong>
          </p>

          <div class="mb-3">
            <label for="buyQuantity" class="form-label">Quantidade</label>
            <input type="number" class="form-control" id="buyQuantity" v-model="form.quantity" min="1" />
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" value="mercado" id="buyMarket" v-model="form.orderType" />
              <label class="form-check-label" for="buyMarket">Comprar a valor de mercado</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="abaixo_de_preco"
                id="buyLimit"
                v-model="form.orderType"
              />
              <label class="form-check-label" for="buyLimit">Comprar se menor ou igual a:</label>
            </div>
          </div>

          <div v-if="form.orderType === 'abaixo_de_preco'" class="input-group">
            <span class="input-group-text">R$</span>
            <input
              type="number"
              class="form-control"
              placeholder="30,00"
              v-model="form.limitPrice"
              step="0.01"
              min="0.01"
            />
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
