<template>
  <v-container fluid class="pa-6" style="background-color: #f0f4f8; min-height: 100vh;">
    <v-card class="pa-6 rounded-xl elevation-6" max-width="600" color="white">
      <v-card-title class="text-h5 font-weight-bold" style="color: #006064;">
        Editar Producto
      </v-card-title>

      <v-card-text v-if="producto">
        <v-form ref="form" v-model="formularioValido" @submit.prevent="actualizarProducto">
          <v-text-field
            v-model="producto.nombre"
            label="Nombre"
            :rules="[v => !!v || 'El nombre es obligatorio']"
            outlined
            color="cyan darken-2"
            dense
            class="mb-4"
            required
          />

          <v-text-field
            v-model="producto.sku"
            label="SKU"
            :rules="[v => !!v || 'El SKU es obligatorio']"
            outlined
            color="cyan darken-2"
            dense
            class="mb-4"
            required
          />

          <v-text-field
            v-model.number="producto.precio"
            label="Precio"
            type="number"
            :rules="[
              v => !!v || 'El precio es obligatorio',
              v => v > 0 || 'El precio debe ser mayor que 0'
            ]"
            outlined
            color="cyan darken-2"
            dense
            class="mb-4"
            required
          />

          <v-text-field
            v-model.number="producto.stock"
            label="Stock"
            type="number"
            :rules="[
              v => v !== null && v !== '' || 'El stock es obligatorio',
              v => v >= 0 || 'El stock no puede ser negativo'
            ]"
            outlined
            color="cyan darken-2"
            dense
            class="mb-4"
            required
          />

          <v-text-field
            v-model="producto.categoria"
            label="Categoría"
            :rules="[v => !!v || 'La categoría es obligatoria']"
            outlined
            color="cyan darken-2"
            dense
            class="mb-6"
            required
          />

          <v-row justify="space-between">
            <v-btn
              color="cyan darken-2"
              dark
              type="submit"
              elevation="3"
              :disabled="!formularioValido"
            >
              Actualizar
            </v-btn>
            <v-btn text color="grey darken-1" @click="cancelar">
              Cancelar
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-text v-else>Cargando...</v-card-text>
    </v-card>

    <!-- Snackbar de mensajes -->
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
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useProductosStore();
const form = ref(null);
const formularioValido = ref(false);

const producto = ref(null);

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success", // success, error, warning, info
});

onMounted(async () => {
  try {
    const data = await store.obtenerProducto(route.params.id);
    if (data) {
      producto.value = data;
    } else {
      snackbar.value = {
        show: true,
        text: "Producto no encontrado",
        color: "error",
      };
      router.push("/productos");
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: "Error al cargar el producto",
      color: "error",
    };
  }
});

const actualizarProducto = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    snackbar.value = {
      show: true,
      text: "Por favor completa todos los campos correctamente",
      color: "warning",
    };
    return;
  }

  try {
    await store.editarProducto(route.params.id, producto.value);

    snackbar.value = {
      show: true,
      text: "Producto actualizado correctamente",
      color: "success",
    };

    setTimeout(() => router.push("/productos"), 1000);
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.response?.data?.error || "Error al actualizar el producto",
      color: "error",
    };
  }
};

const cancelar = () => {
  snackbar.value = {
    show: true,
    text: "Edición cancelada",
    color: "info",
  };
  setTimeout(() => router.push("/productos"), 1000);
};
</script>
