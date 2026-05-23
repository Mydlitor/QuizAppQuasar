<template>
    <q-card class="question-element">
        <p>{{ questionPoints }}</p>
    </q-card>
</template>

<script setup>
defineProps({
    questionPoints: Number
})
</script>

<style scoped>
p {
    font-weight: 700;
    font-size: xx-large;
}

.question-element {
    height: 10rem;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
