<template>
    <q-page class="game-view-main">
        <div v-if="!questions">
            <p>loading...</p>
        </div>
        <div v-else class="questions-container">
            <div class="category-column" v-for="category in questions.categories" v-bind:key="category.name">
                <QuestionElement v-for="question in category.questions" v-bind:key="question.number"
                    :question="question" @click="showQuestionDialog(question)" />
            </div>
        </div>
        <QuestionDialog v-model="isDialogShown" :question="currentQuestion" :teams="teams" :current-team="currentTeam"
            @answered-correctly="onAnsweredCorrectly" @answered-incorrectly="onAnsweredIncorrectly"
            @hide-dialog="onDialogHide" />
    </q-page>
</template>

<script setup>
import { useGameStore } from 'src/stores/gameStore';
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue';
import QuestionElement from 'components/QuestionElement.vue';
import QuestionDialog from 'src/components/QuestionDialog.vue';

const gameStore = useGameStore();

const questions = computed(() => gameStore.getQuestions())
const teams = ref([])
const $q = useQuasar()
const isDialogShown = ref(false)
const currentQuestion = ref(null)
const currentTeam = ref(null)

const showQuestionDialog = (question) => {
    currentQuestion.value = question;
    currentTeam.value = gameStore.getCurrentTeam()
    isDialogShown.value = true;
}

const onAnsweredCorrectly = (question, team) => {
    gameStore.setQuestionCorrect(question, team)
}

const onAnsweredIncorrectly = (question) => {
    gameStore.setQuestionIncorrect(question)
}

const onDialogHide = () => {
    gameStore.selectNextTeam()
}

onMounted(() => {
    $q.dark.set(true)
    gameStore.setupData()
    questions.value = gameStore.getQuestions()
    teams.value = gameStore.getTeams();
    currentTeam.value = gameStore.getCurrentTeam()
})
</script>

<style scoped>
.game-view-main {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.questions-container {
    width: 80%;
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
