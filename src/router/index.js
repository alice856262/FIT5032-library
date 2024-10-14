import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HomeView from '../views/HomeView.vue'
import AddBookView from '../views/AddBookView.vue'
import AboutView from '../views/AboutView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import GetAllBookAPI from '../views/GetAllBookAPI.vue'

const auth = getAuth();
const db = getFirestore();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView, 
    meta: { requiresAuth: true } 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  { 
    path: "/dashboard", 
    component: DashboardView, 
    meta: { requiresAdmin: true } 
  },
  { 
    path: "/GetBookCount", 
    name: 'GetBookCount',
    component: GetBookCountView
  },
  { 
    path: "/WeatherCheck", 
    name: 'WeatherCheck',
    component: WeatherView
  },
  { 
    path: "/CountBookAPI", 
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  { 
    path: "/GetAllBookAPI", 
    name: 'GetAllBookAPI',
    component: GetAllBookAPI
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const currentUser = auth.currentUser;
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!currentUser) {
      next("/FireLogin");
    } else {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        next();
      } else {
        next("/");
      }
    }
  } else {
    next();
  }
});

export default router