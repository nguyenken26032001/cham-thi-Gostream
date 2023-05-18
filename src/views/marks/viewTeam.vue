<script setup>
import { ref } from 'vue';
import Team from '../../components/viewCompetitionExaminer.vue';
</script>
<template>
    <span class="text-900 text-xl font-bold mb-4 block">Thông tin đội thi tham gia</span>
    <div class="grid">
        <div class="col-12 md:col-12" style="margin: auto">
            <div class="card card-w-title"><Team :id="$route.params.id" /> // truyền props :id view teams</div>
        </div>
    </div>
</template>
<style scoped></style>
