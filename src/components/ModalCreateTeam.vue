<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref, inject, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { HTTP } from "/src/midleware/http";
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()
const openCreateTeam = inject('openCreateTeam');
const options = ref([
    { id: '1', value: true, name: 'name', label: 'Tên đội', edit: false },
    { id: '2', value: true, name: 'describe', label: 'Mô Tả đội', edit: false },
    { id: '3', value: true, name: 'upload', label: 'upload file', edit: false },
]);

const toast = useToast();

function copyLink() {
    const selectedOptions = options.value.filter((option) => option.value);
    if (selectedOptions.length > 0) {
        const idForm = uuidv4()

        const obj = {};
        for (const { name } of selectedOptions) {
            obj[name] = 'default-value';
        }
        obj.id = idForm
        HTTP.post("/teams/create", obj)
                    .then(res => {
                        // console.log(res.data)
                        if(res?.data?.team?.id){
                            toClipboard(`http://localhost:5173/?#/form/${res?.data?.team?.id}`)
                            alert('copy success')
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })

        // console.log('Saving form data:', selectedOptions);
    } else {
        toast.add({ severity: 'warn', summary: 'Form Error', detail: 'Please select at least one option', life: 3000 });
    }
}

function addItemInForm() {
    options.value.push({ id: `${options.value.length + 1}`, value: true, label: 'Default', edit: false })
}

function rename(id) {
    const correctItem = options.value.find(item => item.id === id)
    correctItem.edit = !correctItem.edit
    const ele = document.getElementsByClassName(`correctFocus-${id}`)
    if (!correctItem.edit) {
        correctItem.label = ele[0].textContent
        console.log(options.value, "correctItem")
    } else {
        setTimeout(() => {
            ele[0].focus()
            const range = document.createRange();
            range.selectNodeContents(ele[0]);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

        }, 50);
    }
}

</script>
<template>
    <Dialog v-model:visible="openCreateTeam" :style="{ width: '500px' }" header="Tạo Form" :modal="true" class="p-fluid">
        <form @submit.prevent="onSubmit">
            <div class="mb-2">Các mục cần điền:</div>
            <div class="card flex">
                <div class="flex flex-column gap-2 w-full">
                    <div v-for="(option, index) in options" :key="option.id"
                        class="p-field-checkbox mb-2 gap-2 flex justify-content-between align-items-center w-full">
                        <div class="p-field-checkbox mb-2 gap-2 flex align-items-center">
                            <input type="checkbox" :id="option.id" v-model="option.value" :name="option.id" />
                            <div class="label" :class="`correctFocus-${option.id}`" :contenteditable="option.edit">{{
                                option.label }}</div>
                        </div>
                        <Button :icon="!option.edit ? 'pi pi-pencil' : 'pi pi-save'" @click="rename(option.id)" rounded />
                    </div>
                    <Button label="Add New" icon="pi pi-plus" class="w-6" size="small" @click="addItemInForm" />
                </div>
            </div>
            <Button label="Copy Link Form" type="submit" icon="pi pi-check" class="p-button-text submit-btn"
                @click="copyLink" />
        </form>
    </Dialog>
</template>

<style lang="scss" scoped>
.submit-btn {
    border: 1px solid #6366f1 !important;
}

.submit-btn:focus {
    box-shadow: none;
}

.label {
    line-height: 20px;
    outline: none;
}

input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 4px;
    border: 2px solid #ccc;
    outline: none;
    cursor: pointer;
    position: relative;
}

input[type="checkbox"]:checked::before {
    content: "x";
    font-weight: 800;
    position: absolute;
    top: 5px;
    left: 8px;
    transform: translate(-50%, -50%);
    color: white;
}

input[type="checkbox"]:focus {
    border-color: #1c7cd6;
}

input[type="checkbox"]:hover:not(:checked) {
    border-color: #999;
}

input[type="checkbox"]:checked {
    border-color: #1c7cd6;
    background-color: #1c7cd6;
}
</style>