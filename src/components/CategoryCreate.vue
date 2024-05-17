<template>
    <div class="max-w-2xl mx-auto mt-8 p-4">
        <h2 class="text-2xl font-semibold mb-4 text-center text-profile">Create Category</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="mb-3">
            <label for="chinese_category" class="block font-medium text-gray-800">Category in Chinese (中国人)</label>
            <input v-model="chinese_category" id="chinese_category" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-3">
            <label for="indonesian_category" class="block font-medium text-gray-800">Category in Indonesian</label>
            <input v-model="indonesian_category" id="indonesian_category" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-3">
            <label for="english_category" class="block font-medium text-gray-800">Category in English</label>
            <input v-model="english_category" id="english_category" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
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

const chinese_category = ref('');
const indonesian_category = ref('');
const english_category = ref('');

const router = useRouter();

const handleSubmit = async () => {

    if (!chinese_category.value && !indonesian_category.value && !english_category.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Fill at least 1 field',
        });
        return;
    }

    if (!chinese_category.value || !indonesian_category.value || !english_category.value) {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Warning',
            text: 'Some fields are still empty, confirm?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            customClass: {
                confirmButton: 'bg-primary text-profile',
                cancelButton: 'bg-profile text-primary',
            }
        });

        if (!result.isConfirmed) {
            return;
        }
    }

    try {
        const response = await axios.post('http://localhost:8000/api/categories', {
            chinese_category: chinese_category.value,
            indonesian_category: indonesian_category.value,
            english_category: english_category.value
        },
        {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Category created successfully',
        });

        router.push('/categorylist');
    } catch (error) {
        console.error('Error creating category:', error);
        // Handle error, show message to user, etc.

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create category',
        });
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
