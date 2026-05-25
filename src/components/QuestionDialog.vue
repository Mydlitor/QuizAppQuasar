<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow">
        <div class="dialog-main">
            <q-linear-progress class="linear-progress" :value="progressRemaining" />
            <h5>{{ remaining }}</h5>
            <div class="dialog-content">
                <h4>{{ props.question.text }}</h4>
                <q-btn @click="toggleTimer" :label="timerLabel" />
                <div class="buttons-container">
                    <div class="answer-buttons-container">
                        <q-btn label="CORRECT" @click="onAnsweredCorrectly" />
                        <q-btn label="INCORRECT" @click="onAnsweredIncorrectly" />
                    </div>
                    <q-btn label="STEAL" @click="onSteal">
                        <q-menu>
                            <q-list>
                                <q-item clickable v-close-popup v-for="team in teams" v-bind:key="team.name">
                                    <q-item-section>
                                        {{ team.name }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                    currentTeam: {{ currentTeam }}
                </div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue';
import { useCountdown, onKeyStroke } from '@vueuse/core'
import { useGameStore } from 'src/stores/gameStore';

const gameStore = useGameStore()

const answerTime = shallowRef(30);
const isTimerActivated = ref(false)
const timerLabel = ref('START')
const { remaining, start, stop } = useCountdown(answerTime, {})
const progressRemaining = ref(1.0)
const isSteal = ref(false);
const teams = ref([])
const currentTeam = ref(null)

const onAnsweredCorrectly = () => {
    gameStore.setQuestionCorrect(props.question, currentTeam)
}

const onAnsweredIncorrectly = () => {
    toggleTimer()
    gameStore.setQuestionIncorrect(props.question)
    teams.value = teams.value.filter(t => t != currentTeam.value)
    currentTeam.value = gameStore.getNextTeam(currentTeam.value)
}

const onSteal = () => {
    isSteal.value = true;
}

const toggleTimer = () => {
    !isTimerActivated.value ? startTimer() : stopTimer();
}

const startTimer = () => {
    timerLabel.value = 'STOP'
    console.log("start")
    start();
    isTimerActivated.value = true
}

const stopTimer = () => {
    timerLabel.value = 'START'
    console.log("stop")
    stop();
    isTimerActivated.value = false
}

const onDialogBeforeShow = () => {
    teams.value = gameStore.getTeams()
    currentTeam.value = gameStore.getCurrentTeam()
    console.log(currentTeam.value)
}

const onDialogBeforeHide = () => {
    stopTimer()
}

onKeyStroke(' ', e => {
    e.preventDefault()
    toggleTimer()
}, { dedupe: true })

watch(remaining, (newRemaining) => {
    progressRemaining.value = newRemaining / answerTime.value;
})

const props = defineProps({
    question: Object
});

</script>

<style scoped lang="scss">
.dialog-main {
    height: 80%;
    width: 80% !important;
    background-color: $dark;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    // padding-top: 10rem;
    // padding-left: 5rem;
    // padding-right: 5rem;
    // padding-bottom: 10rem;
    padding: 10rem 5rem 10rem 5rem;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
