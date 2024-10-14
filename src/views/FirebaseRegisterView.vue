<template>
    <div class="container">
        <h1>Create an Account</h1>
        <p><input type="text" placeholder="Email" v-model="email"/></p>
        <p><input type="password" placeholder="Password" v-model="password"/></p>
        <p><select v-model="role">
            <option value="admin">Admin</option>
            <option value="user">User</option>
        </select></p>
        <button class="btn btn-primary me-2" @click="register">Save to Firebase</button>
    </div>    
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const role = ref("user")
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const register = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
        const user = userCredential.user;
        // Save user role in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email.value,
            role: role.value
        });
        console.log("Firebase Register Successful!")
        router.push("/FireLogin")
    })
    .catch((error) => {
        console.log(error.code)
    });
};
</script>

<style scoped>
.container {
  text-align: center;
}
</style>