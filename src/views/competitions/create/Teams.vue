<script setup>
import ModalCreateTeam from '/src/components/ModalCreateTeam.vue';
import { HTTP } from '../../../midleware/http';
import { useToast } from 'primevue/usetoast';
import { ref, provide, watch, onMounted, onBeforeMount } from 'vue';
import { upload } from '../../../components/uploadsFile';
const openCreateTeam = ref(false);
const openAddTeam = ref(false);
const teams = ref([]);
const team = ref({});
const teamDialog = ref(false);
const deleteteamDialog = ref(false);
const prop = defineProps(['id']); //get id from props
const toast = useToast();
const submited = ref(false);
const file = ref(null);

provide('openCreateTeam', openCreateTeam);
// provide('openAddTeam', openAddTeam);
onMounted(async () => {
    if (prop.id)
        HTTP.get(`/competition/${prop.id}`)
            .then((res) => {
                console.log(res.data.competition[0].teams);
                teams.value = res.data.competition[0].teams;
            })
            .catch((e) => {
                console.log(e);
            });
});
const editteam = (data) => {
    teamDialog.value = true;
    team.value = data;
};
const indexSelected = ref(null);
const deleteteam = (item, index) => {
    team.value.id = item._id;
    deleteteamDialog.value = true;
    indexSelected.value = index;
};
const onFileSelected = (event) => {
    file.value = event.files[0];
    console.log('fileSelected: ' + file.value);
};
const deleteData = () => {
    // console.log('id team', team.value.id);
    // return;
    HTTP.post(`teams/removeTeam`, {
        idCompetition: prop.id,
        idTeam: team.value.id
    })
        .then((res) => {
            if (res.data.code == 200) teams.value = teams.value.filter((val) => val.id !== team.value._id);
            deleteteamDialog.value = false;
            // team.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Xóa đội thi thành công', life: 3000 });
            console.log(indexSelected.value);
            // teams.value.splice(indexSelected.value, 1);
        })
        .catch((err) => {
            console.log(err);
        });
};
const saveData = async () => {
    submited.value = true;
    if (!file.value) {
        return;
    }
    if (!team.value.name && !team.value.describe && !file.value) {
        teamDialog.value = true;
        return;
    }
    if (team.value._id) {
        if (!file.value) {
            console.log('file is required');
            return;
        }
        const urlFile = await upload(file.value);
        team.value.file = urlFile;
        await HTTP.put(`teams/${team.value._id}`, team.value)
            .then((res) => {
                if (res.data.status == 200) {
                    teams.value.find((item) => {
                        if ((item._id = res.data._id)) item = res.data.team;
                    });
                    team.value = {};
                }
            })
            .catch((err) => {
                console.log(err);
            });
        teamDialog.value = false;
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Sửa đội thành công', life: 3000 });
        team.value = {};
        return;
    }
    team.value.competition_id = prop.id;
    if (team.value.name && team.value.describe && file.value) {
        const urlFile = await upload(file.value);
        team.value.file = urlFile;
        await HTTP.post('/teams/create', team.value)
            .then((res) => {
                if (res.data.status == 200) {
                    teams.value.push(res.data.team);
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo đội thành công', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'thất bại', detail: res.data.msg || res.data.competition.msg, life: 3000 });
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally((e) => (teamDialog.value = false));
    }
    // teamDialog.value = false;
};
</script>

<template>
    <DataTable ref="data" :value="teams" dataKey="id" :rows="10" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" responsiveLayout="scroll" style="margin-top: 15px">
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

        <Column headerStyle="min-width:9rem;" header="Action">
            <template #body="{ data, index }">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editteam(data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="deleteteam(data, index)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button
            label="Thêm đội thi"
            icon="pi pi-plus"
            class="p-button-success"
            @click="
                () => {
                    (teamDialog = true), (team.value = null);
                }
            "
        />
        <Button label="Tạo trang đăng ký" icon="pi pi-plus" class="" @click="openCreateTeam = !openCreateTeam" style="margin-left: 50px" />
    </div>

    <Dialog v-model:visible="teamDialog" :style="{ width: '500px' }" header="Tạo đội thi" :modal="true" class="p-fluid">
        <div class="field">
            <label for="name">Tên Đội:</label>
            <InputText id="name" v-model.trim="team.name" required="true" autofocus :class="{ 'p-invalid': submited && !team.name }" />
            <small class="p-invalid" v-if="submited && !team.name">Tên bắt buộc phải nhập dữ liệu.</small>
        </div>
        <div class="field">
            <label for="description">Mô tả</label>
            <Textarea id="description" v-model="team.describe" required="true" rows="3" cols="20" :class="{ 'p-invalid': submited && !team.describe }" />
            <small class="p-invalid" v-if="submited && !team.describe">Mô tả bắt buộc phải nhập dữ liệu.</small>
        </div>
        <div class="field">
            <div for="description">Tài liệu</div>
            <!-- <input type="file" :v-model="file" name="" ref="fileUploaderRef" id="" @change="onFileSelected" required :class="{ 'p-invalid': submited && !file }" /> -->
            <FileUpload mode="basic" name="demo[]" accept="" ref="fileUploaderRef" :maxFileSize="1000000" @select="onFileSelected" :class="{ 'p-invalid': submited && !file }" />
            <small class="p-invalid" v-if="submited && !file" style="color: red"> File bắt buộc phải có.</small>
        </div>
        <template #footer>
            <Button
                label="Hủy"
                icon="pi pi-times"
                class="p-button-text"
                @click="
                    () => {
                        teamDialog = false;
                        submited = false;
                    }
                "
            />
            <Button label="Lưu" icon="pi pi-check" class="p-button-text" @click="saveData" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteteamDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="team"
                >Are you sure you want to delete <b>{{ team.name }}</b> ?</span
            >
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
