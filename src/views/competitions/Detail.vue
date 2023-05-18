<script setup>
import { onBeforeMount, ref, watch, provide, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../../midleware/http';
import useClipboard from 'vue-clipboard3';
import ModalCreateTeam from '../../components/ModalCreateTeam.vue';

const { toClipboard } = useClipboard();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { contextPath } = useLayout();
const competition = ref({});
const role = ref(null);
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png']);
const openCreateTeam = ref(false);
const openAddTeam = ref(false);
const team = ref({});
provide('openCreateTeam', openCreateTeam);
provide('openAddTeam', openAddTeam);
onMounted(async () => {
    role.value = JSON.parse(localStorage.getItem('user')).role;
    await HTTP.get(`competition/${route.params.id}`)
        .then((res) => {
            competition.value = res.data.competition[0];
            console.log(competition.value);
        })
        .catch((err) => console.log(err));
    console.log('🚀 ~ file: Detail.vue:28 ~ onMounted ~ competition.value:', competition.value);
});
function copyLink() {
    if (competition.value.url) {
        toClipboard(competition.value.url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Sao chép thành công', life: 3000 });
    }
}

const editTeam = (item) => {
    team.value = item;
    openAddTeam.value = !openAddTeam.value;
};

const deleteTeam = async (item) => {
    await HTTP.delete(`teams/${item._id}`)
        .then((res) => {
            competition.value.teams = competition.value.teams.filter((val) => val.id !== item._id);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Xóa đội thi thành công', life: 3000 });
        })
        .catch((err) => {
            console.log(err);
        });
    router.go(0);
};
const score = (item) => {
    router.push({ name: 'competitions-score', params: { id: item._id } });
};
</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Chi tiết cuộc thi</span>
        <div class="grid">
            <div class="col-12 md:col-12" style="margin: auto">
                <div class="card card-w-title">
                    <div class="competition">
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Tên cuộc thi: </label>
                            <label class="font-medium text-900">{{ competition.name }}</label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Mô tả: </label>
                            <label class="font-medium text-900">
                                {{ competition.describe }}
                            </label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Hình ảnh: </label>
                            <div class="flex flex-row w-2 justify-content-between">
                                <!-- <img v-for="(image, i) in images" :alt="i" :key="i"
                                    :src="contextPath + `demo/images/ecommerce/productoverview/${image}`"
                                    class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'" /> -->
                                <img v-for="(img, i) in competition.image" :alt="i" :key="i" :src="img" class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'" />
                            </div>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail" style="align-self: center"> Link đăng ký: </label>
                            <div class="flex flex-row justify-content-between">
                                <InputText type="text" class="inputForm" readonly="true" v-model="competition.url" />
                                <Button id="copyLink" icon="pi pi-copy" class="p-button-text" @click="copyLink" />
                            </div>
                        </div>
                    </div>
                    <div class="team">
                        <div class="flex flex-row justify-content-between">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Đội thi:</span>
                            <Button label="Chỉnh sửa" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/competitions/create/team/${competition._id}`)" />
                        </div>
                        <DataTable
                            ref="dt"
                            :value="competition.teams"
                            dataKey="id"
                            :rows="10"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            responsiveLayout="scroll"
                            style="margin-top: 15px"
                        >
                            <Column field="id" header="Id" :sortable="true" headerStyle="width:2rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Files">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>

                            <!-- <Column headerStyle="min-width:9rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                        @click="editTeam(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                        @click="deleteTeam(slotProps.data)" />
                                </template>
                            </Column> -->
                        </DataTable>
                    </div>
                    <div>
                        <div class="flex flex-row justify-content-between">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Vòng thi:</span>
                            <Button label="Chỉnh sửa" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/competitions/create/round/${competition._id}`)" />
                        </div>
                        <DataTable ref="data" :value="competition.round" dataKey="id" :rows="10" responsiveLayout="scroll" style="margin-top: 15px">
                            <Column field="id" header="Vòng" :sortable="true" headerStyle="min-width:1rem;">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Files" headerStyle="">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>
                            <Column class="column" header="Người chấm thi" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.examiner }}
                                </template>
                            </Column>
                            <Column v-if="role === 'admin' && competition.status === 'create'" header="Bắt đầu">
                                <template #body="slotProps">
                                    <Button icon="pi pi-caret-right" class="p-button-rounded p-button-success mr-2" @click="" />
                                </template>
                            </Column>
                            <Column v-if="role === 'examiner'" header="Chấm điểm">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="score(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal-create-team :id="competition._id" />
</template>
<style scoped>
.competition .field {
    display: flex;
    margin: 0;
}

.detail {
    min-width: 9em;
}
</style>
