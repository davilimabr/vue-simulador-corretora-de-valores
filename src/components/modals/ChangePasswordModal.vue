<script>
import { onMounted, ref, reactive } from 'vue';
import { Modal } from 'bootstrap';

export default {
  name: 'ChangePasswordModal',
  emits: ['closed', 'change-password-confirmed'],
  setup(props, { emit }) {
    const modalRef = ref(null);
    let modalInstance = null;

    const form = reactive({
      senhaAtual: '',
      novaSenha: '',
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
      if (modalInstance) modalInstance.hide();
    }

    function confirmChange() {
      if (!form.senhaAtual || !form.novaSenha) {
        return alert('Por favor, preencha todos os campos.');
      }
      emit('change-password-confirmed', { ...form });
      closeModal();
    }

    return { modalRef, form, closeModal, confirmChange };
  },
};
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Alterar Senha</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="confirmChange">
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Senha Atual</label>
              <input type="password" class="form-control" id="currentPassword" v-model="form.senhaAtual" required />
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">Nova Senha</label>
              <input type="password" class="form-control" id="newPassword" v-model="form.novaSenha" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="confirmChange">Confirmar Alteração</button>
        </div>
      </div>
    </div>
  </div>
</template>
