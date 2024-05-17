<template>
    <div class="p-4">
        <div class="flex flex-wrap gap-3">
            <div class="w-full bg-profile text-primary px-4 py-3 rounded-2xl flex-grow basis-52">
                <h5 class="font-semibold">Total Users</h5>
                <div class="grid place-items-center py-8">
                    <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalUsers) }}</p>
                </div>
            </div>

            <div class="w-full bg-profile text-primary px-4 py-3 rounded-2xl flex-grow basis-52">
                <h5 class="font-semibold">Total Categories</h5>
                <div class="grid place-items-center py-8">
                    <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalCategories) }}</p>
                </div>
            </div>

            <div class="w-full bg-profile text-primary px-4 py-3 rounded-2xl flex-grow basis-52">
                <h5 class="font-semibold">Total Menus</h5>
                <div class="grid place-items-center py-8">
                    <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalMenus) }}</p>
                </div>
            </div>
        </div>

        <hr class="my-10 rounded-md border-profile">
        <h1 class="text-center font-semibold text-2xl text-profile font-serif md:text-3xl">Menu Categories</h1>
        <div class="flex flex-wrap mt-3 gap-3">
            <div v-for="category in categories" :key="category.id" class="w-full bg-primary text-profile px-4 py-3 rounded-2xl flex-grow basis-40" :style="{ backgroundColor: category.backgroundColor }">
                <h5 class="font-semibold capitalize text-sm">{{ category.english_category }}</h5>
                <div class="grid place-items-center py-3">
                    <p class="text-xl font-bold md:text-2xl">{{ formatNumber(category.menuCount) }}</p>
                    <p v-if="category.menuCount > 1" class="text-xs">Menus</p>
                    <p v-else class="text-xs">Menu</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import axios from "axios";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();

    const totalUsers = ref(0);
    const totalCategories = ref(0);
    const totalMenus = ref(0);
    const categories = ref([]);

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Fetch user data from API
    const fetchUser = async () => {
        const apiUrl = `http://localhost:8000/api/users`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            totalUsers.value = response.data.data.length;

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch complaint data from API
    const fetchCategories = async () => {
        const apiUrl = `http://localhost:8000/api/categories`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            totalCategories.value = response.data.data.length;

            // Fetch menu counts for each category
            await Promise.all(
                response.data.data.map(async (category) => {
                    const menuCount = await fetchMenuCount(category.id);
                    categories.value.push({
                        id: category.id,
                        english_category: category.english_category,
                        menuCount,
                        backgroundColor: getRandomColor(), // Assign random background color
                    });
                })
            );
        } catch (error) {
            console.error('Error fetching categories data:', error);
        }
    };

    // Fetch menu count for a specific category
    const fetchMenuCount = async (categoryId) => {
        const apiUrl = `http://localhost:8000/api/categories/${categoryId}/menus/count`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            return response.data.count;
        } catch (error) {
            console.error("Error fetching menu count for category:", error);
            return 0;
        }
    };

    // Fetch ratings data from API
    const fetchMenus = async () => {
        const apiUrl = `http://localhost:8000/api/menus`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            totalMenus.value = response.data.data.length;
        } catch (error) {
            console.error('Error fetching menus data:', error);
        }
    };

    // Fetch initial data when component is mounted
    onMounted(() => {
        fetchUser();
        fetchCategories();
        fetchMenus();
    });

    const getRandomColor = () => {
    // Generate a random hexadecimal color code
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };
</script>