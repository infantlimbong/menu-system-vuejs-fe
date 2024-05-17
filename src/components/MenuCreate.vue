<template>
    <div class="w-full mx-auto mt-8 p-4">
        <h2 class="text-2xl font-semibold mb-4">Create Menu</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="flex flex-col lg:flex-row lg:gap-x-3">
                <div class="mb-3 w-full">
                    <label for="chinese_menu" class="block font-medium text-gray-800">Menu name in Chinese (中国人)<span class="text-red-500">*</span></label>
                    <input v-model="chinese_menu" id="chinese_menu" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="lg:mb-3 w-full">
                    <label for="indonesian_menu" class="block font-medium text-gray-800">Menu name in Indonesian<span class="text-red-500">*</span></label>
                    <input v-model="indonesian_menu" id="indonesian_menu" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div class="flex flex-col lg:flex-row lg:gap-x-3">
                <div class="mb-3 w-full">
                    <label for="english_menu" class="block font-medium text-gray-800">Menu name in English<span class="text-red-500">*</span></label>
                    <input v-model="english_menu" id="english_menu" type="text" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="lg:mb-3 w-full">
                    <label for="category" class="block font-medium text-gray-800">Menu Category<span class="text-red-500">*</span></label>
                    <select v-model="selectedCategory" id="category" class="mt-1 shadow border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="" disabled>Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.indonesian_category }}</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col lg:flex-row lg:gap-x-3">
                <div class="mb-3 w-full">
                    <label for="small_price" class="block font-medium text-gray-800">Small Price<span class="text-red-500">*</span></label>
                    <input v-model="small_price" id="small_price" type="number" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-full">
                    <label for="medium_price" class="block font-medium text-gray-800">Medium Price<span class="text-red-500">*</span></label>
                    <input v-model="medium_price" id="medium_price" type="number" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="lg:mb-3 w-full">
                    <label for="large_price" class="block font-medium text-gray-800">Large Price<span class="text-red-500">*</span></label>
                    <input v-model="large_price" id="large_price" type="number" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div class="flex flex-col lg:flex-row lg:gap-x-3 lg:items-center">
                <div class="mb-3 w-full">
                    <label for="stock" class="block font-medium text-gray-800">Stock<span class="text-red-500">*</span></label>
                    <select v-model="stock" id="stock" class="mt-1 shadow border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="" disabled>Select stock availability</option>
                        <option value="Tersedia">Tersedia</option>
                        <option value="Habis">Habis</option>
                    </select>
                </div>
                <div class="lg:mb-3 w-full">
                    <label for="image" class="block font-medium text-gray-800">Image<span class="text-red-500">*</span><span class="text-xs text-yellow-800 font-light"> The uploaded image will be compressed</span></label>
                    <input type="file" id="image" @change="handleImageUpload" accept="image/*" class="mt-1 shadow border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div class="flex flex-col lg:flex-row lg:gap-x-3">
                <div class="mb-3 w-full flex items-center gap-x-3">
                    <label for="best_selling" class="block font-medium text-gray-800">Mark as Best Selling</label>
                    <input v-model="best_selling" id="best_selling" type="checkbox" class="w-5 h-5 mt-1">
                </div>
                <div v-if="previewImage" class="mb-3 w-full">
                    <img :src="previewImage" alt="Preview" class="max-w-xs max-h-48">
                </div>
            </div>
            <div class="lg:mb-3 w-full">
                <label for="chinese_desc" class="block font-medium text-gray-800">Description in Chinese</label>
                <textarea v-model="chinese_desc" rows="2" id="chinese_desc" class="mt-1 shadow border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="lg:mb-3 w-full">
                <label for="indonesian_desc" class="block font-medium text-gray-800">Description in Indonesian</label>
                <textarea v-model="indonesian_desc" rows="2" id="indonesian_desc" class="mt-1 shadow border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="lg:mb-3 w-full">
                <label for="english_desc" class="block font-medium text-gray-800">Description in English</label>
                <textarea v-model="english_desc" rows="2" id="english_desc" class="mt-1 shadow border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="flex gap-x-3">
                <button type="submit" class="font-medium bg-primary text-profile py-2 px-5 rounded-md hover:bg-opacity-70 transition-all duration-300">Save</button>
                <button @click="handleCancel" type="button" class="font-medium bg-profile text-primary py-2 px-5 rounded-md hover:bg-opacity-70 transition-all duration-300">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
  
