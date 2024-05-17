<template>
  <div class="overflow-hidden">
    <header v-if="authStore.isLoggedIn" class="bg-white font-segoe flex flex-col fixed w-full shadow-md z-40 lg:flex-row lg:justify-between lg:items-center">
      <div class="relative text-primary bg-profile flex py-3 px-2 justify-between items-center sm:px-5 lg:py-4 lg:justify-normal lg:w-64">
        <h1 class="text-lg font-bold flex items-center">
          <img src="./assets/gtc_logo.png" alt="logo" class="w-6 h-6 mr-2 md:w-8 md:h-8 md:left-4">
          <p>Menu List</p>
        </h1>
        <button class="bg-profile lg:absolute lg:-right-5 lg:w-10 lg:aspect-square lg:flex lg:items-center lg:justify-center lg:rounded-full" @click="toggleSidebar">
          <i class="bx bx-menu text-2xl"></i>
        </button>
      </div>

      <h2 class="text-end px-3 bg-primary text-profile capitalize lg:bg-white" v-if="authStore.user && authStore.user.data && authStore.user.data.name">
        Welcome, <b>{{ authStore.user.data.name }} 👋</b>
      </h2>
    </header>

    <aside v-if="authStore.isLoggedIn" class="text-primary font-segoe py-4 px-2 w-48 h-screen fixed top-11 mt-1 z-50 bg-gradient-to-b from-profile to-secondary transition-all duration-300 sm:w-60 sm:px-5 lg:w-64 lg:top-14" :class="{ '-ml-64': !isSidebarOpen }">
      <ul class="space-y-2">
        <li class="rounded-md hover:bg-primary hover:text-profile transition-all duration-300" :class="{ 'bg-primary text-profile': $route.path === '/dashboard' }">
          <router-link to="/dashboard">
            <div class="flex items-center py-1 ps-2 sm:py-2 lg:py-3">
              <i class="bx bxs-dashboard text-xl"></i>
              <span class="ms-2">Dashboard</span>
            </div>
          </router-link>
        </li>

        <li class="rounded-md hover:bg-primary hover:text-profile transition-all duration-300" :class="{ 'bg-primary text-profile': $route.path === '/categorylist' || $route.path === '/categorycreate' }">
          <router-link to="/categorylist">
            <div class="flex items-center py-1 ps-2 sm:py-2 lg:py-3">
              <i class='bx bx-category-alt text-xl'></i>
              <span class="ms-2">Category</span>
            </div>
          </router-link>
        </li>

        <li class="rounded-md hover:bg-primary hover:text-profile transition-all duration-300" :class="{ 'bg-primary text-profile': $route.path === '/menulist' || $route.path === '/menucreate' }">
          <router-link to="/menulist">
            <div class="flex items-center py-1 ps-2 sm:py-2 lg:py-3">
              <i class='bx bxs-food-menu text-xl'></i>
              <span class="ms-2">Menu</span>
            </div>
          </router-link>
        </li>
        <li class="rounded-md hover:bg-primary hover:text-profile transition-all duration-300" :class="{ 'bg-primary text-profile': $route.path === '/userlist' || $route.path === '/register' }">
          <router-link to="/userlist">
            <div class="flex items-center py-1 ps-2 sm:py-2 lg:py-3">
              <i class='bx bx-user text-xl'></i>
              <span class="ms-2">User</span>
            </div>
          </router-link>
        </li>
        <li class="rounded-md hover:bg-primary hover:text-profile transition-all duration-300">
          <button @click="logout" class="w-full flex items-center py-1 ps-2 sm:py-2 lg:py-3">
            <i class="bx bx-log-out text-xl"></i>
            <span class="ms-2">Logout</span>
          </button>
        </li>
      </ul>
    </aside>

    <div class="font-segoe mt-20 transition-all duration-300 bg-white md:mt-20" :class="{ 'lg:ml-64': isSidebarOpen }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
  
const authStore = useAuthStore();
const router = useRouter();
// Sidebar state
const isSidebarOpen = ref(true)

onMounted(() => {
  // Check if screen size is large enough to keep sidebar open
  const mediaQuery = window.matchMedia("(min-width: 1024px)")
  isSidebarOpen.value = mediaQuery.matches
  
  // Listen to changes in screen size and update sidebar state accordingly
  const handleResize = () => {
    isSidebarOpen.value = mediaQuery.matches
  }
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})

// Toggle sidebar function
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>
