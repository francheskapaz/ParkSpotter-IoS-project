<template>
    <div>
      <h1>API Data</h1>
      <ul>
        <li v-for="item in data" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: []
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:8080/api/v2/parkings');
          this.data = response.data;
        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  