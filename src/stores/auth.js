import { defineStore } from "pinia";
import axios from "axios";
import Swal from 'sweetalert2';

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    accessToken: null,
    userData: null,
  }),
  getters: {
    isLoggedIn() {
      return this.accessToken !== null;
    },
    getUserData() {
      return this.userData;
    },
  },
  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      // Fetch user data when access token is set
      this.fetchUser();
    },

    setUser(user) {
        this.user = user;
    },
  
    removeAccessToken() {
      this.accessToken = null;
      this.userData = null; // Clear user data when access token is removed
    },
    async fetchUser() {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        this.setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    logout() {
      try {
        axios.post("http://localhost:8000/api/logout", null, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        this.removeAccessToken();
        // Display SweetAlert for successful logout
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("An error occurred during logout:", error.message);
      }
    },
  },
});
