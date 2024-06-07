<template>
  <div>
    <h1>Parkings</h1>
    <div v-for="parking in parkings" :key="parking._id" class="parking">
      <h2>{{ parking.name }}</h2>
      <p>Average Score: {{ parking.averageScore.toFixed(2) }}</p>
      <button @click="toggleParkingDetails(parking._id)">View Details</button>
      <button @click="leaveFeedback(parking._id)">Leave Feedback</button>
      <div v-if="selectedParking && selectedParking._id === parking._id">
        <h3>Details for {{ selectedParking.name }}</h3>
        <p>Fee: ${{ selectedParking.fee }}</p>
        <p>Max Stop: {{ selectedParking.maxStop }} hour(s)</p>
        <p>Status: {{ selectedParking.open ? 'Open' : 'Closed' }}</p>
        <p>Number of Parking Spaces: {{ selectedParking.nParkingSpaces }}</p>
        <p>Vehicle Type: {{ selectedParking.vehicleType }}</p>
        <p>Free Spaces: {{ selectedParking.nFree }}</p>
      </div>
    </div>
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
        console.error('Error fetching parkings:', error);
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
          console.error('Error fetching parking details:', error);
        }
      }
    },
    leaveFeedback(parkingId) {
      this.$router.push({ path: `/feedback/${parkingId}` });
    }
  }
};
</script>

<style scoped>
.parking {
  margin-bottom: 20px;
}
</style>
