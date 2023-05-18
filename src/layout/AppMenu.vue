<script setup>
import { ref } from 'vue';

import AppSubMenu from './AppSubMenu.vue';

const model = ref([
    {
        label: '',
        icon: 'pi pi-home',
        items: [
            {
                label: 'Danh sách cuộc thi',
                icon: 'pi pi-fw pi-list',
                to: '/competitions/list'
            },
            {
                label: 'Chấm điểm',
                icon: 'pi pi-fw pi-pencil',
                to: '/competitions/score'
            }
        ]
    }
]);
</script>

<template>
    <AppSubMenu :model="model" />
</template>

<style lang="scss" scoped></style>
