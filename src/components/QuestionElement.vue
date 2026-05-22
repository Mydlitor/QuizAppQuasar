<template>
    <q-card class="question-element">
        <p>{{ questionNumber }}</p>
        <p>{{ questionText }}</p>
    </q-card>
</template>

<script setup>
defineProps({
    questionText: String,
    questionNumber: Number
})
</script>

<style scoped>
.question-element {
    height: 10rem;
    width: 10rem;
}
</style>
