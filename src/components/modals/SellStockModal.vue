<script>
import { onMounted, ref, reactive } from 'vue';
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

    const form = reactive({
      quantity: 1,
      orderType: 'mercado',
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

    function confirmSell() {
      if (form.quantity <= 0 || form.quantity > props.portfolioItem.qtde) {
        return alert('Quantidade inválida.');
      }
      if (form.orderType === 'a_partir_de_preco' && (!form.limitPrice || form.limitPrice <= 0)) {
        return alert('Por favor, insira um preço limite válido.');
      }

      const payload = {
        ticker: props.portfolioItem.tickerAcao,
        quantidade: form.quantity,
        modo: form.orderType,
      };

      if (payload.modo === 'a_partir_de_preco') {
        payload.precoReferencia = form.limitPrice;
      }
      
      emit('sell-confirmed', payload);
      closeModal();
    }

    function formatCurrency(value) {
      if (typeof value !== 'number') return '';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return { modalRef, form, closeModal, confirmSell, formatCurrency };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ordem de Venda: {{ portfolioItem?.tickerAcao }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>
            Preço atual: <strong class="text-primary">{{ formatCurrency(portfolioItem?.precoAtual) }}</strong>
          </p>
          <p>
            Quantidade em carteira: <strong>{{ portfolioItem?.qtde }}</strong>
          </p>

          <div class="mb-3">
            <label for="sellQuantity" class="form-label">Quantidade para Vender</label>
            <input
              type="number"
              class="form-control"
              id="sellQuantity"
              v-model="form.quantity"
              min="1"
              :max="portfolioItem?.qtde"
            />
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" value="mercado" id="sellMarket" v-model="form.orderType" />
              <label class="form-check-label" for="sellMarket">Vender a valor de mercado</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="a_partir_de_preco"
                id="sellLimit"
                v-model="form.orderType"
              />
              <label class="form-check-label" for="sellLimit">Vender se maior ou igual a:</label>
            </div>
          </div>

          <div v-if="form.orderType === 'a_partir_de_preco'" class="input-group">
            <span class="input-group-text">R$</span>
            <input
              type="number"
              class="form-control"
              placeholder="35,00"
              v-model="form.limitPrice"
              step="0.01"
              min="0.01"
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
