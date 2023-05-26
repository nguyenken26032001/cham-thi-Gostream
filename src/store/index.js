import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        role: ''
    }),
    getters: {
        getRole: (state) => state.role
    },
    actions: {
        initializeRole() {
            const infor = JSON.parse(localStorage.getItem('user'));
            console.log('okokok', infor.role);
            if (infor.role) {
                this.role = infor.role;
            }
        },
        setRole(new_role) {
            this.role = new_role;
        }
    }
});
