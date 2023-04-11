<script setup>
  import { ref } from 'vue'
//   import { Dropdown, FileUpload, Button } from 'primevue/button'
//   import 'primevue/resources/themes/saga-blue/theme.css'
//   import 'primevue/resources/primevue.min.css'
//   import 'primeicons/primeicons.css'
  
  const teamName = ref('')
  const description = ref('')
  const fileType = ref(null)
  const fileTypeOptions = ref([
    { label: 'PNG', value: 'image/png' },
    { label: 'JPG', value: 'image/jpeg' },
    { label: 'PDF', value: 'application/pdf' }
  ])
  const file = ref(null)
  const maxFileSize = ref(1000000) // Maximum file size in bytes

  function handleFileUpload(event) {
    file.value = event.files[0]
  }

  function submitForm() {
    const formData = new FormData()
    formData.append('teamName', teamName.value)
    formData.append('description', description.value)
    formData.append('fileType', fileType.value)
    formData.append('file', file.value)

    // Make your API call with the formData
  }
</script>
<template>
    <div class="p-fluid w-10 mx-auto mt-8">
      <div class="p-field">
        <label for="teamName">Tên đội</label>
        <input type="text" v-model="teamName" id="teamName" class="p-inputtext p-component">
      </div>
      <div class="p-field">
        <label for="description">Mô tả</label>
        <textarea v-model="description" id="description" class="p-inputtextarea p-component"></textarea>
      </div>
      <div class="p-field">
        <label for="fileType">Kiểu file</label>
        <Dropdown v-model="fileType" :options="fileTypeOptions" optionLabel="label" optionValue="value" placeholder="Chọn kiểu file" class="p-dropdown p-component" />
      </div>
      <div class="p-field mt-4">
        <label for="file">Chọn file</label>
        <FileUpload mode="basic" customUpload @upload="handleFileUpload" :accept="fileType" :maxFileSize="maxFileSize" :chooseLabel="'Chọn file'" class="p-fileupload p-component"/>
      </div>
      <Button label="Gửi" icon="pi pi-check" @click="submitForm" class="p-button p-component mt-4"/>
    </div>
  </template>