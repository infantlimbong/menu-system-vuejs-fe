<template>
    <div class="mx-auto mt-8 p-4">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold md:text-2xl">Menu List</h2>
            <RouterLink to="/menucreate" class="bg-profile text-primary px-3 py-1 rounded-md md:py-2">Add menu</RouterLink>
        </div>

        <div class="flex justify-between items-center flex-wrap my-5 gap-y-3">
            <select v-model="selectedCategoryId" id="categoryFilter" class="border border-primary rounded py-1 focus:outline-none">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.indonesian_category }}</option>
            </select>
            <div>
                <input v-model="searchQuery" type="text" placeholder="Search by Menu name..." id="searchQuery" class="border border-primary rounded py-1 px-3 focus:outline-none md:w-96">
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse">
                <thead>
                    <tr class="bg-primary text-center text-profile rounded-lg text-sm">
                        <th class="px-3 py-3 rounded-tl-lg">No.</th>
                        <th class="px-3 py-3">Menu</th>
                        <th class="px-3 py-3">Category</th>
                        <th colspan="3" class="px-3 py-3">Price (S, M, L)</th>
                        <th class="px-3 py-3">Stock</th>
                        <th class="px-3 py-3">Description</th>
                        <th class="px-3 py-3">Image</th>
                        <th class="px-3 py-3 rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody v-if="filteredMenus.length > 0">
                    <tr v-for="(menu, loop) in filteredMenus" :key="menu.id" class="hover:bg-profile/10 even:bg-profile/5 text-left">
                        <td class="px-3 py-3 border-b border-primary">{{ loop + 1 }}.</td>
                        <td class="px-3 py-3 border-b border-primary">{{ truncateText(menu.indonesian_menu ?? '', 15) }}</td>
                        <td class="px-3 py-3 border-b border-primary">{{ getCategoryName(menu.category_id) }}</td>
                        <td class="px-3 py-3 border-b border-primary">{{ formatPrice(menu.small_price) }}</td>
                        <td class="px-3 py-3 border-b border-primary">{{ formatPrice(menu.medium_price) }}</td>
                        <td class="px-3 py-3 border-b border-primary">{{ formatPrice(menu.large_price) }}</td>
                        <td class="px-3 py-3 border-b border-primary">
                            <div class="text-center rounded-md py-1 px-2 text-xs text-white"  :class="{ 'bg-green-500': menu.stock == ('Tersedia'), 'bg-profile': menu.stock == ('Habis') }">
                                {{ menu.stock }}
                            </div>
                        </td>
                        <td class="px-3 py-3 border-b border-primary">{{ truncateText(menu.indonesian_desc, 20) || '-' }}</td>
                        <td class="px-3 py-2 border-b border-primary min-w-32 cursor-pointer" @click="openImageModal(menu)">
                            <div class="flex justify-center">
                                <img :src="getImageUrl(menu.image)" alt="Menu Image" class="h-10 md:h-16 lg:h-24 object-cover">
                            </div>
                        </td>
                        <td class="px-3 py-2 border-b border-primary">
                            <div class="flex items-center">
                                <button @click="editMenu(menu)" class="text-blue-600 me-3" title="Edit"><i class='bx bxs-edit text-xl'></i></button>
                                <button @click="deleteMenu(menu.id)" class="text-profile" title="Delete"><i class='bx bxs-trash text-xl'></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="12" class="text-center py-10">Tidak ada Menu</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Edit Menu Modal -->
        <div v-if="showEditModal" class="fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg w-full text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                    <div class="flex w-full justify-center bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="w-full">
                            <div class="mt-3 sm:mt-0 sm:text-left">
                                <h3 class="text-lg font-medium text-profile text-center mb-4">Edit Menu</h3>
                                <div class="mt-2">
                                    <div class="mb-4 flex flex-col md:flex-row gap-3 ">
                                        <div class="w-full">
                                            <label for="editChineseMenu" class="block text-sm font-medium text-gray-800">Menu name in Chinese (中国人)</label>
                                            <input v-model="editChineseMenu" type="text" id="editChineseMenu" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="w-full">
                                            <label for="editIndonesianMenu" class="block text-sm font-medium text-gray-800">Menu name in Indonesian</label>
                                            <input v-model="editIndonesianMenu" type="text" id="editIndonesianMenu" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                    </div>
                                    <div class="mb-4 flex flex-col md:flex-row gap-3 ">
                                        <div class="w-full">
                                            <label for="editEnglishMenu" class="block text-sm font-medium text-gray-800">Menu name in English</label>
                                            <input v-model="editEnglishMenu" type="text" id="editEnglishMenu" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="w-full">
                                            <label for="editCategoryId" class="block text-sm font-medium text-gray-800">Category</label>
                                            <select v-model="editCategoryId" id="editCategoryId" class="mt-1 shadow border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                                <option value="" disabled>Select a category</option>
                                                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.indonesian_category }}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-4 flex flex-col md:flex-row gap-3 ">
                                        <div class="w-full">
                                            <label for="editSmallPrice" class="block text-sm font-medium text-gray-800">Price (S)</label>
                                            <input v-model="editSmallPrice" type="number" id="editSmallPrice" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="w-full">
                                            <label for="editMediumPrice" class="block text-sm font-medium text-gray-800">Price (M)</label>
                                            <input v-model="editMediumPrice" type="number" id="editMediumPrice" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                    </div>
                                    <div class="mb-4 flex flex-col md:flex-row gap-3 ">
                                        <div class="w-full">
                                            <label for="editLargePrice" class="block text-sm font-medium text-gray-800">Price (L)</label>
                                            <input v-model="editLargePrice" type="number" id="editLargePrice" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="w-full">
                                            <label for="editStock" class="block text-sm font-medium text-gray-800">Stock</label>
                                            <select v-model="editStock" id="editStock" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                                <option value="Tersedia">Tersedia</option>
                                                <option value="Habis">Habis</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3 w-full flex items-center gap-x-3">
                                        <label for="editBestSelling" class="block font-medium text-gray-800">Mark as Best Selling</label>
                                        <input v-model="editBestSelling" id="editBestSelling" type="checkbox" class="w-5 h-5 mt-1" :checked="editBestSelling">
                                    </div>
                                    <div class="w-full">
                                        <label for="editChineseDesc" class="block text-sm font-medium text-gray-800">Description in Chinese</label>
                                        <textarea v-model="editChineseDesc" rows="4" type="number" id="editChineseDesc" class="mt-1 shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                                    </div>
                                    <div class="w-full">
                                        <label for="editIndonesianDesc" class="block text-sm font-medium text-gray-800">Description in Indonesian</label>
                                        <textarea v-model="editIndonesianDesc" rows="4" type="number" id="editIndonesianDesc" class="mt-1 shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                                    </div>
                                    <div class="w-full">
                                        <label for="editEnglishDesc" class="block text-sm font-medium text-gray-800">Description in English</label>
                                        <textarea v-model="editEnglishDesc" rows="4" type="number" id="editEnglishDesc" class="mt-1 shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="updateMenu" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-profile hover:bg-opacity-70 transition-all duration-300 sm:ml-3 sm:w-auto sm:text-sm">
                            Update
                        </button>
                        <button @click="closeEditModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-primary shadow-sm px-4 py-2 bg-profile text-base font-medium text-primary hover:bg-opacity-80 transition-all duration-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for image editing -->
        <div v-if="showImageModal" class="fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Image</h3>
                            <!-- Image display -->
                            <img :src="getImageUrl(editingMenu.image)" alt="Menu Image" class="h-64 w-auto mx-auto mb-4 object-cover">
                            <!-- Form to upload new image -->
                            <div class="mb-4">
                                <label for="newImage" class="block text-sm font-medium text-gray-700">Edit Image</label>
                                <input type="file" id="newImage" @change="handleImageChange" accept="image/*" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" @click="closeImageModal" class="mt-3 w-full inline-flex justify-center rounded-md border  shadow-sm px-4 py-2 bg-profile text-primary text-base font-medium hover:bg-opacity-80 transition-all duration-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from "@/stores/auth";
  
