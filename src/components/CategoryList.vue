<template>
    <div class="mx-auto mt-8 p-4">
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-xl font-semibold mb-4 md:text-2xl">Category List</h2>
            <RouterLink to="/categorycreate" class="bg-profile text-primary px-3 py-1 rounded-md md:py-2">Add Category</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse">
                <thead>
                    <tr class="bg-primary text-profile rounded-lg text-left">
                        <th class="px-4 py-3 border-b rounded-tl-lg">No.</th>
                        <th class="px-4 py-3 border-b">Chinese Category</th>
                        <th class="px-4 py-3 border-b">Indonesian Category</th>
                        <th class="px-4 py-3 border-b">English Category</th>
                        <th class="px-4 py-3 border-b rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody class="outline outline-primary" v-if="categories.length > 0">
                    <tr v-for="(category, loop) in categories" :key="category.id" class="hover:bg-profile/10 even:bg-profile/5 text-left">
                        <td class="px-4 py-3 border-b border-primary">{{ loop + 1 }}.</td>
                        <td class="px-4 py-3 border-b border-primary">{{ category.chinese_category }}</td>
                        <td class="px-4 py-3 border-b border-primary">{{ category.indonesian_category }}</td>
                        <td class="px-4 py-3 border-b border-primary">{{ category.english_category }}</td>
                        <td class="px-4 py-3 border-b border-primary">
                            <button @click="editCategory(category)" class="text-blue-600 me-3"><i class='bx bxs-edit text-xl'></i></button>
                            <button @click="deleteCategory(category.id)" class="text-profile"><i class='bx bxs-trash text-xl'></i></button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="12" class="text-center py-10">Data Kosong</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Edit Category Modal -->
        <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg w-full text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                    <div class="flex w-full justify-center bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="w-full">
                            <div class="mt-3 sm:mt-0 sm:text-left">
                                <h3 class="text-lg font-medium text-profile text-center mb-4">Edit Category</h3>
                                <div class="mt-2">
                                    <div class="mb-4">
                                        <label for="editChineseCategory" class="block text-sm font-medium text-gray-800">Category in Chinese (中国人)</label>
                                        <input v-model="editChineseCategory" type="text" id="editChineseCategory" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                    <div class="mb-4">
                                        <label for="editIndonesianCategory" class="block text-sm font-medium text-gray-800">Category in Indonesian</label>
                                        <input v-model="editIndonesianCategory" type="text" id="editIndonesianCategory" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                    <div>
                                        <label for="editEnglishCategory" class="block text-sm font-medium text-gray-800">Category in English</label>
                                        <input v-model="editEnglishCategory" type="text" id="editEnglishCategory" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="updateCategory" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-profile hover:bg-opacity-70 transition-all duration-300 sm:ml-3 sm:w-auto sm:text-sm">
                            Update
                        </button>
                        <button @click="closeEditModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-primary shadow-sm px-4 py-2 bg-profile text-base font-medium text-primary hover:bg-opacity-80 transition-all duration-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from "@/stores/auth";
  
const authStore = useAuthStore();

const categories = ref([]);
const showEditModal = ref(false);
let editingCategory = null;

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/categories', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        categories.value = response.data.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});

const deleteCategory = async (categoryId) => {
    try {
        // Show confirmation dialog
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Deleting this category will also delete all of its menus. This action cannot be undone.',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            // Send delete request to API
            await axios.delete(`http://localhost:8000/api/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            
            // Remove the deleted category from the list
            categories.value = categories.value.filter(category => category.id !== categoryId);
            
            // Show success message
            await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Category deleted successfully',
            });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete category',
        });
    }
};

const editCategory = (category) => {
    editingCategory = category;
    showEditModal.value = true;
    // Set the initial values of edit category fields
    editChineseCategory.value = category.chinese_category;
    editIndonesianCategory.value = category.indonesian_category;
    editEnglishCategory.value = category.english_category;
};

const updateCategory = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/api/categories/${editingCategory.id}`, {
            chinese_category: editChineseCategory.value,
            indonesian_category: editIndonesianCategory.value,
            english_category: editEnglishCategory.value
        },
        {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        
        // Update category in the list
        const index = categories.value.findIndex(category => category.id === editingCategory.id);
        if (index !== -1) {
            categories.value[index] = response.data;
        }

        // Close modal
        showEditModal.value = false;
        
        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Category updated successfully',
            text: 'Reload the page to see the results',
        });
    } catch (error) {
        console.error('Error updating category:', error);
        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update category',
        });
    }
};

const closeEditModal = () => {
    showEditModal.value = false;
};

// Variables to store edited category values
const editChineseCategory = ref('');
const editIndonesianCategory = ref('');
const editEnglishCategory = ref('');
</script>