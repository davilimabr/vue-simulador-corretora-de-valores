<script>
import { inject } from 'vue';

export default {
  name: 'TheNavbar',
  props: { user: Object },
  setup() {
    const logoutFn = inject('logout');
    const openChangePasswordModalFn = inject('openChangePasswordModal');

    return { logoutFn, openChangePasswordModalFn };
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">CorretoraSim</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="user.email" class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/market">Mercado</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/portfolio">Carteira</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/account">Conta Corrente</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <div class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Olá, {{ user.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><a class="dropdown-item" href="#" @click.prevent="openChangePasswordModalFn">Trocar Senha</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logoutFn">Sair (Logout)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
