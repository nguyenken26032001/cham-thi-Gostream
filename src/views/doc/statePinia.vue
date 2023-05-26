<script setup>
import { useAuthStore } from '../../store/index';
const store = useAuthStore();
store.initializeRole();
// store.setRole('taolao');
const role = store.getRole;
</script>
<template>
    role: {{ role }}
    <div>hello this is page save state with pinia</div>
</template>
