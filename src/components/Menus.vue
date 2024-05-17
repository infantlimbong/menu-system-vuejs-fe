<template>
    <div class="body pb-20 -mt-16 lg:-mt-20 lg:-ml-64">
        <div class="grid grid-cols-2 md:flex md:justify-between md:items-center gap-y-2 lg:px-16 lg:pt-5">
            <h1 class="text-2xl font-bold md:min-w-36 order-1">GTC</h1>
            <h1 v-if="selectedLanguage == 'chinese'" class="text-2xl font-serif order-3 col-span-2 text-center text-profile md:text-3xl md:order-2">Food Menus</h1>
            <h1 v-if="selectedLanguage == 'indonesian'" class="text-2xl font-serif order-3 col-span-2 text-center text-profile md:text-3xl md:order-2">Menu Makanan</h1>
            <h1 v-if="selectedLanguage == 'english'" class="text-2xl font-serif order-3 col-span-2 text-center text-profile md:text-3xl md:order-2">Food Menus</h1>
            <div class="text-end relative w-full order-2 md:min-w-36 md:order-3 md:w-auto">
                <button @click="openDropdown = !openDropdown" class="py-1 px-3 border border-profile rounded-full capitalize">
                    {{ selectedLanguage }}
                    <i v-if="openDropdown" class='bx bx-chevron-up'></i>
                    <i v-if="!openDropdown" class='bx bx-chevron-down'></i>
                </button>
                <div v-show="openDropdown" class="absolute right-0 top-10 z-10 mt-2 w-36 bg-white rounded-md shadow-lg">
                    <button @click="selectedLanguage = 'chinese'; openDropdown = false" class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Chinese</button>
                    <button @click="selectedLanguage = 'indonesian'; openDropdown = false" class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Indonesian</button>
                    <button @click="selectedLanguage = 'english'; openDropdown = false" class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">English</button>
                </div>
            </div>
        </div>
        <div class="flex justify-center w-full">
            <div class="relative w-full mt-5 justify-center md:mt-6 md:flex md:max-w-xl">
                <input type="text" v-model="searchQuery" id="searchQuery" placeholder="Search menus..." class="relative py-2 px-4 w-full focus:outline-profile rounded-full border border-profile">
                <i class='absolute bx bx-search text-profile text-xl top-3 right-4'></i>
            </div>
        </div>
        <div class="flex justify-center my-5 md:my-2 md:mt-8 ">
            <div class="flex justify-center items-center flex-wrap gap-3 w-full max-w-4xl md:justify-between">
                <div class="text-center flex-grow">
                    <small class="text-gray-700">{{ getNumberOfMenusMessage }}</small>
                </div>
                <div class="overflow-x-auto flex-grow">
                    <div class="flex justify-center items-center">
                        <button @click="prevPage" :disabled="currentPage === 1" class="text-sm px-2 py-1 text-white bg-profile md:text-lg" :class="{ 'opacity-50': currentPage === 1 }">
                            <i class='bx bx-chevron-left'></i>
                        </button>
                        <div class="flex" v-for="pageNumber in totalPages" :key="pageNumber">
                            <button @click="setCurrentPage(pageNumber)" :class="{ 'bg-profile border-y border-profile text-white': currentPage === pageNumber, 'border-y border-r border-profile text-profile': currentPage !== pageNumber }" class="text-xs font-semibold py-1 px-3 md:py-2">
                                {{ pageNumber }}
                            </button>
                        </div>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="text-sm px-2 py-1 text-white bg-profile md:text-lg" :class="{ 'opacity-50': currentPage === totalPages }">
                            <i class='bx bx-chevron-right'></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="flex justify-center items-center flex-wrap gap-2 overflow-x-auto max-w-4xl">
                <button @click="showAllMenus" :class="{ 'bg-profile text-white': selectedCategory === null, 'border border-profile': selectedCategory !== null }" class="text-xs font-semibold py-1 px-3 rounded-full md:py-2">
                    Semua
                </button>
                <button v-for="category in categories" :key="category.id" @click="filterMenus(category.id)" :class="{ 'bg-profile text-white': selectedCategory === category.id, 'border border-profile': selectedCategory !== category.id }" class="text-xs font-semibold py-1 px-3 rounded-full md:py-2">
                    {{ getCategoryName(category.id) }}
                </button>
            </div>
        </div>

        <div class="flex justify-center mt-20 md:px-20">
            <div v-if="filteredMenusPaginated.length > 0" class="max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div v-for="menu in filteredMenusPaginated" :key="menu.id" class="text-profile relative">
                    <div @click="showMenuDescription(menu)" class="cursor-pointer">
                        <div v-if="menu.stock == ('Habis')" class="absolute w-full h-40 flex justify-center items-center z-20 md:h-48">
                            <div class="text-profile bg-primary bg-opacity-70 px-3 text-center rounded-full">
                                <p class="text-xs">Stock</p>
                                <p class="font-bold text-sm -mt-2">Habis</p>
                            </div>
                        </div>
                        <div v-if="menu.best_selling === 1" class="absolute z-10 text-primary bg-profile rounded-full font-semibold text-xs py-1 px-2 left-0 top-3">
                            Best Selling
                        </div>
                        <img :src="getImageUrl(menu.image)" alt="Menu Image" class="h-40 w-full object-cover md:h-48" :class="{ 'grayscale z-10': menu.stock == ('Habis'), 'filter-shadow': menu.stock == ('Tersedia') }">
                        <div class="px-2 text-center">
                            <h3 class="text-lg font-semibold" v-if="selectedLanguage === 'chinese'">{{ menu.chinese_menu }}</h3>
                            <h3 class="text-lg font-semibold font-cinzel capitalize" v-if="selectedLanguage === 'indonesian'">{{ menu.indonesian_menu }}</h3>
                            <h3 class="text-lg font-semibold font-cinzel capitalize" v-if="selectedLanguage === 'english'">{{ menu.english_menu }}</h3>
                            <div class="flex justify-center gap-x-3 flex-wrap font-sans text-sm text-gray-700">
                                <div v-if="menu.small_price && menu.small_price.length > 0" class="flex justify-center">
                                    (S) Rp{{ formatPrice(menu.small_price) }}
                                </div>
                                <div v-if="menu.medium_price && menu.medium_price.length > 0" class="flex justify-center">
                                    (M) Rp{{ formatPrice(menu.medium_price) }}
                                </div>
                                <div v-if="menu.large_price && menu.large_price.length > 0" class="flex justify-center">
                                    (L) Rp{{ formatPrice(menu.large_price) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center">
                <h5 v-if="selectedLanguage == 'chinese'">No menu found</h5>
                <h5 v-if="selectedLanguage == 'indonesian'">Tidak ada Menu</h5>
                <h5 v-if="selectedLanguage == 'english'">No menu found</h5>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div class="fixed inset-0 bg-black opacity-50"></div>
            <div class="relative bg-white rounded-lg p-5 max-w-md md:p-8">
                <button @click="closeModal" class="absolute top-0 right-0 p-2">
                    <i class="bx bx-x-circle text-2xl text-gray-500 hover:text-profile"></i>
                </button>
                <div class="relative">
                    <div v-if="selectedMenu.stock == ('Habis')" class="absolute w-full h-48 flex justify-center items-center z-20 md:h-60">
                        <div class="text-profile bg-primary bg-opacity-70 px-3 text-center rounded-full">
                            <p class="text-xs">Stock</p>
                            <p class="font-bold text-sm -mt-2">Habis</p>
                        </div>
                    </div>
                    <div v-if="selectedMenu.best_selling === 1" class="absolute z-10 text-primary bg-profile rounded-full font-semibold text-xs py-1 px-2 left-0 top-0">
                        Best Selling
                    </div>
                    <img :src="getImageUrl(selectedMenu.image)" alt="Menu Image" class="h-48 w-full object-cover md:h-60" :class="{ 'grayscale z-10': selectedMenu.stock == ('Habis'), 'filter-shadow': selectedMenu.stock == ('Tersedia') }">
                    <h3 class="text-lg text-center text-profile font-semibold" v-if="selectedLanguage === 'chinese'">{{ selectedMenu.chinese_menu }}</h3>
                    <h3 class="text-lg text-center text-profile font-semibold font-cinzel capitalize" v-if="selectedLanguage === 'indonesian'">{{ selectedMenu.indonesian_menu }}</h3>
                    <h3 class="text-lg text-center text-profile font-semibold font-cinzel capitalize" v-if="selectedLanguage === 'english'">{{ selectedMenu.english_menu }}</h3>
                    <div class="flex justify-between font-sans text-sm text-gray-700">
                        <div v-if="selectedMenu.small_price && selectedMenu.small_price.length > 0" class="flex justify-center">
                            (S) Rp{{ formatPrice(selectedMenu.small_price) }}
                        </div>
                        <div v-if="selectedMenu.medium_price && selectedMenu.medium_price.length > 0" class="flex justify-center">
                            (M) Rp{{ formatPrice(selectedMenu.medium_price) }}
                        </div>
                        <div v-if="selectedMenu.large_price && selectedMenu.large_price.length > 0" class="flex justify-center">
                            (L) Rp{{ formatPrice(selectedMenu.large_price) }}
                        </div>
                    </div>
                </div>
                <h2 class="text-lg font-semibold mt-3">Description</h2>
                <p v-if="selectedLanguage === 'chinese'" class="text-justify">{{ selectedMenu.chinese_desc || 'No Description' }}</p>
                <p v-if="selectedLanguage === 'indonesian'" class="text-justify">{{ selectedMenu.indonesian_desc || 'Tidak ada Deskripsi' }}</p>
                <p v-if="selectedLanguage === 'english'" class="text-justify">{{ selectedMenu.english_desc || 'No Description' }}</p>
            </div>
        </div>

        <div class="flex justify-center mt-5 md:mt-10">
            <div class="flex justify-center items-center max-w-4xl flex-wrap">
                <button @click="prevPage" :disabled="currentPage === 1" class="text-sm px-2 py-1 text-white bg-profile md:text-lg" :class="{ 'opacity-50': currentPage === 1 }">
                    <i class='bx bx-chevron-left'></i>
                </button>
                <div class="flex" v-for="pageNumber in totalPages" :key="pageNumber">
                    <button @click="setCurrentPage(pageNumber)" :class="{ 'bg-profile border-y border-profile text-white': currentPage === pageNumber, 'border-y border-r border-profile text-profile': currentPage !== pageNumber }" class="text-xs font-semibold py-1 px-3 md:py-2">
                        {{ pageNumber }}
                    </button>
                </div>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="text-sm px-2 py-1 text-white bg-profile md:text-lg" :class="{ 'opacity-50': currentPage === totalPages }">
                    <i class='bx bx-chevron-right'></i>
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const menus = ref([]);
const categories = ref([]);
const selectedLanguage = ref('indonesian');
const selectedCategory = ref(null);
const searchQuery = ref('');
const openDropdown = ref(false);
const showModal = ref(false);
const selectedMenu = ref(null);
const itemsPerPage = 20;
const currentPage = ref(1);

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fetch data from Laravel API
onMounted(async () => {
    try {
        const menuResponse = await fetch('http://localhost:8000/api/list-menus');
        const menuData = await menuResponse.json();
        menus.value = menuData.data;

        const categoryResponse = await fetch('http://localhost:8000/api/list-categories');
        const categoryData = await categoryResponse.json();
        categories.value = categoryData.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Filter menus based on selected category
const filteredMenus = computed(() => {
    let filtered = menus.value;
    if (selectedCategory.value !== null) {
        filtered = filtered.filter(menu => menu.category_id === selectedCategory.value);
    }
    if (searchQuery.value.trim() !== '') {
        const search = searchQuery.value.trim().toLowerCase();
        filtered = filtered.filter(menu => menu[selectedLanguage.value + '_menu'].toLowerCase().includes(search));
    }
    return filtered;
});

// Update totalPages based on filtered menus
const totalPages = computed(() => Math.ceil(filteredMenus.value.length / itemsPerPage));

// Update filteredMenusPaginated based on currentPage and filteredMenus
const filteredMenusPaginated = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMenus.value.slice(startIndex, endIndex);
});

// Watch for changes in searchQuery, reset currentPage when it changes
watch(searchQuery, () => {
    currentPage.value = 1;
});

// Function to set current page
const setCurrentPage = (pageNumber) => {
    currentPage.value = pageNumber;
};

// Function to navigate to next page
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

// Function to navigate to previous page
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// Function to get image URL
const getImageUrl = (imageName) => {
    return `http://localhost/grand_teo_chew/public${imageName}`;
};

// Function to get category name based on category_id
const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category[selectedLanguage.value + '_category'] : 'Unknown';
};

// Function to filter menus based on category
const filterMenus = (categoryId) => {
    selectedCategory.value = categoryId;
};

// Function to show all menus
const showAllMenus = () => {
    selectedCategory.value = null;
}

// Function to show menu description
const showMenuDescription = (menu) => {
    selectedMenu.value = menu;
    showModal.value = true;
};

// Function to close modal
const closeModal = () => {
    showModal.value = false;
};

// Function to handle click outside modal
const handleOutsideClick = (event) => {
    if (!event.target.closest('.relative')) {
        closeModal();
    }
};

// Watch for click events outside modal
onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
});

// Computed property for number of menus message
const getNumberOfMenusMessage = computed(() => {
    const totalMenus = filteredMenus.value.length;
    switch (selectedLanguage.value) {
    case 'chinese':
        return `Found ${totalMenus} kinds of menus`;
    case 'indonesian':
        return `Ditemukan ${totalMenus} macam menu`;
    case 'english':
        return `Found ${totalMenus} kinds of menus`;
    default:
        return `Ditemukan ${totalMenus} macam produk`;
    }
});
</script>

<style scoped>
    .body{
        background-color: #FDF6F0;
        background-image:  linear-gradient(135deg, #F8F1EB 25%, transparent 25%), linear-gradient(225deg, #F8F1EB 25%, transparent 25%), linear-gradient(45deg, #F8F1EB 25%, transparent 25%), linear-gradient(315deg, #F8F1EB 25%, #FDF6F0 25%);
        background-position:  10px 0, 10px 0, 0 0, 0 0;
        background-size: 20px 20px;
        background-repeat: repeat;
    }

    .filter-shadow {
        filter: drop-shadow(10px 15px 8px rgba(0, 0, 0, 0.4)); /* Example custom shadow */
    }
</style>
  