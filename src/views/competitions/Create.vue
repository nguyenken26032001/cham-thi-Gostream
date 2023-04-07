<script>
import { HTTP } from "../../midleware/http"
import { useToast } from 'primevue/usetoast';
import Teams from './create/Teams.vue';
import Exams from './create/Exams.vue';

export default {
    data() {
        return {
            lock: false,
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
            const toast = useToast();
            this.submitted = true
            if (this.competition.name && this.competition.describe)
                HTTP.post("competition", this.competition)
                    .then(res => {
                        this.competition = res.data;
                        this.tab = 2;
                        this.submitted = false;
                        this.lock = false;
                        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo cuộc thi thành công', life: 3000 });
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
                                <small class="p-invalid mb-3 col-3" v-if="submitted && !competition.name">Tên không được
                                    trống.</small>

                                <div class="field mb-2 col-12">
                                    <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
                                    <Textarea id="desc" type="text" :rows="5" autoResize v-model="competition.describe"
                                        required="true" autofocus :class="{ 'p-invalid': submitted }"></Textarea>
                                </div>
                                <small class="p-invalid mb-3 col-3" v-if="submitted && !competition.describe">Mô tả không
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
                            <Teams />
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
.tabs {
    position: relative;
    margin: 3rem 0;
}


.tabs::before,
.tabs::after {
    content: "";
    display: table;
}

.tabs::after {
    clear: both;
}

.tab {
    float: left;
}

.tab-switch {
    display: none;
}

.tab-label {
    position: relative;
    display: block;
    line-height: 2.75em;
    height: 3em;
    padding: 0 1.618em;
    color: #64748b;
    cursor: pointer;
    top: 0;
    transition: all 0.25s;
    font-weight: bold;
}

.tab-label:hover {
    top: -0.25rem;
    transition: top 0.25s;
}

.tab.lock .tab-label {
    top: 0;
    transition: none;
}

.tab-switch:checked+.tab-label {
    color: #6366f1;
    border-bottom: 0.125rem solid #6366f1;
    transition: all 0.35s;
    z-index: 1;
    top: -0.0625rem;
}

.tab-switch:checked+label+.tab-content {
    z-index: 2;
    opacity: 1;
    transition: all 0.35s;
    border-bottom: 0.125rem solid #1abc9c;
}
</style>
