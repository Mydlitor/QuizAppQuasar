<template>
    <q-page class="game-view-main">
        <div v-if="!data">
            <p>loading...</p>
        </div>
        <div v-else class="questions-container">
            <div class="category-column" v-for="category in data.categories" v-bind:key="category.name">
                <QuestionElement v-for="question in category.questions" v-bind:key="question.number"
                    :question-points="question.points" @click="showQuestionDialog(question)" />
            </div>
        </div>
        <QuestionDialog v-model="isDialogShown" :question="currentQuestion" />
    </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref, watch } from 'vue';
import QuestionElement from 'components/QuestionElement.vue';
import QuestionDialog from 'src/components/QuestionDialog.vue';
import dataJson from 'assets/questions.json';
const data = ref(null);
const $q = useQuasar()
const isDialogShown = ref(false)
const currentQuestion = ref(null)

const showQuestionDialog = (question) => {
    console.log("clicked")
    currentQuestion.value = question;
    isDialogShown.value = true;
    console.log(currentQuestion.value)
}

const setQuestionValues = () => {
    data.value.categories.forEach(category => {
        category.questions.forEach(question => {
            question.isAnswered = false
            question.points = (parseInt(question.number) + 1) * 10
            question.teamAnswered = null
        })
    });
}


watch(isDialogShown, (dialogValue) => {
    console.log(dialogValue)
})

onMounted(() => {
    $q.dark.set(true)
    data.value = dataJson
    setQuestionValues();
    console.log(data.value);
})
</script>

<style scoped>
.game-view-main {
    padding-top: 2rem;
}

.questions-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.category-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
