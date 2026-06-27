<template>
    <q-page class="game-view-main">
        <div class="back-button-container">
            <q-btn class="back-button" label="BACK" @click="onBackButton" />
        </div>

        <div v-if="!questions">
            <p>NO QUESTIONS</p>
        </div>
        <div class="questions-container">
            <div
                class="category-column"
                v-for="category in questions.categories"
                v-bind:key="category.name"
            >
                <p
                    class="category-name"
                    style="font-size: large; word-break: break-word; height: 3rem"
                >
                    {{ category.name }}
                </p>
                <QuestionElement
                    v-for="question in category.questions"
                    v-bind:key="question.number"
                    :question="question"
                    @click="showQuestionDialog(question)"
                />
            </div>
        </div>
        <span>{{ currentTeam }}</span>
        <q-btn
            v-show="isGameResultEnded"
            label="SHOW RESULTS"
            @click="isGameResultDialogShown = true"
        />

        <QuestionDialog
            v-model="isQuestionDialogShown"
            :question="currentQuestion"
            :teams="teams"
            :current-team="currentTeam"
            :answer-time="answerTime"
            @answered-correctly="onAnsweredCorrectly"
            @answered-incorrectly="onAnsweredIncorrectly"
            @hide-dialog="onDialogHide"
        />
        <GameResultDialog v-model="isGameResultDialogShown" :teams="teams" />
    </q-page>
</template>

<script setup>
import { useGameStore } from "src/stores/gameStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import QuestionElement from "components/QuestionElement.vue";
import QuestionDialog from "src/components/QuestionDialog.vue";
import GameResultDialog from "src/components/GameResultDialog.vue";

const gameStore = useGameStore();
const router = useRouter();

const questions = computed(() => gameStore.getQuestions());
const teams = computed(() => gameStore.getTeams());
const answerTime = computed(() => gameStore.getAnswerTime());
const isQuestionDialogShown = ref(false);
const isGameResultEnded = computed(() => gameStore.getGameEndedStatus());
const isGameResultDialogShown = ref(false);
const currentQuestion = ref(null);
const currentTeam = ref(null);
const answered = ref(false);

const showQuestionDialog = (question) => {
    if (currentQuestion.value != null && answered.value) {
        gameStore.selectNextTeam();
    }
    currentQuestion.value = question;
    currentTeam.value = gameStore.getCurrentTeam();
    isQuestionDialogShown.value = true;
    answered.value = false;
};

const onAnsweredCorrectly = (question, team) => {
    gameStore.setQuestionCorrect(question, team);
    answered.value = true;
};

const onAnsweredIncorrectly = (question) => {
    gameStore.setQuestionIncorrect(question);
    answered.value = true;
};

const onBackButton = () => {
    gameStore.saveGameStatus();
    router.push("/");
};

onMounted(() => {
    gameStore.setupData();
    currentTeam.value = gameStore.getCurrentTeam();
    console.log(isGameResultEnded.value);
});
</script>

<style scoped>
.game-view-main {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.questions-container {
    margin-top: 1rem;
    width: 80%;
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    justify-content: center;
    gap: 1rem;
}

.category-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    width: min-content;
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
