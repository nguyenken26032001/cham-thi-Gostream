<script>
import { HTTP } from "../../midleware/http"
import { useToast } from 'primevue/usetoast';
import Teams from './create/Teams.vue';
import Exams from './create/Exams.vue';

export default {
    data() {
        return {
            lock: true,
            tab: 1,
            competition: {
                name: "",
                describe: "",
                image: [""]
            },
            submitted: false,
        }
    },
    methods: {
        create() {
            // const toast = useToast();
            this.submitted = true
            if (this.competition.name && this.competition.describe)
                HTTP.post("competition", this.competition)
                    .then(res => {
                        this.competition = res.data;
                        this.submitted = false;
                        this.lock = false;
                        this.tab = 2;
                        // toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo cuộc thi thành công', life: 3000 });
                    })
                    .catch(e => {
                        console.log(e)
                    })
        }
    },
    components: {
        Teams,
        Exams
    }
}

</script>

<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Tạo Cuộc thi</span>
        <div class="grid">
            <div class="col-12 md:col-12" style="margin: auto;">
                <div class="card card-w-title">
                    <TabView>
                        <TabPanel header="Cuộc thi">
                            <div class="grid formgrid p-fluid">
                                <div class="field mb-2 col-12">
                                    <label htmlFor="name" class="font-medium text-900"> Tên cuộc thi </label>
                                    <InputText id="name" type="text" v-model.trim="competition.name" required="true"
                                        autofocus :class="{ 'p-invalid': submitted }" />
                                </div>
                                <small class="p-invalid mb-3 col-4" v-if="submitted && !competition.name">Tên không được
                                    trống.</small>

                                <div class="field mb-2 col-12">
                                    <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                    <Textarea id="desc" type="text" :rows="5" autoResize v-model="competition.describe"
                                        required="true" autofocus :class="{ 'p-invalid': submitted }"></Textarea>
                                </div>
                                <small class="p-invalid mb-3 col-4" v-if="submitted && !competition.describe">Mô tả không
                                    được trống.</small>

                                <div class="field mb-4 col-12">
                                    <label htmlFor="image" class="font-medium text-900"> Hình ảnh </label>
                                    <FileUpload name="image" url="./upload.php" accept="image/*" :multiple="true"
                                        :maxFileSize="1000000" chooseLabel="Upload Image"
                                        class="p-button-outlined p-button-plain"></FileUpload>
                                </div>

                                <div class="col-12">
                                    <Button label="Tạo Cuộc thi" class="w-auto mt-3" @click="create"></Button>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Đội thi" v-bind:disabled="lock">
                            <Teams :id="competition._id"/>
                        </TabPanel>
                        <TabPanel header="Vòng thi" v-bind:disabled="lock">
                            <Exams />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.formgrid small{
    color: red;
}
</style>
