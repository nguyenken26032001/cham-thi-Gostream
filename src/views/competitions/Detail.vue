<script setup>
import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { contextPath } = useLayout();
const teams = ref([])
const selectedTeam = ref(null)
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png'])

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
                            <label class="font-medium text-900">Cuộc thi A</label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Mô tả: </label>
                            <label class="font-medium text-900">Volutpat maecenas volutpat blandit aliquam etiam erat velit
                                scelerisque in. Duis ultricies lacus sed turpis tincidunt id. Sed tempus urna et pharetra.
                                Metus vulputate eu scelerisque felis imperdiet proin fermentum. Venenatis urna
                                cursus eget nunc scelerisque viverra mauris in. Viverra justo nec ultrices dui sapien eget
                                mi proin. Laoreet suspendisse interdum consectetur libero id faucibus.
                            </label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Hình ảnh: </label>
                            <div class="flex flex-row w-2 justify-content-between" >
                                <img v-for="(image, i) in images" :alt="i" :key="i"
                                    :src="contextPath + `demo/images/ecommerce/productoverview/${image}`"
                                    class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'"/>
                            </div>
                        </div>
                    </div>
                    <div class="team">
                        <span class="text-800 font-bold mb-4 block" style="margin-left: 15px;">Đội thi:</span>
                        <DataTable ref="dt" :value="teams" v-model:selection="selectedTeam" dataKey="id" :rows="10"
                            :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            responsiveLayout="scroll" style="margin-top: 15px;">

                            <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.id }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Files">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
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
                    <div class="exam">
                        <span class="text-800 font-bold mb-4 block" style="margin-left: 15px;">Vòng thi:</span>
                        <DataTable ref="data" :value="exams" v-model:selection="selectedExams" dataKey="id" :rows="10"
                            responsiveLayout="scroll" style="margin-top: 15px;">

                            <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.id }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả" headerStyle="">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Files" headerStyle="">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Người chấm thi" headerStyle="">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column header="Act" headerStyle="min-width:9rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                        @click="editExam(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                        @click="confirmDeleteExam(slotProps.data)" />
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