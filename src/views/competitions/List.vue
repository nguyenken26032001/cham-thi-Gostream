<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import router from '../../router';
import { HTTP } from "../../midleware/http"
import axios from 'axios'


const toast = useToast();
const competitions = ref(null);
const deletecompetitionDialog = ref(false);
const deletecompetitionsDialog = ref(false);
const competition = ref({});
const selectedcompetitions = ref(null);
const dt = ref(null);
const filters = ref({});

// onBeforeMount(() => {
// });
onBeforeMount(async () => {
    initFilters();

    HTTP.get("competition")
        .then(res => {competitions.value = res.data.list, console.log(competitions.value)})
        .catch(e => {console.log(e)});
});

const editcompetition = (editcompetition) => {
    router.push({ name: "competitions-detail", params: { id: editcompetition._id } })
};

const confirmDeletecompetition = (editcompetition) => {
    competition.value = editcompetition;
    deletecompetitionDialog.value = true;
};

const deletecompetition = () => {
    competitions.value = competitions.value.filter((val) => val.id !== competition.value.id);
    deletecompetitionDialog.value = false;
    competition.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'competition Deleted', life: 3000 });
};
const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deletecompetitionsDialog.value = true;
};
const deleteSelectedcompetitions = () => {
    competitions.value = competitions.value.filter((val) => !selectedcompetitions.value.includes(val));
    deletecompetitionsDialog.value = false;
    selectedcompetitions.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'competitions Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <RouterLink to="/competitions/create" class=" mr-2">
                                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" />
                            </RouterLink>
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                                :disabled="!selectedcompetitions || !selectedcompetitions.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                            class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="competitions"  dataKey="id"
                    :paginator="true" :rows="8" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Quản lý cuộc thi</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="name" header="Tên cuộc thi" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tên cuộc thi</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Mô tả"
                        headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                        <template #body="slotProps">
                            <span class="p-column-title">Mô tả</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="category" header="Người chấm" :sortable="true" headerStyle="width:14%; min-width:14rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Người chấm thi</span>
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column header="Thời gian" filterField="date" :sortable="true" dataType="date" style="min-width: 10rem">
                        <template #body="slotProps">
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Trạng thái" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Trạng thái</span>
                            <span
                                :class="'competition-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{
                                    slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:9rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editcompetition(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeletecompetition(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deletecompetitionDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="competition">Are you sure you want to delete <b>{{ competition.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deletecompetitionDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletecompetition" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletecompetitionsDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="competition">Are you sure you want to delete the selected competitions?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deletecompetitionsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedcompetitions" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
