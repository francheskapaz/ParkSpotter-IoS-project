<template>
    <div>
      <h2>Datos de la API</h2>
      <div v-if="loading">Cargando datos...</div>
      <div v-if="error">{{ error }}</div>
      <ul v-if="data">
        <li v-for="item in data" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: null,
        loading: false,
        error: null
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          const response = await fetch('http://localhost:8080/api/v1/parkings');
          if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
          }
          this.data = await response.json();
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos específicos para este componente aquí */
  </style>
  