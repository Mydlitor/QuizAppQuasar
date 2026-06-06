<template>
    <q-page class="game-view-main">
        <div class="back-button-container">
            <q-btn class="back-button" label="BACK" @click="onBackButton" />
        </div>
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
            :answer-time="answerTime" @answered-correctly="onAnsweredCorrectly"
            @answered-incorrectly="onAnsweredIncorrectly" @hide-dialog="onDialogHide" />
    </q-page>
</template>

<script setup>
import { useGameStore } from 'src/stores/gameStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import QuestionElement from 'components/QuestionElement.vue';
import QuestionDialog from 'src/components/QuestionDialog.vue';

const gameStore = useGameStore();
const router = useRouter();

const questions = computed(() => gameStore.getQuestions())
const teams = computed(() => gameStore.getTeams())
const answerTime = computed(() => gameStore.getAnswerTime())
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

const onBackButton = () => {
    gameStore.saveGameStatus();
    router.push("/");
}

onMounted(() => {
    gameStore.setupData();
    currentTeam.value = gameStore.getCurrentTeam();
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

.back-button-container {
    position: fixed;
    left: 1rem;
    top: 1rem;
}

.back-button {
    color: white;
}
</style>
