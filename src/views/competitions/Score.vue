<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { HTTP } from '../../midleware/http';

const route = useRoute();
const competition = ref({});

onMounted(async () => {
    await HTTP.get(`rounds/${route.params.id}`)
        .then(res => { competition.value = res.data })
        .catch(err => console.log(err));
    console.log("🚀 ~ file: Score.vue:12 ~ onMounted ~ competition.value:", competition.value)

});
</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Chấm điểm</span>
        <div class="grid">
            <div class="round">

            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>