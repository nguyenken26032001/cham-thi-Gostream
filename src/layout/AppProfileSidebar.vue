<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const { layoutState } = useLayout();
const user = JSON.parse(localStorage.getItem("user"));
const signout = () => {
    localStorage.removeItem("user")
    router.push({ name: "login" })
}
</script>

<template>
    <Sidebar v-model:visible="layoutState.profileSidebarVisible.value" position="right"
        class="layout-profile-sidebar w-full sm:w-25rem">
        <div class="flex flex-column mx-auto md:mx-0">
            <span class="mb-2 font-semibold">Welcome</span>
            <span class="text-color-secondary font-medium mb-5">{{ user.email }}</span>

            <ul class="list-none m-0 p-0">
                <li>
                    <a
                        class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-user text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Profile</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150"
                        @click="signout">
                        <span>
                            <i class="pi pi-power-off text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Sign Out</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </Sidebar>
</template>
