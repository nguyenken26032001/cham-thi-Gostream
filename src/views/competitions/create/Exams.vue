<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import router from "../../../router"

const toast = useToast();

const exams = ref(null);
const exam = ref({});
const deleteExamDialog = ref(false);
const examsDialog = ref(false)
const selectedExams = ref(null);
const data = ref(null);

const tab = ref(0);
const question = ref({
    quest: "",
    point: [0, 10]
});
const questions = ref([])
const disable = ref(true)

onBeforeMount(() => {
});
onMounted(() => {
});

const createExam = () => {
    exam.value = {};
    // submitted.value = false;
    examsDialog.value = true;
    // router.push({ name: "exams-create" })
};

const confirmDeleteExam = (editExam) => {
    exam.value = editExam;
    deleteExamDialog.value = true;
};

const deleteData = () => {
    exams.value = exams.value.filter((val) => val.id !== exam.value.id);
    deleteExamDialog.value = false;
    exam.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'exam Deleted', life: 3000 });
};

const addQuestion = () => {
    if (question.value.quest && question.value.point[1] > 0) {
        question.value.id = createId();
        questions.value.push(question.value);
        // toast.add({ severity: 'success', summary: 'Successful', detail: 'question Created', life: 3000 });
        question.value = {
            quest: "",
            point: [0, 10]
        };
    }
}
const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < questions.value.length; i++) {
        if (questions.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
</script>

<template>
    <DataTable ref="data" :value="exams" v-model:selection="selectedExams" dataKey="id" :rows="10" responsiveLayout="scroll"
        style="margin-top: 15px;">

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
        <Column class="column" header="Mô tả" headerStyle="">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column class="column" header="Files" headerStyle="">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column class="column" header="Người chấm thi" headerStyle="">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column headerStyle="min-width:9rem;">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                    @click="editExam(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="confirmDeleteExam(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm vòng thi" icon="pi pi-plus" class="p-button-success" @click="createExam" />
    </div>
    <Dialog v-model:visible="examsDialog" header="Tạo vòng thi" :modal="true" class="p-fluid" style="max-width: 57rem;">
        <div class="col-12 md:col-12" style="margin: auto;">
            <div class="card card-w-title">
                <TabView>
                    <TabPanel header="Vòng thi">
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-4 col-12">
                                <label htmlFor="nameExam" class="font-medium text-900"> Tên vòng thi </label>
                                <InputText id="nameExam" type="text" />
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                <Textarea id="desc" type="text" :rows="3" autoResize></Textarea>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="examiner" class="font-medium text-900"> Người chấm thi </label>
                                <InputText id="examiner" type="text" />
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="file" class="font-medium text-900"> File </label>
                                <FileUpload name="file" url="./upload.php" accept="image/*" :multiple="true"
                                    :maxFileSize="1000000" chooseLabel="Upload Image"
                                    class="p-button-outlined p-button-plain">
                                </FileUpload>
                            </div>

                            <div class="col-12">
                                <Button label="Create Exam" class="w-auto mt-3" @click="tab = 1"></Button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Câu hỏi">
                        <div class="grid formgrid p-fluid" id="question">
                            <div class="show" v-for="item, idx in questions" style="width: 100%;">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="question" class="font-medium text-900"> Câu hỏi {{ idx + 1 }} :
                                    </label>
                                    <InputText id="question" type="text" :disabled="disable" v-model="item.quest" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="item.point[0]" showButtons mode="decimal"
                                        :disabled="disable">Min</InputNumber>
                                    <label class="font-medium text-900"
                                        style="text-align: center;margin: 0; min-width: none;"> -
                                    </label>
                                    <InputNumber class="point" v-model="item.point[1]" showButtons mode="decimal"
                                        :disabled="disable">Max</InputNumber>
                                    <div class="action" style="margin-left: 20px;">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                            @click="editQuest(item)" />
                                        <Button icon="pi pi-save" class="p-button-rounded p-button-success mr-2"
                                            @click="saveQuestion(item)" :disabled="disable" />
                                    </div>
                                </div>
                            </div>
                            <div class="create" style="width: 100%;">
                                <div class="field mb-4 col-12">
                                    <label htmlFor="nickname" class="font-medium text-900"> Câu hỏi {{ questions.length + 1 }} :</label>
                                    <InputText id="nickname" type="text" v-model="question.quest" />
                                </div>
                                <div class="field mb-4 col-12">
                                    <label htmlFor="point" class="font-medium text-900"> Điểm : </label>
                                    <InputNumber class="point" v-model="question.point[0]" showButtons mode="decimal"/>
                                    <label htmlFor="nickname" class="font-medium text-900"
                                        style="text-align: center;margin: 0; min-width: 5rem;"> - </label>
                                    <InputNumber class="point" v-model="question.point[1]" showButtons mode="decimal"/>
                                </div>
                            </div>
                            <div class="field mb-4 col-12">
                                <label htmlFor="nickname" class="font-medium text-900"></label>
                                <Button label="Thêm" class="w-auto mt-3" @click="addQuestion"></Button>
                                <Button label="Lưu" class="w-auto mt-3" @click="" style="margin-left: 15px;"></Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
        <!-- <template #footer>
            <Button label="Hủy" icon="pi pi-times" class="p-button-text" @click="" />
            <Button label="Lưu" icon="pi pi-check" class="p-button-text" @click="" />
        </template> -->
    </Dialog>
    <Dialog v-model:visible="deleteExamDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="exam">Are you sure you want to delete <b>{{ exam.name }}</b>?</span>
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
