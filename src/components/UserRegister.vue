<template>
  <div class="max-w-2xl mx-auto mt-28 px-4">
    <h2 class="text-2xl font-semibold mb-4 text-center text-profile">Create User</h2>
    <form @submit.prevent="createUser" class="space-y-3 text-gray-800">
      <div>
        <label for="name" class="block font-semibold">Name</label>
        <input id="name" type="text" v-model="user.name" class="block w-full border border-primary rounded-md py-2 px-3 focus:outline-none" />
      </div>
      <div>
        <label for="email" class="block font-semibold">Email</label>
        <input id="email" type="email" v-model="user.email" class="block w-full border border-primary rounded-md py-2 px-3 focus:outline-none" />
      </div>
      <div>
        <label for="password" class="block font-semibold">Password:</label>
        <input id="password" type="password" v-model="user.password" class="block w-full border border-primary rounded-md py-2 px-3 focus:outline-none" />
      </div>
      <div>
        <label for="password_confirmation" class="block font-semibold">Confirm Password:</label>
        <input id="password_confirmation" type="password" v-model="passwordConfirmation" class="block w-full border border-primary rounded-md py-2 px-3 focus:outline-none" />
      </div>
      <div class="flex gap-x-3">
          <button type="submit" class="font-medium bg-primary text-profile py-2 px-5 rounded-md hover:bg-opacity-70 transition-all duration-300">Save</button>
          <button @click="handleCancel" type="button" class="font-medium bg-profile text-primary py-2 px-5 rounded-md hover:bg-opacity-70 transition-all duration-300">Cancel</button>
      </div>
    </form>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from "@/stores/auth";
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const user = ref({
    name: '',
    email: '',
    password: '',
  });
  
  const passwordConfirmation = ref('');
  
  const createUser = async () => {
    if (!user.value.name){
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill your name',
      });
      return;
    }
    if (!user.value.email){
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill your email',
      });
      return;
    }
    if (!user.value.password){
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill your password',
      });
      return;
    }
    if (!passwordConfirmation.value){
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please confirm your password',
      });
      return;
    }

    if (user.value.password !== passwordConfirmation.value){
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password does not match',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users', user.value, {
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User created successfully',
      });

      // Redirect to user list
      router.push('/userlist');
    } catch (error) {
      if (error.response.status === 422 && error.response.data.errors.email) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email has already been registered',
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create user',
        });
      }
    }
  };
  const handleCancel = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'If you cancel, the changes will be discarded.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel',
        cancelButtonText: 'No, go back'
    });

    // If user confirms cancellation
    if (result.isConfirmed) {
        // Push router to -1
        router.go(-1);
    }
  };
</script>
