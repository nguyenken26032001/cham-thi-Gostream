<script setup>
import { ref } from "vue";
import { HTTP } from "../../midleware/http"
import { useToast } from 'primevue/usetoast';
import Teams from './create/Teams.vue';
import Exams from './create/Exams.vue';
// import m3dia from 'm3dia';
const toast = useToast();
const lock = ref(true);
const active = ref(0);
const competition = ref({
    name: "",
    describe: "",
    image: []
});
const fileUploaderRef = ref(null);
const submitted = ref(false)
const files = ref(null);

const create = () => {
    submitted.value = true
    if (competition.value.name && competition.value.describe)
        HTTP.post("competition", competition.value)
            .then(res => {
                if (res.data.status == 200) {
                    competition.value = res.data.competition;
                    submitted.value = false;
                    lock.value = false;
                    active.value = 1;
                    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo cuộc thi thành công', life: 3000 })
                }
                if (res.data.status == 400) {
                    submitted.value = false;
                    toast.add({ severity: 'error', summary: 'Thất bại', detail: res.data.msg, life: 3000 })
                }
            })
            .catch(e => {
                console.log(e)
            })
}
const onChoosefiles = () => {
    fileUploaderRef.value.choose();
};
const previewPec = (event) => {
    files.value = event.files[0];
    competition.value.image = files.value.objectURL;
    console.log("🚀 ~ file: Create.vue:53 ~ onSelectedFiles ~ event.files[0]:", event.files[0])

    // const fetchedImage = cldInstance
    //     .image('https://res.cloudinary.com/demo/image/upload/turtles.jpg')
    //     .setDeliveryType('fetch');

    // console.log(fetchedImage.toURL());
}
const onRemoveFile = (removeFile) => {
    competition.value.image = files.value = "";
};
</script>

<template>
    <span class="text-900 text-xl font-bold mb-4 block">Tạo Cuộc thi</span>
    <div class="grid">
        <div class="col-12 md:col-12" style="margin: auto;">
            <div class="card card-w-title">
                <TabView v-model:activeIndex="active">
                    <TabPanel header="Cuộc thi">
                        <div class="grid formgrid p-fluid">
                            <div class="field mb-2 col-12">
                                <label htmlFor="name" class="font-medium text-900"> Tên cuộc thi </label>
                                <InputText id="name" type="text" v-model="competition.name" required="true" autofocus
                                    :class="{ 'p-invalid': submitted && !competition.name }" />
                            </div>
                            <small class="p-invalid mb-3 col-4" v-if="submitted && !competition.name">Tên không được
                                trống.</small>

                            <div class="field mb-2 col-12">
                                <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                <Textarea id="desc" type="text" :rows="5" autoResize v-model="competition.describe"
                                    required="true" autofocus
                                    :class="{ 'p-invalid': submitted && !competition.describe }"></Textarea>
                            </div>
                            <small class="p-invalid mb-3 col-4" v-if="submitted && !competition.describe">Mô tả không
                                được trống.</small>

                            <div class="field mb-4 col-12">
                                <label htmlFor="image" class="font-medium text-900"> Hình ảnh </label>
                                <!-- <FileUpload ref="files" name="image" accept="image/*" chooseLabel="Upload Image"
                                    :maxFileSize="1000000" @change="previewPec" class="p-button-outlined p-button-plain" /> -->
                                <FileUpload ref="fileUploaderRef" id="files-fileupload" name="demo[]" accept="image/*"
                                    customUpload auto class="upload-button-hidden w-full" :maxFileSize="1000000"
                                    @select="previewPec">
                                    <template #content>
                                        <div v-if="files" class="grid formgrid" :style="{ cursor: 'copy' }">
                                            <div class="remove-file-wrapper h-full relative w-15rem h-15rem border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto"
                                                :style="{ padding: '2px' }">
                                                <img :src="files.objectURL" alt="{files.name}"
                                                    class="w-full h-full border-round shadow-2" />
                                                <Button icon="pi pi-times"
                                                    class="remove-button p-button-rounded p-button-primary text-sm absolute justify-content-center align-items-center cursor-pointer"
                                                    :style="{ top: '-10px', right: '-10px', display: 'none' }"
                                                    @click="onRemoveFile(files)"></Button>
                                            </div>
                                        </div>
                                    </template>
                                    <template #empty>
                                        <div v-if="!files" @click="onChoosefiles" class="w-full py-3"
                                            :style="{ cursor: 'copy' }">
                                            <div class="h-full flex flex-column justify-content-center align-items-center">
                                                <i class="pi pi-upload text-900 text-2xl mb-3"></i>
                                                <span class="font-bold text-900 text-xl mb-3">Thêm hình ảnh</span>
                                                <span class="font-medium text-600 text-md text-center">Kéo hình ảnh vào
                                                    đây</span>
                                            </div>
                                        </div>
                                    </template>
                                </FileUpload>
                            </div>

                            <div class="col-12">
                                <Button label="Tạo Cuộc thi" class="w-auto mt-3" @click="create"></Button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Đội thi" v-bind:disabled="lock">
                        <Teams :id="competition._id" />
                    </TabPanel>
                    <TabPanel header="Vòng thi" v-bind:disabled="lock">
                        <Exams :id="competition._id" />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(#files-fileupload) {
    .p-fileupload-buttonbar {
        display: none;
    }
    .p-fileupload-content {
        padding-top: 10px;
        padding-left: 25px;
        border: none;
    }
}
.remove-file-wrapper:hover {
    .remove-button {
        display: flex !important;
        width: 32px;
        height: 32px;
    }
}
.formgrid small {
    color: red;
}
</style>
