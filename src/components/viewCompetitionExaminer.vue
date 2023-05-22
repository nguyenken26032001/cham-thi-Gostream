<script setup>
import { HTTP } from '../midleware/http';
import { useToast } from 'primevue/usetoast';
import { ref, provide, watch, onMounted, onBeforeMount } from 'vue';
import DocPreview from 'vue-doc-preview';
const teams = ref([]);
const team = ref({});
const prop = defineProps(['id']); //get id from props
const toast = useToast();
const docValue = ref('https://res.cloudinary.com/dkwfwcrkp/raw/upload/v1684684312/upload/h4l3n9cyjbh3zeun1f4z.doc');
const showPreview = ref(false);
const submitted = ref(false);
onMounted(() => {
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
const viewDoc = (dataFile, index) => {
    showPreview.value = true;
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
        <Column class="column" header="Bài dự thi">
            <template #body="slotProps">
                {{ slotProps.data.file }}
            </template>
        </Column>

        <Column headerStyle="min-width:9rem;" header="Xem tài liệu">
            <template #body="{ data, index }">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="viewDoc(data.file, index)" />
            </template>
        </Column>
    </DataTable>
    <DocPreview v-if="showPreview" :value="docValue" />
    <!-- <VueDocPreview :value="docValue" :type="office" /> -->

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
