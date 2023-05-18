<script setup>
import { HTTP } from '../midleware/http';
import { useToast } from 'primevue/usetoast';
import { ref, provide, watch, onMounted, onBeforeMount } from 'vue';
const teams = ref([]);
const team = ref({});
const prop = defineProps(['id']); //get id from props
const toast = useToast();
const round = ref({});
const submitted = ref(false);
onMounted(() => {
    if (prop.id)
        HTTP.get(`/rounds/${prop.id}`)
            .then((res) => {
                console.log(res.data);
                round.value = res.data;
                console.log(round.value);
                teams.value = res.data.competition[0].teams;
            })
            .catch((e) => {
                console.log(e);
            });
});
</script>
<template>
    <!-- <h1>{{ round.name }}</h1> -->
    {{ round.teams }}
    <!-- <span v-for="item in round">
        <p>{{ item }}</p>
    </span> -->

    <Accordion :activeIndex="0">
        <AccordionTab v-for="item in round.teams" :key="item.index" :header="item.name">
            <DataTable
                ref="data"
                :value="round.questions"
                dataKey="id"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                responsiveLayout="scroll"
                style="margin-top: 15px"
            >
                <Column field="id" header="TT" headerStyle="min-width:1rem;">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="name" header="Tiêu chí" headerStyle="width:45%; min-width:10rem;">
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                        {{ slotProps.data.questions }}
                    </template>
                </Column>
                <Column headerStyle="min-width:9rem;" header="Điểm">
                    <template #body="slotProps">
                        <InputNumber v-model="value4" inputId="minmax" :min="0" :max="10" :placeholer="10" />
                    </template>
                </Column>
            </DataTable>
        </AccordionTab>
    </Accordion>

    <!-- <DataTable ref="data" :value="round.questions" dataKey="id" :rows="10" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" responsiveLayout="scroll" style="margin-top: 15px">
        <Column field="id" header="Id" :sortable="true" headerStyle="min-width:1rem;">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column field="name" header="Tiêu chí" :sortable="true" headerStyle="width:35%; min-width:10rem;">
            <template #body="slotProps">
                {{ slotProps.data.name }}
                {{ slotProps.data.questions }}
            </template>
        </Column>
        <Column class="column" header="Đội thi">
            <template #body="slotProps">
                {{ slotProps.data }}
            </template>
        </Column>

        <Column headerStyle="min-width:9rem;">
            <template #body="{ data, index }">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="viewDoc(data, index)" />
            </template>
        </Column>
    </DataTable> -->
    <modal-create-team :id="prop.id" />
    <!-- <ModelAddTeam :team="team" :competition_id="prop.id" /> -->
</template>
<style scoped>
.btn-add {
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
