<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../../../midleware/http';
import Toast from 'primevue/toast';
const toast = useToast();
const round = ref({
    questions: [],
    teams: [],
    examiner: []
});
const submitted = ref(false);
const competition = ref({});
const rounds = ref([]);
const deleteExamDialog = ref(false);
const roundsDialog = ref(false);
const data = ref(null);
const examiner = ref(null);
const examinerSelected = ref([]);
const teams = ref([]);
const createNewQuestion = ref(true);
const question = ref({
    name: '',
    point: [0, 10]
});
const active = ref(0);
const prop = defineProps(['id']);
onMounted(async () => {
    if (prop.id) {
        HTTP.get(`/competition/${prop.id}`)
            .then((res) => {
                competition.value = res.data.competition;
                rounds.value = res.data.competition[0].round;
                teams.value = res.data.competition[0].teams;
            })
            .catch((e) => {
                console.log(e);
            });
    }
    let arrExaminer = [];
    const listExaminer = await HTTP.get('/users/examiner');
    listExaminer.data.forEach((item) => {
        arrExaminer.push(item.email);
    });
    examiner.value = arrExaminer;
    console.log(examiner.value);
});
const addQuestion = () => {
    // console.log(question.value);
    if (question.value.name && question.value.point[1] > 0) {
        // phải nhập text của câu hỏi trước đó mới cho tạo câu hỏi tiếp theo
        question.value.id = createId();
        round.value.questions.push(question.value);
        question.value = {
            name: '',
            point: [0, 10]
        };
    }
};
const editRound = (item) => {
    round.value = item;
    roundsDialog.value = true;
};
const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
const delRound = (item) => {
    round.value = item;
    deleteExamDialog.value = true;
};
const delQuest = (item) => {
    console.log(item.id);
    round.value.questions = round.value.questions.filter((val) => val.id !== item.id);
};
const addRound = () => {
    roundsDialog.value = true;
    active.value = 0;
    submitted.value = false;
    round.value = {
        questions: []
    };
};
const deleteData = () => {
    HTTP.post(`rounds/delete`, {
        idRound: round.value._id,
        idCompetition: prop.id
    })
        .then((res) => {
            if (res.data.code == 200) {
                rounds.value = rounds.value.filter((el) => el !== round.value);
                deleteExamDialog.value = false;
                // round.value = {};
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Xóa vòng thi thành công', life: 3000 });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
const saveRound = async () => {
    round.value.questions.push(question.value);
    // console.log(question.value);
    // console.log(question.value);
    // submitted.value = true;
    // console.log(round.value.name);
    // console.log(round.value.examiner);
    // console.log(round.value.questions.length);
    // console.log(round.value.questions);
    // return;
    if (!round.value.name || !round.value.examiner) return (active.value = 0);
    if (round.value._id) {
        await HTTP.put(`rounds/${round.value._id}`, round.value)
            .then((res) => {
                rounds.value.find((el) => {
                    if ((el._id = res.data._id)) el = res.data.round;
                });
                roundsDialog.value = false;
            })
            .catch((err) => {
                console.log(err);
            });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Cập nhật thành công', life: 3000 });
        return;
    }
    round.value.competition_id = prop.id;
    await HTTP.post('rounds/create', round.value)
        .then((res) => {
            if (res.data.status === 200) {
                rounds.value.push(res.data.round);
                roundsDialog.value = false;
            }
        })
        .catch((err) => {
            console.log(err);
        });
    roundsDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Thêm mới thành công', life: 3000 });
    round.value = { questions: [] };
};
</script>
<template>
    <DataTable ref="data" :value="rounds" dataKey="id" :rows="10" responsiveLayout="scroll" style="margin-top: 15px">
        <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
            <template #body="data">
                {{ data.index + 1 }}
            </template>
        </Column>
        <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="data">
                {{ data.data.name }}
            </template>
        </Column>
        <Column class="column" header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
            <template #body="data">
                {{ data.data.describe }}
            </template>
        </Column>
        <!-- <Column class="column" header="Files" headerStyle="">
            <template #body="data">
                {{ data.data.file }}
            </template>
        </Column> -->
        <Column class="column" header="Người chấm thi" headerStyle="">
            <template #body="data">
                <div v-for="item in data.data.examiner" style="color: red">{{ item }}</div>
            </template>
        </Column>
        <Column headerStyle="min-width:9rem;">
            <template #body="data">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRound(data.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="delRound(data.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm vòng thi" icon="pi pi-plus" class="p-button-success" @click="addRound" />
    </div>
    <Dialog v-model:visible="roundsDialog" header="Tạo vòng thi" :modal="true" class="p-fluid" style="max-width: 57rem">
        <div class="col-12 md:col-12" style="margin: auto">
            <div class="card card-w-title">
                <TabView v-model:activeIndex="active">
                    <TabPanel header="Vòng thi">
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-4 col-12">
                                <label htmlFor="nameExam" class="font-medium text-900"> Tên vòng thi </label>
                                <InputText id="nameExam" type="text" v-model="round.name" required="true" autofocus :class="{ 'p-invalid': submitted && !round.name }" />
                                <small class="p-invalid mb-3 col-4" v-if="submitted && !round.name">Tên không được trống.</small>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                <Textarea id="desc" type="text" :rows="3" autoResize v-model="round.describe"></Textarea>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="examiner" class="font-medium text-900"> Người chấm thi </label>
                                <MultiSelect v-model="round.examiner" :options="examiner" optionLabel="name" placeholder="chọn người chấm">
                                    <template #value="data">
                                        <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of data.value" :key="option.code">
                                            <div>{{ option }}</div>
                                        </div>
                                        <template v-if="!data.value || data.value.length === 0">
                                            <div>{{ data.placeholder }}</div>
                                        </template>
                                    </template>
                                    <template #option="data">
                                        <div class="flex align-items-center">
                                            <div>{{ data.option }}</div>
                                        </div>
                                    </template>
                                </MultiSelect>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="examiner" class="font-medium text-900"> Đội thi </label>
                                <MultiSelect v-model="round.teams" :options="teams" optionLabel="name" placeholder="chọn đội thi">
                                    <template #value="data">
                                        <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of data.value" :key="option.code">
                                            <div>{{ option.name }}</div>
                                        </div>
                                        <template v-if="!data.value || data.value.length === 0">
                                            <div>{{ data.placeholder }}</div>
                                        </template>
                                    </template>
                                    <template #option="data">
                                        <div class="flex align-items-center">
                                            <div>{{ data.option.name }}</div>
                                        </div>
                                    </template>
                                </MultiSelect>
                                <!-- <InputText id="examiner" type="text" v-model="round.examiner" required="true" /> -->
                            </div>
                            <!-- <div class="field mb-4 col-12">
                                <label htmlFor="file" class="font-medium text-900"> File </label>
                                <FileUpload name="file" url="./upload.php" accept="image/*" :multiple="true" :maxFileSize="1000000" chooseLabel="Upload Image" class="p-button-outlined p-button-plain" v-model="round.file"> </FileUpload>
                            </div> -->
                            <div class="field mb-4 col-12">
                                <Button label="Lưu" class="w-auto mt-3" @click="active = 1"></Button>
                            </div>
                        </div>
                    </TabPanel>
                    <!-- <TabPanel header="Câu hỏi">
                        <div class="grid formgrid p-fluid" id="question">
                            <div class="show" v-for="(item, idx) in round.questions" style="width: 100%">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="question" class="font-medium text-900"> Câu hỏi {{ idx + 1 }} : </label>
                                    <InputText id="question" type="text" v-model="item.quest" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="item.point[0]" showButtons mode="decimal">Min </InputNumber>
                                    <label class="font-medium text-900" style="text-align: center; margin: 0; min-width: 5rem"> - </label>
                                    <InputNumber class="point" v-model="item.point[1]" showButtons mode="decimal">Max </InputNumber>
                                    <div class="action" style="margin-left: 50px">
                                        <Button icon="pi pi-trash" class="p-button-rounded mr-2" severity="danger" @click="delQuest(item)" />
                                    </div>
                                </div>
                            </div>
                            <div class="create" style="width: 100%">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="nickname" class="font-medium text-900"> Câu hỏi {{ round.questions.length + 1 }} :</label>
                                    <InputText id="nickname" type="text" v-model="question.quest" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="question.point[0]" showButtons mode="decimal" />
                                    <label htmlFor="nickname" class="font-medium text-900" style="text-align: center; margin: 0; min-width: 5rem"> - </label>
                                    <InputNumber class="point" v-model="question.point[1]" showButtons mode="decimal" />
                                </div>
                            </div>
                            <small class="p-invalid mb-3 col-4" v-if="submitted && round.questions.length == 0"> Cuộc thi cần ít nhất 1 câu hỏi.</small>
                            <div class="field mb-4 col-12">
                                <Button label="Thêm" class="w-auto mt-3" @click="addQuestion"></Button>
                                <Button label="Lưu" class="w-auto mt-3" @click="saveRound" style="margin-left: 15px"></Button>
                            </div>
                        </div>
                    </TabPanel> -->
                    <TabPanel header="Câu hỏi">
                        <div class="grid formgrid p-fluid" id="question">
                            <div class="show" v-for="(item, index) in round.questions" style="width: 100%">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="question" class="font-medium text-900"> Câu hỏi {{ index + 1 }} : </label>
                                    <InputText id="question" type="text" v-model="item.name" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="item.point[0]" showButtons mode="decimal" :min="0">Min </InputNumber>
                                    <label class="font-medium text-900" style="text-align: center; margin: 0; min-width: 5rem"> - </label>
                                    <InputNumber class="point" v-model="item.point[1]" showButtons mode="decimal">Max</InputNumber>
                                    <div class="action" style="margin-left: 50px">
                                        <Button icon="pi pi-trash" class="p-button-rounded mr-2" severity="danger" @click="delQuest(item)" />
                                    </div>
                                </div>
                            </div>
                            <div class="create" style="width: 100%">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="nickname" class="font-medium text-900"> Câu hỏi them {{ round.questions.length + 1 }} :</label>
                                    <InputText id="nickname" type="text" v-model="question.name" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="question.point[0]" showButtons mode="decimal" />
                                    <label htmlFor="nickname" class="font-medium text-900" style="text-align: center; margin: 0; min-width: 5rem"> - </label>
                                    <InputNumber class="point" v-model="question.point[1]" showButtons mode="decimal" />
                                </div>
                            </div>

                            <div class="field mb-4 col-12">
                                <Button label="Thêm" class="w-auto mt-3" @click="addQuestion"></Button>
                                <Button label="Lưu" class="w-auto mt-3" @click="saveRound" style="margin-left: 15px"></Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible="deleteExamDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="round"
                >Chắc chắn xóa <b>{{ round.name }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteExamDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteData" />
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
