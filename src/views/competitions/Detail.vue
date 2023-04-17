<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRoute } from "vue-router";
import { HTTP } from "../../midleware/http"

const route = useRoute();

const { contextPath } = useLayout();
const competition = ref({});
const teams = ref([]);
const role = ref(null);
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png'])
const action = ref(true);
onBeforeMount(() => {
    role.value = JSON.parse(localStorage.getItem('user')).role
    HTTP.get(`competition/${route.params.id}`)
        .then(res => { competition.value = res.data.competition })
        .catch(err => console.log(err))
});

</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Chi tiết cuộc thi</span>
        <div class="grid">
            <div class="col-12 md:col-12" style="margin: auto;">
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
                                <img v-for="(image, i) in images" :alt="i" :key="i"
                                    :src="contextPath + `demo/images/ecommerce/productoverview/${image}`"
                                    class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'" />
                            </div>
                        </div>
                    </div>
                    <div class="team">
                        <span class="text-800 font-bold mb-4 block" style="margin-left: 15px;">Đội thi:</span>
                        <DataTable ref="dt" :value="competition.teams" dataKey="id" :rows="10"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            responsiveLayout="scroll" style="margin-top: 15px;">

                            <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả"
                                headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Files">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>

                            <Column headerStyle="min-width:9rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                        @click="editProduct(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                        @click="confirmDeleteProduct(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div>
                        <span class="text-800 font-bold mb-4 block" style="margin-left: 15px;">Vòng thi:</span>
                        <DataTable ref="data" :value="competition.round" dataKey="id" :rows="10" responsiveLayout="scroll"
                            style="margin-top: 15px;">

                            <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả"
                                headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Files" headerStyle="">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>
                            <Column class="column" header="Người chấm thi"
                                headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.examiner }}
                                </template>
                            </Column>
                            <Column v-if="role == 'admin'" header="Bắt đầu">
                                <template #body="slotProps">
                                    <Button icon="pi pi-caret-right" class="p-button-rounded p-button-success mr-2"
                                        @click="editExam(slotProps.data)" />
                                </template>
                            </Column>
                            <Column v-if="role == 'examiner'" header="Chấm điểm">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                        @click="editExam(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
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