<script setup>
import ModalCreateTeam from '/src/components/ModalCreateTeam.vue';
import { HTTP } from '../../../midleware/http';
import { useToast } from 'primevue/usetoast';
import { ref, provide, watch, onMounted, onBeforeMount } from 'vue';
const openCreateTeam = ref(false);
const openAddTeam = ref(false);
const teams = ref([]);
const team = ref({});
const teamDialog = ref(false);
const deleteteamDialog = ref(false);
const prop = defineProps(["id"]);
const toast = useToast();
const submitted = ref(false);

provide('openCreateTeam', openCreateTeam);
// provide('openAddTeam', openAddTeam);
onMounted(() => {
    if (prop.id)
        HTTP.get(`/competition/${prop.id}`)
            .then(res => {
                teams.value = res.data.competition.teams
            })
            .catch(e => {
                console.log(e)
            })
})
const editteam = (item) => {
    team.value = item;
}
const deleteteam = (item) => {
    team.value = item;
    deleteteamDialog.value = true;
}
const deleteData = () => {
    HTTP.delete(`teams/${team.value._id}`)
        .then(res => {
            teams.value = teams.value.filter((val) => val.id !== team.value._id);
            deleteteamDialog.value = false;
            team.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Xóa đội thi thành công', life: 3000 });
        })
        .catch(err => { console.log(err) });
}
const saveData = async () => {
    submitted.value = true;
    if (team.value._id) {
        await HTTP.put(`teams/${team.value._id}`, team.value)
            .then(res => {
                if (res.data.status == 200) {
                    teams.value.find(el => {
                        if (el._id = res.data._id)
                            el = res.data.team
                    });
                    team.value = {};
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Sửa đội thành công', life: 3000 });
                }
            })
            .catch(err => { console.log(err) });
        return;
    }
    team.value.competition_id = prop.id;
    if (team.value.name && team.value.describe) {
        await HTTP.post("/teams/create", team.value)
            .then(res => {
                if (res.data.status == 200) {
                    teams.value.push(res.data.team);
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo đội thành công', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'thất bại', detail: res.data.msg || res.data.competition.msg, life: 3000 });
                }
            })
            .catch(e => {
                console.log(e)
            })
    }
    teamDialog.value = false;
}
</script>

<template>
    <DataTable ref="data" :value="teams" dataKey="id" :rows="10"
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
                    @click="editteam(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="deleteteam(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm đội thi" icon="pi pi-plus" class="p-button-success" @click="teamDialog = true" />
        <Button label="Tạo trang đăng ký" icon="pi pi-plus" class="" @click="openCreateTeam = !openCreateTeam"
            style="margin-left: 50px;" />
    </div>

    <Dialog v-model:visible="teamDialog" :style="{ width: '500px' }" header="Tạo đội thi" :modal="true" class="p-fluid">

        <div class="field">
            <label for="name">Tên Đội:</label>
            <InputText id="name" v-model.trim="team.name" required="true" autofocus
                :class="{ 'p-invalid': submitted && !team.name }" />
            <small class="p-invalid" v-if="submitted && !team.name">Name is required.</small>
        </div>
        <div class="field">
            <label for="description">Mô tả</label>
            <Textarea id="description" v-model="team.describe" required="true" rows="3" cols="20" />
        </div>
        <div class="field">
            <label for="image" class="font-medium text-900">File</label>
            <FileUpload name="image" url="./upload.php" accept="*" :multiple="true" :maxFileSize="1000000"
                chooseLabel="Upload" class="p-button-outlined p-button-plain"></FileUpload>
        </div>
        <template #footer>
            <Button label="Hủy" icon="pi pi-times" class="p-button-text"
                @click="() => { teamDialog = false; submitted = false; }" />
            <Button label="Lưu" icon="pi pi-check" class="p-button-text" @click="saveData" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteteamDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="team">Are you sure you want to delete <b>{{ team.name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteteamDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteData" />
        </template>
    </Dialog>
    <modal-create-team :id="prop.id" />
    <!-- <ModelAddTeam :team="team" :competition_id="prop.id" /> -->
</template>
<style scoped>
.btn-add {
    width: max-content;
    display: block;
    margin: 20px auto 0;

}

.column {
    min-width: 17rem;
    max-width: 27rem;
    overflow-wrap: break-word;
}
</style>
