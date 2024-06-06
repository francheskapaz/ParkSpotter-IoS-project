<template>
  <div>
    <h1>Parking Lot Feedbacks</h1>
    <ul>
      <li v-for="parking in parkings" :key="parking._id">
        <h2>{{ parking.name }}</h2>
        <p>Score: {{ parking.averageScore }}</p>
        <button @click="toggleFeedbackForm(parking._id)">Leave Feedback</button>
        <div v-if="showFeedbackForm[parking._id]">
          <label for="userId">User ID:</label>
          <input id="userId" v-model="newFeedback.user_id" placeholder="User ID" required />
          <label for="score">Score:</label>
          <input id="score" v-model="newFeedback.score" placeholder="Score" type="number" min="1" max="5" required />
          <label for="comment">Comment:</label>
          <input id="comment" v-model="newFeedback.comment" placeholder="Comment" />
          <button @click="submitFeedback(parking._id)">Submit</button>
          <button @click="resetForm(parking._id)">Reset</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      feedbacks: [],
      parkings: [],
      showFeedbackForm: {},
      newFeedback: {
        user_id: '',
        score: '',
        comment: ''
      }
    };
  },
  created() {
    this.fetchParkings();
    this.fetchFeedbacks();
  },
  methods: {
    async fetchFeedbacks() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/feedback');
        this.feedbacks = response.data;
      } catch (error) {
        console.error('Error fetching feedbacks', error);
      }
    },
    async fetchParkings() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/parkings');
        this.parkings = response.data;
        this.parkings.forEach(parking => {
          this.$set(this.showFeedbackForm, parking._id, false);
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    toggleFeedbackForm(parkingId) {
      this.showFeedbackForm[parkingId] = !this.showFeedbackForm[parkingId];
      if (!this.showFeedbackForm[parkingId]) {
        this.resetForm(parkingId);
      }
    },
    async submitFeedback(parkingId) {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/feedback', {
          user_id: this.newFeedback.user_id,
          parking_id: parkingId,
          score: this.newFeedback.score,
          comment: this.newFeedback.comment
        });
        this.feedbacks.push(response.data);
        this.toggleFeedbackForm(parkingId); // Oculta el formulario después de enviar el feedback
        alert(response.data.message);
      } catch (error) {
        console.error('Error submitting feedback', error);
        alert('Error submitting feedback');
      }
    },
    resetForm(parkingId) {
      this.newFeedback = {
        user_id: '',
        score: '',
        comment: ''
      };
      this.$set(this.showFeedbackForm, parkingId, false);
    }
  }
};
</script>
