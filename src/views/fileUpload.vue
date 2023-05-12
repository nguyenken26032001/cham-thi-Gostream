<script setup>

</script>
<template>
    <file-upload ref="upload" v-model="files" post-action="/post.method" put-action="/put.method" @input-file="inputFile"
        @input-filter="inputFilter">
        Upload file
    </file-upload>
</template>
<style scoped></style>