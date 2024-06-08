<template>
  <div>
    <h1>Parkings</h1>
    <div v-for="parking in parkings" :key="parking._id" class="parking">
      <h2>{{ parking.name }}</h2>
      <p>Average Score: {{ parking.averageScore.toFixed(2) }}</p>
      <button @click="toggleParkingDetails(parking._id)">View Details</button>
      <button @click="leaveFeedback(parking._id)">Leave Feedback</button>
      <button @click="toggleParkingFeedback(parking._id)">View Feedbacks</button>
      <div v-if="selectedParking && selectedParking._id === parking._id">
        <h3>Details for {{ selectedParking.name }}</h3>
        <p>Fee: ${{ selectedParking.fee }}</p>
        <p>Max Stop: {{ selectedParking.maxStop }} hour(s)</p>
        <p>Status: {{ selectedParking.open ? 'Open' : 'Closed' }}</p>
        <p>Number of Parking Spaces: {{ selectedParking.nParkingSpaces }}</p>
        <p>Vehicle Type: {{ selectedParking.vehicleType }}</p>
        <p>Free Spaces: {{ selectedParking.nFree }}</p>
      </div>
      <div v-if="selectedParkingFeedback && selectedParkingFeedback._id === parking._id">
        <h3>Feedback for {{ selectedParkingFeedback.name }}</h3>
        <ul>
          <li v-for="feedback in selectedParkingFeedback.feedbacks" :key="feedback._id">
            {{ feedback.comment }} - {{ feedback.score }} stars
          </li>
        </ul>
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
      selectedParkingFeedback: null,
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
    async toggleParkingFeedback(id) {
      if (this.selectedParkingFeedback && this.selectedParkingFeedback._id === id) {
        this.selectedParkingFeedback = null;
      } else {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/parkings/${id}/feedback`);
          this.selectedParkingFeedback = {
            _id: id,
            name: this.parkings.find(parking => parking._id === id).name,
            feedbacks: response.data,
          };
        } catch (error) {
          console.error('Error fetching parking feedbacks:', error);
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
