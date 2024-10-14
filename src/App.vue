<template>
  <div class="main-container">
    <!-- Only show header if the route is not CountBookAPI -->
    <header v-if="showHeader">
      <!-- Integrated Header Navigation -->
      <div class="container">
        <header class="d-flex justify-content-center py-3">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home (Week 8)</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Books API</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/GetBookCount" class="nav-link" active-class="active">Get Book Count</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
            </li>
            <!-- Show Login if not authenticated -->
            <!-- <li class="nav-item" v-if="!authState.isAuthenticated">
              <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
            </li> -->
            <!-- Show About and Logout link only if authenticated -->
            <li class="nav-item" v-if="authState.isAuthenticated">
              <router-link to="/about" class="nav-link" active-class="active">About</router-link>
            </li>
            <li class="nav-item" v-if="authState.isAuthenticated && authState.role === 'admin'">
              <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="authState.isAuthenticated">
              <a href="#" class="nav-link" @click="authState.logout">Logout</a>
            </li>
            <!-- Show Login and Register link if not authenticated -->
            <li class="nav-item" v-if="!authState.isAuthenticated">
              <router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link>
            </li>
            <li class="nav-item" v-if="!authState.isAuthenticated">
              <router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
            </li>
          </ul>
        </header>
      </div>
    </header>

    <main class="container">
      <!-- <LibraryRegistrationForm /> -->
      <!-- <JSONLab /> -->
      <router-view></router-view>
    </main>
  </div>  
</template>

<script setup>
import { reactive, provide, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const router = useRouter();
const route = useRoute();  // Access current route
const auth = getAuth();
const db = getFirestore();
const username = ref('');
const password = ref('');

const authState = reactive({
  isAuthenticated: false,
  user: null,
  getUsername: () => username.value,
  getPassword: () => password.value,
  setUsername: (val) => username.value = val,
  setPassword: (val) => password.value = val,
  checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.user = user; // Store user info
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    });
  },
  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.getUsername(), this.getPassword());
      console.log("Current user:", authState.user);
      console.log("Login with Firebase");

      this.isAuthenticated = true;
      this.user = userCredential.user;

      // Retrieve user role from Firestore
      const userDocRef = doc(db, "users", this.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.role = userData.role;
        console.log("Login role:", this.role);

        // Redirect based on user role
        if (this.role === 'admin') {
          router.push('/dashboard'); // Redirect to dashboard for admin
        } else {
          router.push('/about'); // Redirect to about page for regular user
        }
      } else {
        console.log("No such user document exists!");
        this.role = null;
        router.push('/');
      }
    } catch (error) {
      console.log("Firebase login failed:", error);
      alert('Incorrect username or password!');
    }
  },
// login() {
//   signInWithEmailAndPassword(auth, this.getUsername(), this.getPassword())
//     .then((userCredential) => {
//       console.log("Current user:", authState.user);
//       console.log("Login with Firebase");
//       this.isAuthenticated = true;
//       this.user = userCredential.user;
//       router.push('/about');
//     })
//     .catch((error) => {
//       console.log("Firebase login failed:", error);
//       alert('Incorrect username or password!');
//     });
// },
  logout() {
    console.log("Current user:", authState.user);
    signOut(auth).then(() => {
      console.log("Logout from Firebase");
      this.isAuthenticated = false;
      this.user = null;
      router.push('/FireLogin');
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  }
});

onMounted(() => {
  authState.checkAuth();
});

provide('authState', authState);

// Computed property to check if header should be shown
const showHeader = computed(() => {
  return route.name !== 'CountBookAPI' && route.name !== 'GetAllBookAPI';
});
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
