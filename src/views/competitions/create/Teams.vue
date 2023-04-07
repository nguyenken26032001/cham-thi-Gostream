<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);


onBeforeMount(() => {
});
onMounted(() => {
});

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveData = () => {
    console.log("save data")
};

const editData = (data) => {
    product.value = { ...data };
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteData = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const toCreateTeamPage = ()=>{
    
}
</script>

<template>

    <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"  :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        responsiveLayout="scroll"
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
        <Column class="column" header="Mô tả">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column class="column" header="Files">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        
        <Column headerStyle="min-width:9rem;">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                    @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="confirmDeleteProduct(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
    <div class="btn-add">
        <Button label="Thêm đội thi" icon="pi pi-plus" class="p-button-success" @click="openNew" style="margin-left: 300px;"/>
        <Button label="Tạo trang đăng ký" icon="pi pi-plus" class="" @click="toCreateTeamPage" style="margin-left: 100px;"/>
    </div>

    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Tạo đội thi" :modal="true"
        class="p-fluid">
        <div class="field">
            <label for="name">Tên Đội:</label>
            <InputText id="name" v-model.trim="product.name" required="true" autofocus
                :class="{ 'p-invalid': submitted && !product.name }" />
            <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
        </div> 
        <div class="field">
            <label for="description">Mô tả</label>
            <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
        </div>
        <div class="field">
            <label for="image" class="font-medium text-900">File</label>
            <FileUpload name="image" url="./upload.php" accept="*" :multiple="true" :maxFileSize="1000000"
                chooseLabel="Upload" class="p-button-outlined p-button-plain"></FileUpload>
        </div>
        <template #footer>
            <Button label="Hủy" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Lưu" icon="pi pi-check" class="p-button-text" @click="saveData" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteData" />
        </template>
    </Dialog>
</template>
<style scoped>
.btn-add{
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
