<template>
    <q-page class="game-view-main">
        <div v-if="!data">
            <p>loading...</p>
        </div>
        <div v-else class="questions-container">
            <div class="category-column" v-for="category in data.categories" v-bind:key="category.name">
                <QuestionElement v-for="question in category.questions" v-bind:key="question.number"
                    :question-text="question.text" :question-number="question.number" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue';
import QuestionElement from 'components/QuestionElement.vue';
import dataJson from 'assets/questions.json';
const data = ref(null);
const $q = useQuasar()

onMounted(() => {
    $q.dark.set(true)
    data.value = dataJson
    console.log(data.value);
})
</script>

<style scoped>
.game-view-main {
    margin: 2rem;
}

.questions-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.category-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
