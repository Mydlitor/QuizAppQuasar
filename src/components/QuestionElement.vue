<template>
    <q-card class="question-element">
        <p>{{ props.question.text }}</p>
    </q-card>
</template>

<script setup>
import { ref } from 'vue';
const textColor = ref({
    color: 'white',
});

const props = defineProps({
    question: Object
});
</script>

<style scoped>
p {
    font-weight: 700;
    font-size: xx-large;
    color: v-bind('textColor.color')
}

.question-element {
    height: 10rem;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