const authStore = useAuthStore();

const menus = ref([]);
const categories = ref([]);
const showEditModal = ref(false);
let editingMenu = null;

const selectedCategoryId = ref('');

// Variables to store edited menu values
const editChineseMenu = ref('');
const editIndonesianMenu = ref('');
const editEnglishMenu = ref('');
const editCategoryId = ref('');
const editSmallPrice = ref('');
const editMediumPrice = ref('');
const editLargePrice = ref('');
const editStock = ref('');
const editChineseDesc = ref('');
const editIndonesianDesc = ref('');
const editEnglishDesc = ref('');
const editBestSelling = ref(false);

const searchQuery = ref('');

const showImageModal = ref(false);

// Method to open image modal
const openImageModal = (menu) => {
  editingMenu = menu;
  showImageModal.value = true;
};

// Method to close image modal
const closeImageModal = () => {
  showImageModal.value = false;
};

const handleImageChange = async (event) => {
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

    // Show confirmation dialog
    const result = await Swal.fire({
        icon: 'question',
        title: 'Update Image?',
        text: 'Are you sure you want to update the menu image?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
    });

    // If user confirms update
    if (result.isConfirmed) {
        // Continue with image compression and upload
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
                    // Use the compressed blob for upload
                    const formData = new FormData();
                    formData.append('image', blob);

                    // Send request to update menu image
                    axios.post(`http://localhost:8000/api/edit_image/${editingMenu.id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${authStore.accessToken}`,
                        },
                    }).then((response) => {
                        // Update menu with new image path
                        editingMenu.image = response.data.image;
                        // Close the modal
                        closeImageModal();
                        // Show success message
                        Swal.fire({
                            icon: 'success',
                            title: 'Image updated successfully',
                            text: 'Reload the page to see the results',
                        });
                    }).catch((error) => {
                        console.error('Error updating image:', error);
                        // Show error message
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update image',
                        });
                    });
                }, file.type, 0.7); // Adjust compression quality here (0.7 = 70% quality)
            };
        };
        reader.readAsDataURL(file);
    }
};


