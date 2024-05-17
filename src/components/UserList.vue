<template>
    <div class="mx-auto mt-8 p-4">
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-xl font-semibold mb-4 md:text-2xl">User List</h2>
            <RouterLink v-if="authStore.user.data.email == ('gaby@gmail.com')" to="/register" class="bg-profile text-primary px-3 py-1 rounded-md md:py-2">Add User</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse">
                <thead>
                    <tr class="bg-primary text-profile rounded-lg text-left">
                        <th class="px-4 py-3 border-b rounded-tl-lg">No.</th>
                        <th class="px-4 py-3 border-b">Name</th>
                        <th class="px-4 py-3 border-b">Email</th>
                        <th class="px-4 py-3 border-b">Registered Date</th>
                        <th class="px-4 py-3 border-b rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody class="outline outline-primary" v-if="users.length > 0">
                    <tr v-for="(user, loop) in users" :key="user.id" class="hover:bg-profile/10 even:bg-profile/5 text-left" :class="{ 'text-primary font-bold': authStore.user.data.id === user.id }">
                        <td class="px-4 py-3 border-b border-primary">{{ loop + 1 }}.</td>
                        <td class="px-4 py-3 border-b border-primary">{{ user.name }}</td>
                        <td class="px-4 py-3 border-b border-primary">{{ user.email }}</td>
                        <td class="px-4 py-3 border-b border-primary">{{ formattedDate(user.created_at) }}</td>
                        <td class="px-4 py-3 border-b border-primary">
                            <button v-if="authStore.user.data.email == ('gaby@gmail.com') || authStore.user.data.id === user.id" @click="editUser(user)" class="text-blue-600 me-3"><i class='bx bxs-edit text-xl'></i></button>
                            <p v-else class="text-gray-700 text-sm italic">Not Permitted</p>
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
        <!-- Edit User Modal -->
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
                                <h3 class="text-lg font-medium text-profile text-center mb-4">Edit User</h3>
                                <div class="mt-2">
                                    <div class="mb-4">
                                        <label for="editName" class="block text-sm font-medium text-gray-800">Name</label>
                                        <input v-model="editName" type="text" id="editName" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                    <div class="mb-4">
                                        <label for="editEmail" class="block text-sm font-medium text-gray-800">Email <span class="italic text-sm font-light text-profile">(Email can't be changed)</span></label>
                                        <input disabled v-model="editEmail" type="email" id="editEmail" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                    <div class="mb-4">
                                        <label for="editPassword" class="block text-sm font-medium text-gray-800">Password <span class="italic text-sm font-light text-yellow-600">(Empty if you don't want to change your password)</span></label>
                                        <input v-model="editPassword" type="password" id="editPassword" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                    <div class="">
                                        <label for="editPasswordConfirmation" class="block text-sm font-medium text-gray-800">Confirm Password</label>
                                        <input v-model="editPasswordConfirmation" type="password" id="editPasswordConfirmation" class="mt-1 shadow appearance-none border border-primary rounded h-10 w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="updateUser" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-profile hover:bg-opacity-70 transition-all duration-300 sm:ml-3 sm:w-auto sm:text-sm">
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

const users = ref([]);
const showEditModal = ref(false);
let editingUser = null;

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/users', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        users.value = response.data.data;

    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

const editUser = (user) => {
    editingUser = user;
    showEditModal.value = true;
    // Set the initial values of edit user fields
    editName.value = user.name;
    editEmail.value = user.email;
    editPassword.value = user.password;
    editPasswordConfirmation.value = user.editPasswordConfirmation;
};

const updateUser = async () => {

    if (!editName.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill the field "Name"',
        });
        return;
    }

    if (editPassword.value !== editPasswordConfirmation.value) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Password does not match',
        });
        return;
    }

    try {
        const response = await axios.put(`http://localhost:8000/api/users/${editingUser.id}`, {
            name: editName.value,
            email: editEmail.value,
            password: editPassword.value
        },
        {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        
        // Update user in the list
        const index = users.value.findIndex(user => user.id === editingUser.id);
        if (index !== -1) {
            users.value[index] = response.data;
        }

        // Close modal
        showEditModal.value = false;
        
        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User updated successfully',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update user',
        });
    }
};

const closeEditModal = () => {
    showEditModal.value = false;
};

// Variables to store edited user values
const editName = ref('');
const editEmail = ref('');
const editPassword = ref('');
const editPasswordConfirmation = ref('');

const formattedDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const createdAtDate = new Date(date);

    if (createdAtDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (createdAtDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return createdAtDate.toLocaleDateString(undefined, options);
    }
};
</script>
