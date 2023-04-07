<script>
import { ref } from 'vue';
import Competition from './create/Competition.vue';
import Teams from './create/Teams.vue';
import Exams from './create/Exams.vue';
export default {
    data() {
        return {
            lock: true,
            tab: 1
        }
    },
    methods: {
        Unlock(e) {
            this.lock = e
        }
    },
    components: {
        Competition,
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
                            <Competition @unlock="Unlock" />
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
