<template>
    <div>
      <h1>Parking Lots</h1>
      <ul v-if="parkings.length > 0">
        <li v-for="parking in parkings" :key="parking._id">
          <h2>{{ parking.name }}</h2>
          <p>Fee: ${{ parking.fee }}</p>
          <p>Max Stop: {{ parking.maxStop }} hour(s)</p>
          <p>Status: {{ parking.open ? 'Open' : 'Closed' }}</p>
          <button @click="toggleParkingDetails(parking._id)">View Details</button>
          <button @click="deleteParking(parking._id)">Delete</button>
          <button @click="editParking(parking)">Edit</button>
          <div v-if="selectedParking && selectedParking._id === parking._id">
            <div v-if="!editedParking">
              <h3>Details for {{ selectedParking.name }}</h3>
              <p>Fee: ${{ selectedParking.fee }}</p>
              <p>Max Stop: {{ selectedParking.maxStop }} hour(s)</p>
              <p>Status: {{ selectedParking.open ? 'Open' : 'Closed' }}</p>
            </div>
            <div v-else>
              <h3>Edit {{ editedParking.name }}</h3>
              <label for="editName">Name:</label>
              <input id="editName" v-model="editedParking.name" placeholder="Name" />
              <label for="editFee">Fee:</label>
              <input id="editFee" v-model="editedParking.fee" placeholder="Fee" type="number" />
              <label for="editMaxStop">Max Stop:</label>
              <input id="editMaxStop" v-model="editedParking.maxStop" placeholder="Max Stop" type="number" />
              <button @click="saveEditedParking" :disabled="!editedParking">Save</button>
              <button @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>No parking lots available.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        parkings: [],
        selectedParking: null,
        editedParking: null
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
          console.error('Error fetching parking lots', error);
        }
      },
      async toggleParkingDetails(id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/parkings/${id}`);
          this.selectedParking = response.data;
          this.editedParking = null; 
        } catch (error) {
          console.error('Error fetching parking details', error);
        }
      },
      async deleteParking(id) {
        try {
          await axios.delete(`http://localhost:8080/api/v1/parkings/${id}`);
          this.parkings = this.parkings.filter(parking => parking._id !== id);
          if (this.selectedParking && this.selectedParking._id === id) {
            this.selectedParking = null; 
          }
        } catch (error) {
          console.error('Error deleting parking', error);
        }
      },
      editParking(parking) {
        this.selectedParking = parking;
        this.editedParking = { ...parking }; 
      },
      async saveEditedParking(id) {
        try {
          const response = await axios.patch(`http://localhost:8080/api/v1/parkings/${this.editedParking._id}`, this.editedParking);
        
          const index = this.parkings.findIndex(p => p._id === id);
          if (index !== -1) {
            this.parkings[index] = response.data;
            this.selectedParking = response.data; 
            this.editedParking = null; 
          }
        } catch (error) {
          console.error('Error updating parking', error);
        }
      },
      cancelEdit() {
        this.editedParking = null; 
      },
    },
  };
  </script>
  