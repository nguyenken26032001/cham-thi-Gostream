<script setup>
import { ref, nextTick, onMounted } from 'vue';
import ChatBox from './ChatBox.vue';
import ChatSidebar from './ChatSidebar.vue';
import { useLayout } from '@/layout/composables/layout';

const { contextPath } = useLayout();

const activeUserId = ref(1);
const users = ref([]);

onMounted(async () => {
    users.value = await getUserData();
    scrollToLastMessage();
});

const getUserData = async () => {
    const response = await fetch(contextPath + 'demo/data/chat.json');
    const { data } = await response.json();

    return data;
};

const changeActiveUser = (user) => {
    activeUserId.value = user.id;
    scrollToLastMessage();
};

const sendMessage = (message) => {
    const activeUser = findActiveUser();
    activeUser.messages.push(message);
    scrollToLastMessage();
};

const findActiveUser = () => {
    return users.value.find((user) => user.id === activeUserId.value) || {};
};

const scrollToLastMessage = async () => {
    const element = document.querySelector('.user-message-container');

    await nextTick(() => {
        element.scroll({ top: element.scrollHeight });
    });
};
</script>

<template>
    <div class="flex flex-column md:flex-row gap-5" style="min-height: 81vh">
        <div class="md:w-25rem border-1 surface-border surface-card border-round">
            <chat-sidebar @change:active:user="changeActiveUser" :users="users"></chat-sidebar>
        </div>
        <div class="flex-1 border-1 surface-border surface-card border-round">
            <chat-box @send:message="sendMessage" :user="findActiveUser()"></chat-box>
        </div>
    </div>
</template>
