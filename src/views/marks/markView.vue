<script setup>
import { onBeforeMount, ref, watch, provide, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../../midleware/http';
import useClipboard from 'vue-clipboard3';
import ModalCreateTeam from '../../components/ModalCreateTeam.vue';

const { toClipboard } = useClipboard();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { contextPath } = useLayout();
const competition = ref({});
const markDialog = ref(false);
const examiner = ref(null);
const question = ref([]);
const roundSelected = ref([]);
const team = ref({});
const pointed = ref([]);
const marks = ref({
    competition_id: '',
    idRound: '',
    examiner: '',
    point: null
});
const point = ref(0);
const round = ref({});
onMounted(async () => {
    examiner.value = JSON.parse(localStorage.getItem('user')).email;
    // console.log(examiner.value);
    await HTTP.get(`competition/${route.params.id}`)
        .then((res) => {
            competition.value = res.data.competition[0];
            console.log(competition.value);
            competition.value.round = competition.value.round.map((item) => {
                return {
                    ...item,
                    marks: 0
                };
            });
            // question.value = res.data.competition[0].round;
            // console.log(question.value);
        })
        .catch((err) => console.log(err));
});
function copyLink() {
    if (competition.value.url) {
        toClipboard(competition.value.url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Sao chép thành công', life: 3000 });
    }
}
const score = (item) => {
    alert('okok');
    // router.push({ name: 'competitions-score', params: { id: item._id } });
};

const indexSelected = ref(0);
const showDialog = (data, index) => {
    console.log('dialog', data._id);
    roundSelected.value = index;
    indexSelected.value = index;
    marks.value.competition_id = data.competition_id;
    marks.value.idRound = data._id;
    marks.value.examiner = examiner.value;
    question.value = data.questions[0];
    markDialog.value = true;
};
const saveMarks = () => {
    marks.value.point = point.value;
    // pointed.value = competition.round[indexSelected.value].marks;
    console.log('marks', marks.value);
    console.log('index', indexSelected.value);
    console.log('ddddddd', competition.round);
    markDialog.value = false;
};
</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Thông tin cuộc thi</span>
        <div class="grid">
            <div class="col-12 md:col-12" style="margin: auto">
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
                                <!-- <img v-for="(image, i) in images" :alt="i" :key="i"
                                    :src="contextPath + `demo/images/ecommerce/productoverview/${image}`"
                                    class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'" /> -->
                                <img v-for="(img, i) in competition.image" :alt="i" :key="i" :src="img" class="w-full cursor-pointer border-2 border-transparent transition-colors transition-duration-150 border-round'" />
                            </div>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail" style="align-self: center"> Link đăng ký: </label>
                            <div class="flex flex-row justify-content-between">
                                <InputText type="text" class="inputForm" readonly="true" v-model="competition.url" />
                                <Button id="copyLink" icon="pi pi-copy" class="p-button-text" @click="copyLink" />
                            </div>
                        </div>
                    </div>
                    <div class="team">
                        <div class="flex flex-row justify-content-between">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Đội thi tham giaggg:</span>
                            <Button label="Xem thông tin" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/examiner/view-competition/Team/${competition._id}`)" />
                        </div>
                        <DataTable
                            ref="dt"
                            :value="competition.teams"
                            dataKey="id"
                            :rows="10"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            responsiveLayout="scroll"
                            style="margin-top: 15px"
                        >
                            <Column field="id" header="Id" :sortable="true" headerStyle="width:2rem">
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
                            <Column class="column" header="Bài thi">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div>
                        <div class="flex flex-row justify-content-between">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Vòng thiii:</span>
                            <Button label="Xem thông tin" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/competitions/create/round/${competition._id}`)" />
                        </div>
                        <DataTable ref="data" :value="competition.round" dataKey="id" :rows="10" responsiveLayout="scroll" style="margin-top: 15px">
                            <Column field="id" header="Vòng" :sortable="true" headerStyle="width:6%; ">
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

                            <Column class="column" header="Người chấm thi" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.examiner }}
                                </template>
                            </Column>
                            <Column header="Chấm điểm">
                                <template #body="slotProps">
                                    <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="showDialog(slotProps.data, slotProps.index)" /> -->
                                    <Button v-if="competition.trangThai" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="$router.push(`/examiner/marks-round/${slotProps.data._id}`)" />
                                    <Button v-else disabled icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="$router.push(`/examiner/marks-round/${slotProps.data._id}`)" />
                                </template>
                            </Column>
                            <Column header="Trạng thái">
                                <template #body="slotProps">
                                    <span v-if="competition.trangThai">Cuộc thi đang chấm </span>
                                    <span v-else>Quản trị chưa mở chấm</span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal-create-team :id="competition._id" />
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
