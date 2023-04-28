<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../../../midleware/http';
const toast = useToast();
const round = ref({
    questions: []
})
const submitted = ref(false);
const rounds = ref([]);
const deleteExamDialog = ref(false);
const roundsDialog = ref(false)
const data = ref(null);
const question = ref({
    quest: "",
    point: [0, 10]
});
const active = ref(0);
const prop = defineProps(['id'])
onMounted(() => {
    if (prop.id)
        HTTP.get(`/competition/${prop.id}`)
            .then(res => {
                rounds = res.data.competition.round
            })
            .catch(e => {
                console.log(e)
            })
})
const addQuestion = () => {
    if (question.value.quest && question.value.point[1] > 0) {
        question.value.id = createId();
        round.value.questions.push(question.value)
        question.value = {
            quest: "",
            point: [0, 10]
        };
    }
}
const editRound = (item) => {
    round.value = item;
    roundsDialog.value = true
}
const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const delRound = (item) => {
    round.value = item;
    deleteExamDialog.value = true;
};
const delQuest = (item) => {
    round.value.questions = round.value.questions.filter((val) => val.id !== item.id);
};

const saveRound = async () => {
    submitted.value = true;
    round.value.id = prop.id;
    if (!round.value.name || !round.value.examiner)
        return active.value = 0;
    if (round.value.questions.length == 0)
        return;
    //save round
    if (round.value._id) {
        await HTTP.put(`rounds/${round.value._id}`, round.value)
            .then(res => {
                rounds.value.find(el => {
                    if (el._id = res.data._id)
                        el = res.data.round
                });
                round.value = {};
                roundsDialog.value = false;
            })
            .catch(err => { console.log(err) });
        return;
    }
    await HTTP.post('rounds/create', round.value)
        .then(res => {
            rounds.value.push(res.data.round);
            roundsDialog.value = false;
        })
        .catch(err => { console.log(err) });
    round.value = { questions: [] };
}
const deleteData = () => {
    HTTP.delete(`rounds/${round.value._id}`)
        .then(res => {
            console.log(res.data);
            rounds.value = rounds.value.filter(el => el !== round.value)
            deleteExamDialog.value = false;

        })
        .catch(err => { console.log(err) });
}
</script>

<template>
    <DataTable ref="data" :value="rounds" dataKey="id" :rows="10" responsiveLayout="scroll" style="margin-top: 15px;">

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
        <Column class="column" header="Files" headerStyle="">
            <template #body="slotProps">
                {{ slotProps.data.file }}
            </template>
        </Column>
        <Column class="column" header="Người chấm thi" headerStyle="">
            <template #body="slotProps">
                {{ slotProps.data.examiner }}
            </template>
        </Column>
        <Column headerStyle="min-width:9rem;">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                    @click="editRound(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="delRound(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm vòng thi" icon="pi pi-plus" class="p-button-success" @click="roundsDialog = true; active = 0; submitted = false" />
    </div>
    <Dialog v-model:visible=" roundsDialog " header="Tạo vòng thi" :modal=" true " class="p-fluid"
        style="max-width: 57rem;">
        <div class="col-12 md:col-12" style="margin: auto;">
            <div class="card card-w-title">
                <TabView v-model:activeIndex=" active ">
                    <TabPanel header="Vòng thi">
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-4 col-12">
                                <label htmlFor="nameExam" class="font-medium text-900"> Tên vòng thi </label>
                                <InputText id="nameExam" type="text" v-model=" round.name " required="true" autofocus
                                    :class=" { 'p-invalid': submitted && !round.name } " />
                                <small class="p-invalid mb-3 col-4" v-if=" submitted && !round.name ">Tên không được
                                    trống.</small>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                <Textarea id="desc" type="text" :rows=" 3 " autoResize
                                    v-model=" round.describe "></Textarea>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="examiner" class="font-medium text-900"> Người chấm thi </label>
                                <InputText id="examiner" type="text" v-model=" round.examiner " required="true"
                                    :class=" { 'p-invalid': submitted && !round.examiner } " />
                                <small class="p-invalid mb-3 col-4" v-if=" submitted && !round.examiner ">Người chấm không
                                    được
                                    trống.</small>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="file" class="font-medium text-900"> File </label>
                                <FileUpload name="file" url="./upload.php" accept="image/*" :multiple=" true "
                                    :maxFileSize=" 1000000 " chooseLabel="Upload Image"
                                    class="p-button-outlined p-button-plain" v-model=" round.file ">
                                </FileUpload>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Câu hỏi">
                        <div class="grid formgrid p-fluid" id="question">
                            <div class="show" v-for="  item, idx   in   round.questions  " style="width: 100%;">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="question" class="font-medium text-900"> Câu hỏi {{ idx + 1 }} :
                                    </label>
                                    <InputText id="question" type="text" v-model=" item.quest " />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model=" item.point[0] " showButtons mode="decimal">Min
                                    </InputNumber>
                                    <label class="font-medium text-900"
                                        style="text-align: center;margin: 0; min-width: 5rem;"> -
                                    </label>
                                    <InputNumber class="point" v-model=" item.point[1] " showButtons mode="decimal">Max
                                    </InputNumber>
                                    <div class="action" style="margin-left: 50px;">
                                        <Button icon="pi pi-trash" class="p-button-rounded mr-2" severity="danger"
                                            @click=" delQuest(item) " />
                                    </div>
                                </div>
                            </div>
                            <div class="create" style="width: 100%;">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="nickname" class="font-medium text-900"> Câu hỏi {{
                                        round.questions.length + 1
                                        }} :</label>
                                    <InputText id="nickname" type="text" v-model=" question.quest " />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model=" question.point[0] " showButtons mode="decimal" />
                                    <label htmlFor="nickname" class="font-medium text-900"
                                        style="text-align: center;margin: 0; min-width: 5rem;"> - </label>
                                    <InputNumber class="point" v-model=" question.point[1] " showButtons mode="decimal" />
                                </div>
                            </div>
                            <small class="p-invalid mb-3 col-4" v-if=" submitted && round.questions.length == 0 ">
                                Cuộc thi cần ít nhất 1 câu hỏi.</small>
                            <div class="field mb-4 col-12">
                                <label htmlFor="nickname" class="font-medium text-900"></label>
                                <Button label="Thêm" class="w-auto mt-3" @click=" addQuestion "></Button>
                                <Button label="Lưu" class="w-auto mt-3" @click=" saveRound "
                                    style="margin-left: 15px;"></Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible=" deleteExamDialog " :style=" { width: '450px' } " header="Confirm" :modal=" true ">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if=" round ">Chắc chắn xóa <b>{{ round.name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click=" deleteExamDialog = false " />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click=" deleteData " />
        </template>
    </Dialog>
</template>
<style scoped>
.btn-add {
    width: max-content;
    display: block;
    margin: 10px auto 0;
}

.column {
    min-width: 17rem;
    max-width: 27rem;
    overflow-wrap: break-word;
}

#question .field {
    display: flex;
}

#question label {
    min-width: 7rem;
    align-self: center;
    margin-right: 30px;
}

.point {
    max-width: 6rem;
}
</style>
