<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';
import { HTTP } from '../../midleware/http';
import axios from 'axios';

const route = useRoute();
const toast = useToast();
const competitions = ref(null);
const deletecompetitionDialog = ref(false);
const deletecompetitionsDialog = ref(false);
const competition = ref({});
const selectedcompetitions = ref(null);
const dt = ref(null);
const filters = ref({});
const iconButton = ref('pi pi-caret-right');

onBeforeMount(async () => {
    initFilters();
    HTTP.get('competition')
        .then((res) => {
            competitions.value = res.data.list;
        })
        .catch((e) => {
            console.log(e);
        });
});
const editcompetition = (editcompetition) => {
    route.push({ name: 'competitions-detail', params: { id: editcompetition._id } });
};

const confirmDeletecompetition = (editcompetition) => {
    competition.value = editcompetition;
    deletecompetitionDialog.value = true;
};

const deletecompetition = () => {
    HTTP.delete(`competition/${competition.value._id}`)
        .then((res) => {
            competitions.value = competitions.value.filter((val) => val._id !== res.data._id);
            deletecompetitionDialog.value = false;
            competition.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'competition Deleted', life: 3000 });
        })
        .catch((err) => console.log(err));
};
const exportCSV = () => {
    dt.value.exportCSV();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
const startCham = async (idCompetition) => {
    const status = await HTTP.put(`competition/update-status/${idCompetition}`);
    if (status.data.code == 201) {
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Mở chấm thành công', life: 3000 });
        //call api get list
        HTTP.get('competition')
            .then((res) => {
                competitions.value = res.data.list;
            })
            .catch((e) => {
                console.log(e);
            });
    }
    iconButton.value = 'pi pi-pause';
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <RouterLink to="/competitions/create" class="mr-2">
                                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" />
                            </RouterLink>
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                                    :disabled="!selectedcompetitions || !selectedcompetitions.length" /> -->
                        </div>
                    </template>

                    <!-- <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                            class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template> -->
                </Toolbar>

                <DataTable
                    class="mb-4"
                    ref="dt"
                    :value="competitions"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Quản lý cuộc thi</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." />
                            </span>
                        </div>
                    </template>

                    <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">id</span>
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="name" header="Tên cuộc thi" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tên cuộc thi</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                        <template #body="slotProps">
                            <span class="p-column-title">Mô tả</span>
                            {{ slotProps.data.describe }}
                        </template>
                    </Column>
                    <Column header="Thời gian" filterField="date" :sortable="true" dataType="date" style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                    <Column field="status" header="Trạng thái" :filterMenuStyle="{ width: '10rem' }" style="min-width: 8rem">
                        <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status"> {{ slotProps.data.status }} </span>
                        </template>
                    </Column>

                    <!-- v-if="role === 'admin' && competition.status === 'create'" -->
                    <Column header="Mở vòng chấm">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.trangThai" disabled icon="pi pi-pause" class="p-button-rounded p-button-success mr-2" id="startCham" @click="startCham(slotProps.data._id)" />
                            <Button v-else icon="pi pi-caret-right" class="p-button-rounded p-button-success mr-2" id="startCham" @click="startCham(slotProps.data._id)" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:9rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="$router.push({ name: 'competitions-detail', params: { id: slotProps.data._id } })" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeletecompetition(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deletecompetitionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="competition"
                            >Are you sure you want to delete <b>{{ competition.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletecompetitionDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletecompetition" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
