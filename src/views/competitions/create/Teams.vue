<script>
import { HTTP } from '../../../midleware/http';

// const editData = (data) => {
//     team.value = { ...data };
//     teamDialog.value = true;
// };
// const toCreateTeamPage = () => {

// }
export default {
    props: {
        id: String
    },
    data() {
        return {
            teams: null,
            teamDialog: false,
            deleteteamDialog: false,
            team: {},
            submitted: false,
        }
    },
    watch: {
        id(newQuestion, oldQuestion) {
            if (newQuestion != "") {
                this.fetchData()
            }
        }
    },
    methods: {
        fetchData() {
            HTTP.get(`/competition/${this.id}`)
                .then(res => {
                    this.teams = res.data.competition.teams;
                })
                .catch(e => {
                    console.log(e)
                })
        },
        openNew() {
            this.team = {};
            this.submitted = false;
            this.teamDialog = true;
        },
        saveData() {
            this.submitted = true;
            this.team.id = this.id
            if (this.team.name && this.team.describe) {
                HTTP.post("/teams/create", this.team)
                    .then(res => {
                        console.log(res.data)
                        this.submitted = false;
                        this.teamDialog = false;
                        // toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo cuộc thi thành công', life: 3000 });
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        },
        deleteteam(editteam) {
            this.team = editteam;
            this.deleteteamDialog = true;
        },
        deleteData() {
            teams.value = teams.value.filter((val) => val.id !== team.value.id);
            deleteteamDialog.value = false;
            team.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'team Deleted', life: 3000 });
        },
    }
}
</script>

<template>
    <DataTable :value="teams" dataKey="id" :rows="10"
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
                    @click="editteam(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="deleteteam(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm đội thi" icon="pi pi-plus" class="p-button-success" @click="openNew" />
        <Button label="Tạo trang đăng ký" icon="pi pi-plus" class="" @click="" style="margin-left: 50px;" />
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
