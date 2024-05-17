import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/components/Dashboard.vue'

// Categories
import CategoryCreate from '@/components/CategoryCreate.vue'
import CategoryList from '@/components/CategoryList.vue'

// Menus
import MenuCreate from '@/components/MenuCreate.vue'
import MenuList from '@/components/MenuList.vue'
import Menus from '@/components/Menus.vue'

// Users
import Login from '@/components/Login.vue'
import UserRegister from '@/components/UserRegister.vue'
import UserList from '@/components/UserList.vue'

import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'menus',
      component: Menus
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },

    // Login & Users
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: UserRegister,
    },
    {
      path: "/userlist",
      name: "userlist",
      component: UserList,
    },

    
    // Categories
    {
      path: '/categorylist',
      name: 'categorylist',
      component: CategoryList
    },
    {
      path: '/categorycreate',
      name: 'categorycreate',
      component: CategoryCreate
    },

    // Menus for admin
    {
      path: '/menucreate',
      name: 'menucreate',
      component: MenuCreate
    },
    {
      path: '/menulist',
      name: 'menulist',
      component: MenuList
    },
  ]
});

// Add global navigation guards to the router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.name !== "login" && to.name !== "menus" && !authStore.isLoggedIn) {
    next({ name: "login" });
  } else {
    next();
  }
});


export default router
