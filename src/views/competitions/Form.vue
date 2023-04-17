<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from "vue-router";
import { HTTP } from '../../midleware/http';

const route = useRoute();
const formData = ref({});
const team = ref({
  teamOption: {}
});
const submitted = ref(false)

onBeforeMount(() => {
  fetchData();
})
const fetchData = () => {
  HTTP.get(`forms/${route.params.formId}`)
    .then(res => {
      formData.value = res.data

      console.log(formData.value)
    })
};
const sunmitData = () => {
  submitted.value = true
  team.value.competition_id = route.params.competitionId
  formData.value.defaultOption.forEach(el => {
    team.value[`${el.name}`] = el.value || [];
  })
  formData.value.customOption.forEach(el => {
    team.value.teamOption[`${el.name}`] = el.value;
  })
  HTTP.post('teams/create', team.value)
    .then(res => {
      console.log(res.data)
    })
    .catch(error => console.log(error))
  console.log(team.value)
}
</script>
<template>
  <div class="layout-container layout-light layout-colorscheme-menu layout-static p-ripple-disabled">
    <div class="layout-content-wrapper" style="margin: 30px auto; max-width: 900px;">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <div class="card flex">
              <div class="flex flex-column gap-2 w-full">
                <label class="labelHeader mb2 gap-2" id="titleFrom">{{ formData.title
                }}</label>
                <label class="labelHeader mb2 gap-2" id="describe">{{ formData.describe }}</label>
              </div>
            </div>
            <div class="grid formgrid p-fluid mx-auto mt-5">
              <div v-for="(option, index) in formData.defaultOption" :key="index"
                class="card mb-2 justify-content-between align-items-center w-full">
                <span> <span> {{ index + 1 }} </span>. {{ option.label }}</span>
                <InputText v-if="option.type == 'short'" class="inputForm mb-4" type="text" v-model="option.value"
                  placeholder="Điền thông tin" required="true" :class="{ 'p-invalid': submitted && !option.value }" />
                <Textarea v-if="option.type == 'paragraph'" class="inputForm mb-4" type="text" :rows="5" autoResize
                  v-model="option.value" placeholder="Điền thông tin" required="true"
                  :class="{ 'p-invalid': submitted && !option.value }"></Textarea>
                <FileUpload v-if="option.type == 'upload'" name="image" url="./upload.php" accept="image/*"
                  :multiple="true" :maxFileSize="1000000" chooseLabel="Upload Image" class="inputForm p-button-outlined">
                </FileUpload>
              </div>
              <div v-for="(option, index) in formData.customOption" :key="index"
                class="card mb-2 justify-content-between align-items-center w-full">
                <span> <span> {{ index + 4 }} </span>. {{ option.label }}</span>
                <InputText v-if="option.type == 'short'" class="inputForm mb-4" type="text" required="true"
                  v-model="option.value" placeholder="Điền thông tin" />
                <Textarea v-if="option.type == 'paragraph'" class="inputForm mb-4" type="text" :rows="5" autoResize
                  v-model="option.value" placeholder="Điền thông tin"></Textarea>
                <FileUpload v-if="option.type == 'upload'" name="image" url="./upload.php" accept="image/*"
                  :multiple="true" :maxFileSize="1000000" chooseLabel="Upload Image" class="inputForm p-button-outlined">
                </FileUpload>
              </div>
              <div class="col-12 flex justify-content-end">
                <Button label="Đăng ký đội thi" class="w-auto mt-3" @click="sunmitData"></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inputForm {
  display: block;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.labelHeader {
  border: none;
  font-family: Arial, Helvetica, sans-serif;
  border-bottom: 2px solid #cbd5e1;
  padding: 10px;
  border-radius: 10px;
}

#titleFrom {
  font-size: xx-large;
  font-weight: bold;
  border-bottom: 4px solid #cbd5e1;

}

#describe {
  margin-top: 10px;
}
</style>