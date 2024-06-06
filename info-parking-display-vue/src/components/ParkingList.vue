<template>
  <div>
    <h1>Parking Lots</h1>
    <ul>
      <li v-for="parking in parkings" :key="parking._id">
        <h2>{{ parking.name }}</h2>
        <button @click="toggleParkingDetails(parking._id)">View Details</button>
        <div v-if="selectedParking && selectedParking._id === parking._id">
          <h3>Details for {{ selectedParking.name }}</h3>
          <p>Fee: ${{ selectedParking.fee }}</p>
          <p>Max Stop: {{ selectedParking.maxStop }} hour(s)</p>
          <p>Status: {{ selectedParking.open ? 'Open' : 'Closed' }}</p>
          <p>Number of Parking Spaces: {{ selectedParking.nParkingSpaces }}</p>
          <p>Vehicle Type: {{ selectedParking.vehicleType }}</p>
          <p>Free Spaces: {{ selectedParking.nFree }}</p>
          <p>Average Score: {{ selectedParking.averageScore }}</p>
        </div>
      </li>
    </ul>
    <p v-if="parkings.length === 0">No parking lots available.</p>
  </div>
</template>
  
  <script>
   import axios from 'axios';
  
  export default {
    data() {
      return {
        parkings: [],
        selectedParking: null,
      };
    },
    created() {
      this.fetchParkings();
    },
    methods: {
      async fetchParkings() {
        try {
          const response = await axios.get('http://localhost:8080/api/v1/parkings');
          this.parkings = response.data;
        } catch (error) {
          console.error('Error fetching data', error);
        }
      },
      async toggleParkingDetails(id) {
       
        if (this.selectedParking && this.selectedParking._id === id) {
          this.selectedParking = null;
        } else {
          try {
              const response = await axios.get(`http://localhost:8080/api/v1/parkings/${id}`);
              this.selectedParking = response.data;
          } catch (error) {
            console.error('Error fetching parking details', error);
          }
        }
      }
    }
  };
  </script>
  
<style scoped>

</style>