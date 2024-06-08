<template>
  <div>
    <h1>Leave Feedback</h1>
    <form @submit.prevent="submitFeedback">
      <div>
        <label for="userId">User ID:</label>
        <input type="text" v-model="userId" required>
      </div>
      <div>
        <label for="score">Score:</label>
        <input type="number" v-model="score" min="1" max="5" required>
      </div>
      <div>
        <label for="comment">Comment:</label>
        <textarea v-model="comment"></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const userId = ref('');
    const score = ref(null);
    const comment = ref('');
    const route = useRoute();

    const submitFeedback = async () => {
      try {
        await axios.post('http://localhost:8080/api/v1/feedback', {
          user_id: userId.value,
          parking_id: route.params.parkingId,
          score: score.value,
          comment: comment.value
        });
        alert('Feedback submitted successfully!');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback');
      }
    };
    return {userId, score, comment, submitFeedback};
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
div {
  margin-bottom: 10px;
}
</style>