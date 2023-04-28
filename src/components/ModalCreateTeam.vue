<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../midleware/http';
import useClipboard from 'vue-clipboard3';
import { locdau } from '../midleware/convertString';

const link = ref("")
const prop = defineProps(["id"]);
const toast = useToast();
const { toClipboard } = useClipboard()
const openCreateTeam = inject('openCreateTeam');
const defaultOptions = ref([
    { name: "name", label: 'Tên đội', type: 'short' },
    { name: "describe", label: 'Mô Tả đội', type: 'paragraph' },
    { name: "file", label: 'upload file', type: 'upload' },
]);
const customOption = ref([])
const type = ref([
    { label: 'Trả lời ngắn', value: 'short', },
    { label: 'Đoạn', icon: 'pi-align-left', value: 'paragraph', },
    { label: 'Tải tệp', icon: 'pi-folder', value: 'upload', },
])
const form = ref({
    title: "Form không có tiêu đề",
    describe: ""
})
const dataForm = ref({})

function copyLink() {
    if (link.value) {
        toClipboard(link.value)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Sao chép thành công', life: 3000 });
    }
}
async function createLink() {
    convertStr()
    form.value.defaultOption = defaultOptions.value;
    form.value.customOption = customOption.value;
    form.value.id = prop.id;
    await HTTP.post(`forms/create`, form.value)
        .then(res => {
            dataForm.value = res.data
            if (res.data.status == 300) {
                link.value = res.data.url;
                toast.add({ severity: 'warn', summary: 'Warning', detail: 'Cuộc thi đã có form đăng ký', life: 4000 });
            } else {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Tạo form thành công', life: 3000 });
                link.value = res.data.url;
            }
        })
        .catch(error => console.log(error));
}
function convertStr() {
    customOption.value.forEach(function (item, index, array) {
        item.name = locdau(item.label)
    })
}
function addItemInForm() {
    customOption.value.push({ name: "", label: '', type: "short" })
};
function delCustomOption(item) {
    customOption.value = customOption.value.filter((el) => el != item)
}
</script>
<template>
    <Dialog v-model:visible="openCreateTeam" :style="{ width: '700px' }" header="Tạo Form" :modal="true" class="p-fluid">
        <div class="card flex">
            <div class="flex flex-column gap-2 w-full">
                <InputText class="inputForm mb2 gap-2" id="titleFrom" type="text" required="true" v-model="form.title" />
                <InputText class="inputForm mb2 gap-2" id="describe" type="text" v-model="form.describe"
                    placeholder="Mô tả" />
            </div>
        </div>
        <div class="card flex">
            <div class="flex flex-column w-full">
                <div v-for="(option, index) in defaultOptions" :key="index"
                    class="p-field-checkbox mb-2 flex justify-content-between align-items-center w-full">
                    <div class="p-field-checkbox mb-2 flex align-items-center" style="flex: 0 1 370px;">
                        <InputText class="inputForm mb2" type="text" required="true" v-model="option.label"
                            placeholder="Nhập tên trường" />
                    </div>
                    <div class="p-field-checkbox mb-2 flex justify-content-between align-items-center">
                        <Dropdown v-model="option.type" :options="type" optionLabel="label" optionValue="value"
                            optionIcon="icon" class="p-dropdown p-component" style="min-width: 150px;" />
                        <Button icon="" class="p-button-text" disabled="true" />

                    </div>
                </div>
                <div v-for="(option, index) in customOption" :key="index"
                    class="p-field-checkbox mb-2 flex justify-content-between align-items-center w-full">
                    <div class="p-field-checkbox mb-2 flex align-items-center" style="flex: 0 1 370px;">
                        <InputText class="inputForm mb2" type="text" required="true" v-model="option.label"
                            placeholder="Nhập tên trường" />
                    </div>
                    <div class="p-field-checkbox mb-2 flex justify-content-between align-items-center">
                        <Dropdown v-model="option.type" :options="type" optionLabel="label" optionValue="value"
                            optionIcon="icon" class="p-dropdown p-component" style="min-width: 150px;" />
                        <Button icon="pi pi-trash" class="p-button-text" @click="delCustomOption(option)" />

                    </div>
                </div>
                <Button label="Add New" icon="pi pi-plus" class="w-6" size="small" @click="addItemInForm" />
            </div>
        </div>
        <div class="flex">
            <Button label="Tạo form" type="submit" icon="pi pi-check" class="p-button-text submit-btn"
                @click="createLink" />
            <div class="lg:col-9" style="padding-top: 0; padding-bottom: 0; display: flex;">
                <InputText type="text" class="inputForm" readonly="true" v-model="link" />
                <Button id="copyLink" icon="pi pi-copy" class="p-button-text" @click="copyLink" />
                <!-- <i class="pi pi-copy" id="copyLink" /> -->
            </div>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped>
.inputForm {
    border: none;
    font-family: Arial, Helvetica, sans-serif;
    border-bottom: 2px solid #cbd5e1;
}

.p-dialog {
    overflow: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.p-dialog-content::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.p-dialog-content {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

#titleFrom {
    font-size: large;
    font-weight: bold;
    border-bottom: 4px solid #cbd5e1;

}

#describe {
    margin-top: 10px;
}

.submit-btn {
    border: 1px solid #6366f1 !important;
    padding-top: 0;
    padding-bottom: 0;
}

.submit-btn:focus {
    box-shadow: none;
}

#copyLink {
    margin: auto;
    border: 1px solid #cbd5e1;
}
</style>