<script setup>
import 'primeicons/primeicons.css';
import { onBeforeMount, ref, watch, provide, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { HTTP } from '../../midleware/http';
import useClipboard from 'vue-clipboard3';
import ModalCreateTeam from '../../components/ModalCreateTeam.vue';

const { toClipboard } = useClipboard();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { contextPath } = useLayout();
const competition = ref({});
const role = ref(null);
const dataSort = ref([]);
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png']);
const openCreateTeam = ref(false);
const openAddTeam = ref(false);
const team = ref({});
const arrDiemTB = ref([]);
const classIconSort = ref('pi pi-sort-amount-down');
const sort_type = ref('desc');
const infoCompetition = ref({});
provide('openCreateTeam', openCreateTeam);
provide('openAddTeam', openAddTeam);
onMounted(async () => {
    role.value = JSON.parse(localStorage.getItem('user')).role;
    await HTTP.get(`competition/${route.params.id}`)
        .then((res) => {
            infoCompetition.value = res.data.competition[0];
            let a = res.data.competition[0];
            console.log('dataa', a);
            a.round = res.data.competition[0].round.map((round) => {
                round.teams = round.teams.map((team) => {
                    const new_team = { ...a.teams.find((full_team) => team._id == full_team._id) };
                    console.log('new_team', new_team);
                    new_team.rounds = new_team.rounds
                        .filter((_round) => _round.idRound == round._id)
                        .map((r) => {
                            const sum = r.marks.reduce((a, b) => a + b.marks || 0, 0);
                            return {
                                ...r,
                                sum
                            };
                        });
                    new_team.avg = new_team.rounds.reduce((a, b) => a + b.sum || 0, 0) / new_team.rounds.length;
                    return new_team;
                });
                round.teams = round.teams.sort((a, b) => b.avg - a.avg);
                return round;
            });
            competition.value = a;
            console.log('a', a);
        })
        .catch((err) => console.log(err));
});
const sort_team = (sort_type) => {
    if (sort_type == 'asc') {
        return competition.value.round.map((round) => round.teams.sort((a, b) => a.avg - b.avg));
    } else {
        return competition.value.round.map((round) => round.teams.sort((a, b) => b.avg - a.avg));
    }
};
function copyLink() {
    if (competition.value.url) {
        toClipboard(competition.value.url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Sao chép thành công', life: 3000 });
    }
}

const editTeam = (item) => {
    team.value = item;
    openAddTeam.value = !openAddTeam.value;
};

const deleteTeam = async (item) => {
    await HTTP.delete(`teams/${item._id}`)
        .then((res) => {
            competition.value.teams = competition.value.teams.filter((val) => val.id !== item._id);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Xóa đội thi thành công', life: 3000 });
        })
        .catch((err) => {
            console.log(err);
        });
    router.go(0);
};
const score = (item) => {
    router.push({ name: 'competitions-score', params: { id: item._id } });
};
const getMarksByName = (data, name) => {
    const item = data.marks.find((mark) => mark.name === name);
    return item ? item.marks : null;
};
const totalMarks = (data, idRoundTong, idRounChiTiet) => {
    if (idRounChiTiet !== idRoundTong) return;
    if (data) return data.marks.reduce((a, c) => a + c.marks, 0);
    return 0;
};
const handlerAverage = (data, idRound) => {
    const soLuong = data.rounds.filter((item) => item.idRound == idRound).length;
    const result = data.rounds.filter((item) => item.idRound == idRound);
    var totalMarks = 0;
    result.forEach((item) => {
        item.marks.forEach((mark) => {
            totalMarks += mark.marks;
        });
    });

    return totalMarks / soLuong;
};
const sort = () => {
    // if (classIconSort.value == 'pi pi-sort-amount-up') {
    //     classIconSort.value = 'pi pi-sort-amount-up';
    // }
    classIconSort.value = classIconSort.value == 'pi pi-sort-amount-up-alt' ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up-alt';
    sort_type.value = sort_type.value == 'desc' ? 'asc' : 'desc';
    sort_team(sort_type.value);
};
//
</script>
<template>
    <div class="card">
        <span class="text-900 text-xl font-bold mb-4 block">Chi tiết cuộc thi</span>
        <div class="grid">
            <div class="col-12 md:col-12" style="margin: auto">
                <div class="card card-w-title">
                    <div class="competition">
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Tên cuộc thi: </label>
                            <label class="font-medium text-900">{{ infoCompetition.name }}</label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Mô tả: </label>
                            <label class="font-medium text-900">
                                {{ infoCompetition.describe }}
                            </label>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail"> Hình ảnh: </label>
                            <div class="flex flex-row w-2 justify-content-between">
                                <Image v-for="(img, i) in infoCompetition.image" :alt="i" :key="i" :src="img" width="250" preview />
                            </div>
                        </div>
                        <div class="field mb-2 col-12">
                            <label htmlFor="name" class="font-bold text-800 detail" style="align-self: center"> Link đăng ký: </label>
                            <div class="flex flex-row justify-content-between">
                                <InputText type="text" class="inputForm" readonly="true" v-model="infoCompetition.url" />
                                <Button id="copyLink" icon="pi pi-copy" class="p-button-text" @click="copyLink" />
                            </div>
                        </div>
                    </div>
                    <div class="team">
                        <div class="flex flex-row justify-content-between">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Đội thi:</span>
                            <Button label="Chỉnh sửa" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/competitions/create/team/${competition._id}`)" />
                        </div>
                        <DataTable
                            ref="dt"
                            :value="infoCompetition.teams"
                            dataKey="id"
                            :rows="10"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            responsiveLayout="scroll"
                            style="margin-top: 15px"
                        >
                            <Column field="id" header="Id" :sortable="true" headerStyle="width:5%">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <!-- {{ slotProps.data.name }} -->
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Tài liệu" headerStyle="" style="width: 20%">
                                <template #body="slotProps">
                                    {{ slotProps.data.file }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div>
                        <div class="flex flex-row justify-content-between mt-5">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center">Vòng thi:</span>
                            <Button label="Chỉnh sửa" class="p-button-outlined p-button-secondary mr-2 mb-2" @click="$router.push(`/competitions/create/round/${infoCompetition._id}`)" />
                        </div>
                        <DataTable ref="data" :value="infoCompetition.round" dataKey="id" :rows="10" responsiveLayout="scroll" style="margin-top: 15px">
                            <Column field="id" header="Vòng" :sortable="true" headerStyle="width:5%">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="name" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column class="column" header="Mô tả" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    {{ slotProps.data.describe }}
                                </template>
                            </Column>
                            <Column class="column" header="Người chấm thi" headerStyle="width:14%; min-width:17rem; max-width:27rem; overflow-wrap: break-word;">
                                <template #body="slotProps">
                                    <div v-for="item in slotProps.data.examiner">
                                        {{ item }}
                                    </div>
                                </template>
                            </Column>
                            <Column v-if="role === 'admin' && competition.status === 'create'" header="Bắt đầu">
                                <template #body="slotProps">
                                    <Button icon="pi pi-caret-right" class="p-button-rounded p-button-success mr-2" @click="" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div>
                        <div class="flex flex-row justify-content-between mt-5">
                            <span class="text-800 font-bold mb-4 block" style="margin: auto; margin-left: 15px; align-self: center; color: red !important">Kết quả</span>
                        </div>
                        <Accordion :activeIndex="0">
                            <AccordionTab v-for="round in competition.round" :header="round.name">
                                <template #header>
                                    <i :class="classIconSort" style="color: slateblue; margin-left: 15px" @click="sort"></i>
                                </template>
                                <Accordion>
                                    <AccordionTab v-for="team in round.teams" :header="team.name">
                                        <template #header>
                                            <span style="margin-left: 20px"> Điểm TB: </span> <span style="margin-left: 20px">{{ team.avg }}</span>
                                        </template>
                                        <DataTable ref="data" :value="team.rounds" :rows="10" responsiveLayout="scroll" style="margin-top: 15px">
                                            <Column field="examiner" header="Giám khảo" :sortable="true" headerStyle="min-width:1rem;">
                                                <template #body="slotProps">
                                                    <div v-if="slotProps.data.idRound === round._id">{{ slotProps.data.examiner }}</div>
                                                </template>
                                            </Column>
                                            <Column v-if="role === 'examiner'" header="Tổng điểm">
                                                <template #body="slotProps">
                                                    {{ slotProps.data.sum }}
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </AccordionTab>
                                </Accordion>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal-create-team :id="competition._id" />
</template>
<style scoped>
.competition .field {
    display: flex;
    margin: 0;
}

.detail {
    min-width: 9em;
}
</style>
