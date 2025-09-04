import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductosStore = defineStore('productos', {
  state: () => ({
    productos: [],
  }),
  actions: {
    // Obtener todos los productos con búsqueda opcional
    async obtenerProductos(search = '') {
      try {
        const res = await axios.get('http://localhost:3000/productos', {
          params: { search },
        });
        this.productos = res.data;
        return this.productos;
      } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
      }
    },

    // Obtener un producto por ID
    async obtenerProducto(id) {
      try {
        const res = await axios.get(`http://localhost:3000/productos/${id}`);
        return res.data;
      } catch (error) {
        console.error('Error al obtener producto:', error);
        return null;
      }
    },

    // Crear producto
    async crearProducto(producto) {
      try {
        const res = await axios.post('http://localhost:3000/productos', producto);
        this.productos.push(res.data);
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    },

    // Editar producto
    async editarProducto(id, producto) {
      try {
        const res = await axios.put(`http://localhost:3000/productos/${id}`, producto);
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) this.productos[index] = res.data;
      } catch (error) {
        console.error('Error al editar producto:', error);
      }
    },

    // Eliminar producto
    async eliminarProducto(id) {
      try {
        await axios.delete(`http://localhost:3000/productos/${id}`);
        this.productos = this.productos.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    },
  },
});
