<script>
export default {
    data() {
        return {
            competition:{
                name:"",
                describe:"",
                image:[""]
            }
        }
    },
    methods: {
        create(){
            this.$emit("unlock", false)
        }
    }
}

</script>

<template>
    <div class="grid formgrid p-fluid">
        <div class="field mb-4 col-12">
            <label htmlFor="name" class="font-medium text-900"> Tên cuộc thi </label>
            <InputText id="name" type="text" v-model.trim="competition.name"
            required="true" autofocus :class="{'p-invalid': submitted}"/>
        </div>
        <div class="field mb-4 col-12">
            <label htmlFor="desc" class="font-medium text-900"> Mô tả </label>
            <Textarea id="desc" type="text" :rows="5" autoResize></Textarea>
        </div>
        <div class="field mb-4 col-12">
            <label htmlFor="image" class="font-medium text-900"> Hình ảnh </label>
            <FileUpload name="image" url="./upload.php" accept="image/*" :multiple="true" :maxFileSize="1000000"
                chooseLabel="Upload Image" class="p-button-outlined p-button-plain"></FileUpload>
        </div>
        <div class="col-12">
            <Button label="Tạo Cuộc thi" class="w-auto mt-3" @click="create"></Button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.grid {
    margin-top: 20px;
}
</style>