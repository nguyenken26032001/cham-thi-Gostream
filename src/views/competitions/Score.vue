<script setup>
import { onMounted, ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { HTTP } from '../../midleware/http';

const route = useRoute();
const competitionList = ref({});

onMounted(async () => {
    const dataUser = localStorage.getItem('user');
    const user = JSON.parse(dataUser);
    await HTTP.post(`rounds/examiner`, {
        emailExaminer: user.email
    })
        .then((res) => {
            competitionList.value = res.data;
        })
        .catch((err) => console.log(err));
});
</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">DANH SÁCH CÁC CUỘC THI BẠN CẦN PHẢI CHẤM</span>
        <div class="grid">
            {{ competitionList }}
            <DataTable :value="competitionList" tableStyle="min-width: 50rem" responsiveLayout="scroll">
                <Column field="_id" header="Id">
                    <template #body="slotProps">
                        <span class="p-column-title">id</span>
                        {{ slotProps.index + 1 }}
                    </template></Column
                >
                <Column field="name" header="Tên cuộc thi"></Column>
                <Column field="describe" header="Mô tả "></Column>
                <Column field="image" header="Thông tin"></Column>
                <Column headerStyle="min-width:9rem;">
                    <template #body="slotProps">
                        <!-- <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="$router.push({ name: 'competitions-detail', params: { id: slotProps.data._id } })" /> -->
                        <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="$router.push({ name: 'examiner-view-competition', params: { id: slotProps.data._id } })" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
