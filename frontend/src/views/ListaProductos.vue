<template>
  <v-container fluid class="pa-6" style="background-color: #f0f4f8; min-height: 100vh;">
    <!-- Barra superior con búsqueda y botón -->
    <v-toolbar flat color="white" class="rounded-xl elevation-2 mb-4 pa-3">
      <v-toolbar-title class="text-h6 font-weight-bold" style="color: #006064;">
        Productos
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Buscar producto"
        clearable
        @input="cargarProductos"
        outlined
        dense
        color="cyan darken-2"
        class="mr-4"
      ></v-text-field>
      <v-btn color="cyan darken-2" dark @click="$router.push('/productos/nuevo')">
        Nuevo Producto
      </v-btn>
    </v-toolbar>

    <!-- Tabla de productos -->
    <v-data-table
      :headers="headers"
      :items="productos"
      item-key="id"
      class="elevation-1 rounded-xl"
      :loading="loading"
      loading-text="Cargando productos..."
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <v-btn icon color="cyan darken-2" @click="editar(item.id)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red darken-2" @click="confirmarEliminar(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <v-card class="pa-6 text-center" color="cyan lighten-5" outlined>
          <v-icon large color="cyan darken-2">mdi-alert-circle-outline</v-icon>
          <div class="text-h6 mt-2">No hay productos disponibles</div>
          <div class="text-subtitle-1 mt-1">Agrega un nuevo producto para comenzar</div>
        </v-card>
      </template>
    </v-data-table>

    <!-- Dialog de confirmación -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Seguro que deseas eliminar
          <strong>{{ productoSeleccionado?.nombre }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="red darken-2" text @click="eliminarProductoConfirmado">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de aviso -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductosStore } from "../stores/productos";
import { useRouter } from "vue-router";

const store = useProductosStore();
const router = useRouter();

const productos = ref([]);
const dialog = ref(false);
const productoSeleccionado = ref(null);
const search = ref("");
const loading = ref(false);

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const headers = [
  { text: "Nombre", value: "nombre" },
  { text: "SKU", value: "sku" },
  { text: "Precio", value: "precio" },
  { text: "Stock", value: "stock" },
  { text: "Categoría", value: "categoria" },
  { text: "Acciones", value: "actions", sortable: false },
];

// Cargar productos con búsqueda
const cargarProductos = async () => {
  loading.value = true;
  try {
    productos.value = await store.obtenerProductos(search.value);
  } catch (err) {
    snackbar.value = {
      show: true,
      text: "Error al cargar productos",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarProductos();
});

const editar = (id) => router.push(`/productos/${id}`);

const confirmarEliminar = (item) => {
  productoSeleccionado.value = item;
  dialog.value = true;
};

const eliminarProductoConfirmado = async () => {
  if (productoSeleccionado.value) {
    await store.eliminarProducto(productoSeleccionado.value.id);
    await cargarProductos();

    snackbar.value = {
      show: true,
      text: `Producto "${productoSeleccionado.value.nombre}" eliminado correctamente`,
      color: "success",
    };
  }
  dialog.value = false;
};
</script>
