<script setup>
import { HTTP } from '../midleware/http';
import { useToast } from 'primevue/usetoast';
import { ref, provide, watch, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
const teams = ref([]);
const team = ref({});
const prop = defineProps(['id']); //get id from props
const toast = useToast();
const round = ref({});
const submitted = ref(false);
const markDialog = ref();
const rowSelected = ref(0);
const status = ref(0);
const marks = ref([]);
const info = ref({});
const examiner = ref({});
const gradingExaminer = ref([]);
onMounted(async () => {
    examiner.value = JSON.parse(localStorage.getItem('user')).email;
    if (prop.id)
        HTTP.get(`/rounds/${prop.id}`)
            .then((res) => {
                round.value = res.data;
                round.questions = round.questions.map((item) => {
                    return {
                        ...item,
                        marks: 0
                    };
                });
                console.log(round.value);

                teams.value = res.data.competition[0].teams;
            })
            .catch((e) => {
                console.log(e);
            });

    const statusGradingForExaminer = await HTTP.post(`/teams/grading-status-forExaminer`, {
        idRound: prop.id,
        examiner: examiner.value
    });
    gradingExaminer.value = statusGradingForExaminer.data;
    console.log('on mouted', gradingExaminer.value);
});
const cham = async (data, index) => {
    // console.log('id round', prop.id);
    // console.log('id team', data.data._id);
    // console.log('examiner', examiner.value);
    const result = await HTTP.post(`/teams/grading-status`, {
        idRound: prop.id,
        idTeam: data.data._id,
        examiner: examiner.value
    });
    console.log('object :>> ', result.data);
    status.value = result.data.length;
    if (result.data.length <= 0) {
        // chưa chấm
        info.value.idTeam = data.data._id;
        console.log('team', data);
        markDialog.value = true;
        rowSelected.value = index;
        round.value.questions = round.value.questions.map((item) => {
            return {
                ...item,
                marks: 0
            };
        });
        return;
    }
    alert('Bạn đã chấm điểm cho vòng thi này rồi!');
    // chấm rồi thì gán lại giá trị để select ra điểm đã chấm
    var marks = result.data[0]['rounds'].filter((item) => {
        return item.examiner === examiner.value;
    });
    round.value.questions = marks[0].marks;
    // console.log('diem', round.value.questions);
    // result.data[0]['rounds'][0].marks.map((item) => {
    //     marks += item.marks;
    // });
    info.value.idTeam = data.data._id;
    markDialog.value = true;
    rowSelected.value = index;
};
const saveMarks = async () => {
    submitted.value = true;
    markDialog.value = false;
    status.value = rowSelected.value;
    round.value.questions;
    marks.value.push({
        idRound: prop.id,
        examiner: examiner.value,
        status: 1,
        marks: round.value.questions
    });
    const marksTeam = await HTTP.post('teams/updateMarks', {
        info: info.value,
        data: marks.value
    });
    if (marksTeam.data.code == 200) {
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Chấm điểm thành công !', life: 3000 });
        return;
    }
};
</script>
<template>
    <h1 style="margin-bottom: 50px">{{ round.name }}</h1>
    <DataTable ref="data" :value="round.teams" dataKey="id" :rows="10" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" responsiveLayout="scroll" style="margin-top: 15px">
        <Column field="id" header="TT" headerStyle="min-width:1rem;">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column field="name" header="Tên đội" headerStyle="width:45%; min-width:10rem;">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column headerStyle="min-width:9rem;" header="Chấm Điểm">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="cham(slotProps, slotProps.index)" />
            </template>
        </Column>
        <Column headerStyle="min-width:9rem;" header="Trạng thái">
            <template #body="slotProps">
                <!-- {{ slotProps.data._id }} -->
                <div v-for="(item, index) in gradingExaminer" :key="index">
                    <div v-if="item._id === slotProps.data._id">Đã được chấm</div>
                </div>
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="markDialog" :style="{ width: '500px' }" header="Chấm" :modal="true" class="p-fluid">
        <DataTable
            ref="data"
            :value="round.questions"
            dataKey="id"
            :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            responsiveLayout="scroll"
            style="margin-top: 15px"
        >
            <Column field="id" header="TT" headerStyle="min-width:1rem;">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="name" header="Tiêu chí" headerStyle="width:45%; min-width:10rem;">
                <template #body="slotProps">
                    {{ slotProps.data.name }}
                </template>
            </Column>
            <Column headerStyle="min-width:9rem;" header="Điểm">
                <template #body="slotProps">
                    <InputNumber v-model="round.questions[slotProps.index].marks" @change="cham" inputId="minmax" :min="0" :max="10" :placeholer="10" />
                </template>
            </Column>
        </DataTable>
        <template #footer>
            <Button
                label="Hủy"
                icon="pi pi-times"
                class="p-button-text"
                @click="
                    () => {
                        markDialog = false;
                        submitted = false;
                    }
                "
            />
            <Button :disabled="status == 1" label="Gửi kết quả" icon="pi pi-check" class="p-button-text" @click="saveMarks" />
        </template>
    </Dialog>

    <!-- <Button label="Gửi kết quả chấm" class="w-auto mt-3" @click="addQuestion"></Button> -->
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
