import { createRouter, createWebHistory } from 'vue-router';
import ListaProductos from '../views/ListaProductos.vue';
import CrearProducto from '../views/CrearProducto.vue';
import DetalleProducto from '../views/DetalleProducto.vue';

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/productos', component: ListaProductos },
  { path: '/productos/nuevo', component: CrearProducto },
  { path: '/productos/:id', component: DetalleProducto },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
