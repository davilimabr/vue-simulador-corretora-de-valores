<script>
export default {
  name: 'TheNavbar',
  props: {
    user: Object,
    activePage: String,
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    function navigateTo(page) {
      emit('navigate', page);
    }

    return {
      navigateTo,
    };
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container">
      <a
        class="navbar-brand fw-bold"
        href="#"
        @click.prevent="navigateTo('mercado')"
        >CorretoraSim</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              :class="{ 'active fw-bold': activePage === 'mercado' }"
              @click.prevent="navigateTo('mercado')"
              >Mercado</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              :class="{ 'active fw-bold': activePage === 'carteira' }"
              @click.prevent="navigateTo('carteira')"
              >Carteira</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              :class="{ 'active fw-bold': activePage === 'conta-corrente' }"
              @click.prevent="navigateTo('conta-corrente')"
              >Conta Corrente</a
            >
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
              Olá, {{ user.name }}
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li><a class="dropdown-item" href="#">Trocar Senha</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Sair (Logout)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
