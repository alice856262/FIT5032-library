<template>
    <div class="container">
      <h1 class="mb-3">Login</h1>
      <form @submit.prevent="authState.login">
        <div class="mb-3">
          <input v-model="username" @input="authState.setUsername($event.target.value)" type="text" placeholder="Username" class="form-control"/>
        </div>
        <div class="mb-3">
          <input v-model="password" @input="authState.setPassword($event.target.value)" type="password" placeholder="Password" class="form-control"/>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';

const authState = inject('authState');
const username = ref('');
const password = ref('');
</script>