const authStore = useAuthStore();

const chinese_menu = ref('');
const indonesian_menu = ref('');
const english_menu = ref('');
const small_price = ref('');
const medium_price = ref('');
const large_price = ref('');
const stock = ref('');
const chinese_desc = ref('');
const indonesian_desc = ref('');
const english_desc = ref('');
const selectedCategory = ref('');
const categories = ref([]);
const imageFile = ref(null);
const previewImage = ref('');
const best_selling = ref(false);

const router = useRouter();

// Fetch categories on component mount
onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/categories', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        categories.value = response.data.data.sort((a, b) => {
            return a.indonesian_category.localeCompare(b.indonesian_category);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});

const handleSubmit = async () => {
    if (!chinese_menu.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu name in Chinese',
        });
        return;
    }
    if (!indonesian_menu.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu name in Indonesian',
        });
        return;
    }
    if (!english_menu.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu name in English',
        });
        return;
    }
    if (!selectedCategory.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please select a menu category',
        });
        return;
    }
    if (!small_price.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu price (S)',
        });
        return;
    }
    if (!medium_price.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu price (M)',
        });
        return;
    }
    if (!large_price.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fill the menu price (L)',
        });
        return;
    }
    if (!stock.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please select the stock availability',
        });
        return;
    }
    if (!imageFile.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select an image',
        });
        return;
    }

    try {
        const bestSellingStringValue = best_selling.value ? 1 : 0;

        // Create form data
        const formData = new FormData();
        formData.append('chinese_menu', chinese_menu.value);
        formData.append('indonesian_menu', indonesian_menu.value);
        formData.append('category_id', selectedCategory.value);
        formData.append('english_menu', english_menu.value);
        formData.append('small_price', small_price.value);
        formData.append('medium_price', medium_price.value);
        formData.append('large_price', large_price.value);
        formData.append('stock', stock.value);
        formData.append('chinese_desc', chinese_desc.value);
        formData.append('indonesian_desc', indonesian_desc.value);
        formData.append('english_desc', english_desc.value);
        formData.append('image', imageFile.value);
        formData.append('best_selling', bestSellingStringValue);

        // Send form data to backend
        await axios.post('http://localhost:8000/api/menus', formData, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        handleSuccessAlert();
    } catch (error) {
        console.error('Error creating menu:', error);

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create menu',
        });
    }
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file size exceeds 20MB
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 20) {
        // Show sweet alert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The maximum image size is 20MB',
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const maxWidth = 800; // Maximum width for the compressed image
            const maxHeight = 600; // Maximum height for the compressed image

            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas with new dimensions
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                // Use the compressed blob for preview or upload
                previewImage.value = URL.createObjectURL(blob);
                imageFile.value = blob;
            }, file.type, 0.7); // Adjust compression quality here (0.7 = 70% quality)
        };
    };
    reader.readAsDataURL(file);
};

const handleSuccessAlert = async () => {
    const result = await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Menu created successfully',
        showCancelButton: true,
        confirmButtonText: 'Go to Menu List',
        cancelButtonText: 'OK'
    });

    if (result.isConfirmed) {
        router.push('/menulist');
    } else {
        // Reset form here
        chinese_menu.value = '';
        indonesian_menu.value = '';
        english_menu.value = '';
        small_price.value = '';
        medium_price.value = '';
        large_price.value = '';
        stock.value = '';
        chinese_desc.value = '';
        indonesian_desc.value = '';
        english_desc.value = '';
        selectedCategory.value = '';
        imageFile.value = null;
        previewImage.value = '';
    }
};

const handleCancel = async () => {
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

    if (result.isConfirmed) {
        router.go(-1);
    }
};
</script>
