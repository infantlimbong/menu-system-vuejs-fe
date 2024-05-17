<template>
    <div class="-mt-16 lg:-mt-20 lg:-ml-64 h-screen grid place-items-center">
      <div class="w-72 space-y-6 text-profile bg-primary px-4 py-8 rounded-lg">
        <div class="flex flex-col items-center justify-center">
          <h2 class="text-2xl font-bold">Grand Teo Chew</h2>
          <h5 class="text-sm font-semibold">Menu List</h5>
        </div>
        <div v-if="errorMessage">
          <p class="bg-red-100 text-red-700 rounded-lg p-4">{{ errorMessage }}</p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
          <input type="hidden" name="remember" value="true" />
          <div class="grid gap-y-1">
            <div>
              <label for="email-address" class="sr-only">Email</label>
              <input id="email-address" name="email" type="email" v-model="email" required autocomplete="email" class="appearance-none w-full py-2 rounded-md px-2 focus:outline-profile" placeholder="Email address" />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" v-model="password" required class="appearance-none w-full py-2 rounded-md px-2 focus:outline-profile" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" class="w-full bg-profile text-primary py-2 rounded-md">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
</template>
  
<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useRouter, useRoute } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const email = ref("");
  const password = ref("");
  const errorMessage = ref(null);
  
  async function onSubmit() {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email.value,
        password: password.value,
      });
      authStore.setAccessToken(response.data.access_token);
      router.push({ name: "dashboard" });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors &&
        error.response.data.errors.email
      ) {
        errorMessage.value = error.response.data.errors.email[0];
      } else {
        errorMessage.value = "An error occurred: " + error.message;
      }
      console.error(errorMessage.value);
    }
  }
</script>
  