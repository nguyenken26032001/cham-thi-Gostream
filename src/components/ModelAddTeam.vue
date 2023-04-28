<script setup>
import { ref, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../midleware/http';
import { useRoute, useRouter } from "vue-router";

const prop = defineProps(["team", "competition_id"]);
const router = useRouter();
const submitted = ref(false);
const toast = useToast();
const openAddTeam = inject('openAddTeam');
const saveData = async () => {
    submitted.value = true;
    prop.team.competition_id = prop.competition_id
    if (prop.team._id) {
        await HTTP.put(`teams/${prop.team._id}`, prop.team)
            .then(res => {
                if (res.data.status == 200) {
                    prop.team = {};
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Sửa đội thành công', life: 3000 });
                }
            })
            .catch(err => { console.log(err) });
        return;
    }
    if (prop.team.name && prop.team.describe) {
        await HTTP.post("/teams/create", prop.team)
            .then(res => {
                console.log(res.data)
                if (res.data.status == 200) {
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo đội thành công', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'thất bại', detail: res.data.msg || res.data.competition.msg, life: 3000 });
                }
            })
            .catch(e => {
                console.log(e)
            })
    }
    router.go(0);
    openAddTeam.value = !openAddTeam.value;
}
</script>
<template>
    <Dialog v-model:visible="openAddTeam" :style="{ width: '500px' }" header="Tạo đội thi" :modal="true" class="p-fluid">
        <div class="field">
            <label for="name">Tên Đội:</label>
            <InputText id="name" v-model.trim="prop.team.name" required="true" autofocus
                :class="{ 'p-invalid': submitted && !prop.team.name }" />
            <small class="p-invalid" v-if="submitted && !prop.team.name">Name is required.</small>
        </div>
        <div class="field">
            <label for="description">Mô tả</label>
            <Textarea id="description" v-model="prop.team.describe" required="true" rows="3" cols="20" />
        </div>
        <div class="field">
            <label for="image" class="font-medium text-900">File</label>
            <FileUpload name="image" url="./upload.php" accept="*" :multiple="true" :maxFileSize="1000000"
                chooseLabel="Upload" class="p-button-outlined p-button-plain"></FileUpload>
        </div>
        <template #footer>
            <Button label="Lưu" icon="pi pi-check" class="p-button-text" @click="saveData" />
        </template>
    </Dialog>
</template>
<style scoped></style>