<template>
    <q-dialog full-width>
        <div class="dialog-main">
            {{ question.text }}
        </div>
    </q-dialog>
</template>

<script setup>

defineProps({
    question: Object
});
</script>

<style scoped>
.dialog-main {
    height: 80%;
    width: 80% !important;
    border: solid 1px white;
}
</style>
