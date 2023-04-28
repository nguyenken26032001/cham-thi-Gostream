<script setup>
import { ref } from 'vue';
import Exams from './create/Exams.vue';

</script>

<template>
    <span class="text-900 text-xl font-bold mb-4 block">Tạo Vòng thi</span>
    <div class="grid">
        <div class="col-12 md:col-12" style="margin: auto;">
            <div class="card card-w-title">
                <Exams :id="$route.params.id"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>
