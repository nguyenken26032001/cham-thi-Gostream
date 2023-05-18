<script setup>
import { ref } from 'vue';
import Round from '../../components/ChamDiemVongDetail.vue';
</script>
<template>
    <span class="text-900 text-xl font-bold mb-4 block">Mời bạn chấm điểm vòng thi </span>
    <div class="grid">
        <div class="col-12 md:col-12" style="margin: auto">
            <div class="card card-w-title"><Round :id="$route.params.id" /> // truyền props :id round</div>
        </div>
    </div>
</template>
<style scoped></style>
