import { createRouter, createWebHistory } from 'vue-router';
import ParkingList from './components/ParkingList.vue';
import LeaveFeedback from './components/LeaveFeedback.vue';

const routes = [
    { path: '/', component: ParkingList},
    { path: '/feedback/:parkingId', component: LeaveFeedback }

];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

export default router;