const formatPrice = (price) => {
    if (price == null) {
        return '-';
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const truncateText = (text, maxLength) => {
    if (typeof text === 'string' && text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

const getImageUrl = (imageName) => {
    // Assuming images are stored at 'http://localhost:8000/public'
    return `http://localhost/grand_teo_chew/public${imageName}`;
};


onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/menus', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        menus.value = response.data.data;
    } catch (error) {
        console.error('Error fetching menus:', error);
    }
});

const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.indonesian_category : '';
};

// Fetch menus and categories from the API
const fetchData = async () => {
    try {
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        categories.value = categoriesResponse.data.data.sort((a, b) => {
            return a.indonesian_category.localeCompare(b.indonesian_category)
        });

        // Fetch menus
        const menusResponse = await axios.get('http://localhost:8000/api/menus', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        menus.value = menusResponse.data.data.reverse();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const deleteMenu = async (menuId) => {
    try {
        // Show confirmation dialog
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Delete this menu? This action cannot be undone.',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            // Send delete request to API
            await axios.delete(`http://localhost:8000/api/menus/${menuId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            // Remove the deleted menu from the list
            menus.value = menus.value.filter(menu => menu.id !== menuId);
            
            // Show success message
            await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Menu deleted successfully',
            });
        }
    } catch (error) {
        console.error('Error deleting menu:', error);
        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete menu',
        });
    }
};

const editMenu = (menu) => {
    editingMenu = menu;
    showEditModal.value = true;
    // Set the initial values of edit menu fields
    editChineseMenu.value = menu.chinese_menu;
    editIndonesianMenu.value = menu.indonesian_menu;
    editEnglishMenu.value = menu.english_menu;
    editCategoryId.value = menu.category_id;
    editSmallPrice.value = menu.small_price;
    editMediumPrice.value = menu.medium_price;
    editLargePrice.value = menu.large_price;
    editStock.value = menu.stock;
    editChineseDesc.value = menu.chinese_desc;
    editIndonesianDesc.value = menu.indonesian_desc;
    editEnglishDesc.value = menu.english_desc;
    editBestSelling.value = menu.best_selling === 1;
};

const updateMenu = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/api/menus/${editingMenu.id}`, {
            chinese_menu: editChineseMenu.value,
            indonesian_menu: editIndonesianMenu.value,
            english_menu: editEnglishMenu.value,
            category_id: editCategoryId.value,
            small_price: editSmallPrice.value,
            medium_price: editMediumPrice.value,
            large_price: editLargePrice.value,
            stock: editStock.value,
            chinese_desc: editChineseDesc.value,
            indonesian_desc: editIndonesianDesc.value,
            english_desc: editEnglishDesc.value,
            best_selling: editBestSelling.value ? 1 : 0,
        },
        {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        
        // Update menu in the list
        const index = menus.value.findIndex(menu => menu.id === editingMenu.id);
        if (index !== -1) {
            menus.value[index] = response.data;
        }

        // Close modal
        showEditModal.value = false;
        
        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Menu updated successfully',
            text: 'Reload the page to see the results',
        });
    } catch (error) {
        console.error('Error updating menu:', error);
        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update menu',
        });
    }
};

const filterMenus = () => {
    const query = searchQuery.value.toLowerCase();
    return menus.value.filter(menu => {
        // Filter based on menu names in different languages
        return (
            menu.chinese_menu.toLowerCase().includes(query) ||
            menu.indonesian_menu.toLowerCase().includes(query) ||
            menu.english_menu.toLowerCase().includes(query)
        );
    });
};

// Computed property to filter menus based on the selected category ID
const filteredMenus = computed(() => {
    if (!selectedCategoryId.value && !searchQuery.value.trim()) {
        return menus.value;
    }

    if (!selectedCategoryId.value && searchQuery.value.trim()) {
        return filterMenus();
    }

    if (selectedCategoryId.value && !searchQuery.value.trim()) {
        return menus.value.filter(menu => menu.category_id === selectedCategoryId.value);
    }

    return filterMenus().filter(menu => menu.category_id === selectedCategoryId.value);
});

onMounted(() => {
    fetchData();
});

const closeEditModal = () => {
    showEditModal.value = false;
};
</script>