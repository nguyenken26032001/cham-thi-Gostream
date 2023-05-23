<script setup>
import { ref } from 'vue';
import { vueDocPreview } from 'vue-doc-preview';

const docValue = ref('https://res.cloudinary.com/dkwfwcrkp/raw/upload/v1684684312/upload/h4l3n9cyjbh3zeun1f4z.doc');
const Office = 'office';
const mdStyle = ref({
    pre: {
        'background-color': 'rgb(187, 255, 255)'
    },
    code: {
        'background-color': 'rgb(187, 255, 255)',
        'line-height': '20px'
    }
});
</script>

<template>
    <span class="text-900 text-xl font-bold mb-4 block">PREVIEW DOCUMENT FOR TEAM</span>
    {{ docValue }}
    <vueDocPreview :value="docValue" :type="Office" :mdStyle="mdStyle" />
</template>
.

<style scoped></style>
