import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Calendar from '../components/Calendar.vue'
import Login from '@/components/Login.vue'

const routes = [
  { path: '/', name: 'calendar', component: Calendar },
  { path: '/login', name: 'login', component: Login },
  // { path: '/calendar', component: Calendar },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard to check if the user is logged in
router.beforeEach((to, from, next) => {
  // Check if the user is trying to access a protected route (e.g., the Calendar)
  if (to.path === '/') {
    // Check for localStorage key or cookie
    const isAuthenticated = localStorage.getItem('teleoptiCookie') || document.cookie.includes('teleoptiCookie');

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      return next('/login');
    }
  }

  // Allow navigation if condition is satisfied or the route is not protected
  next();
});

export default router
