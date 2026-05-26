<template>
    <q-card class="question-element">
        <p class="points-text" v-if="isText">{{ props.question.points }}</p>
        <p class="x-symbol" v-else>X</p>
    </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    question: Object
});

const isText = computed(() => {
    return props.question.isAnswered !== false
})

const textColor = computed(() => {
    if (props.question.teamAnswered !== null)
        return { color: props.question.teamAnswered.color }
    return { color: 'white' }
})

</script>

<style scoped lang="scss">
p {
    font-weight: 700;
    font-size: xx-large;
}

.points-text {
    color: v-bind('textColor.color')
}

.x-symbol {
    color: $muted;
}

.question-element {
    height: 10rem;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
