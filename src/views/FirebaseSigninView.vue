<template>
    <div class="container">
        <h1>Sign in</h1>
        <p><input type="text" placeholder="Email" v-model="email"/></p>
        <p><input type="password" placeholder="Password" v-model="password"/></p>
        <button class="btn btn-primary me-2" @click="signin">Sign in via Firebase</button>
    </div>  
</template>

<script setup>
import { ref, inject } from "vue"

const email = ref("")
const password = ref("")
const authState = inject('authState')  // Inject the shared authentication state from the main app

const signin = () => {
    authState.setUsername(email.value);  // Set the username in authState
    authState.setPassword(password.value);  // Set the password in authState
    authState.login();  // Call the login method from authState
}

// import { ref } from "vue"
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
// import { getFirestore, doc, getDoc } from "firebase/firestore"
// import { useRouter } from "vue-router"

// const email = ref("")
// const password = ref("")
// const router = useRouter()
// const auth = getAuth()
// const db = getFirestore()

// const signin = () => {
//     signInWithEmailAndPassword(auth, email.value, password.value)
//     .then(async (userCredential) => {
//         const user = userCredential.user;
//         // Retrieve user role from Firestore
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//             const userData = userDoc.data();
//             const role = userData.role;
//             console.log("User role:", role);
//             if (role === 'admin') {
//                 router.push("/about")
//             } else {
//                 router.push("/")
//             }
//         } else {
//             console.log("No such document!");
//         }
//     })
//     .catch((error) => {
//         console.log(error.code);
//     });
// };
</script>

<style scoped>
.container {
  text-align: center;
}
</style>