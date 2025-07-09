import { createRouter, createWebHistory } from 'vue-router';
import MarketView from '../views/MarketView.vue';
import PortfolioView from '../views/PortfolioView.vue';
import AccountView from '../views/AccountView.vue';
import AuthView from '../views/AuthView.vue';

const routes = [
  {
    path: '/',
    redirect: '/market',
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/market',
    name: 'Market',
    component: MarketView,
    meta: { requiresAuth: true },
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: PortfolioView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active fw-bold',
});

router.beforeEach((to, from, next) => {
  const userIsLoggedIn = !!localStorage.getItem('user');

  if (to.meta.requiresAuth && !userIsLoggedIn) {
    next('/auth');
  } else if (to.name === 'Auth' && userIsLoggedIn) {
    next('/market');
  } else {
    next();
  }
});

export default router;
