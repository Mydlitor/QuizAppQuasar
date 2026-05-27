<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake>
        <div class="dialog-main" ref="dialogRef">
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
                                <q-item clickable v-close-popup v-for="team in teamsOptions" v-bind:key="team.name"
                                    @click="selectTeam(team)">
                                    <q-item-section>
                                        {{ team.name }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { useCountdown, onKeyStroke } from '@vueuse/core'

const answerTime = shallowRef(30);
const isTimerActivated = ref(false)
const timerLabel = computed(() => { return isTimerActivated.value ? "STOP" : "START" })
const { remaining, start, stop } = useCountdown(answerTime, {})
const progressRemaining = ref(1.0)
const isSteal = ref(false);
const teamsOptions = ref([])
const selectedTeam = ref(null)
const dialogRef = ref(null)

const onAnsweredCorrectly = () => {
    stopTimer()
    animateBorder("green");
    emit('answered-correctly', props.question, selectedTeam.value)
}

const onAnsweredIncorrectly = () => {
    stopTimer()
    animateBorder("red");
    emit('answered-incorrectly', props.question)
    teamsOptions.value = teamsOptions.value.filter(t => t != selectedTeam.value)
}

const selectTeam = (team) => {
    selectedTeam.value = team;
}

const onSteal = () => {
    isSteal.value = true;
}

const toggleTimer = () => {
    !isTimerActivated.value ? startTimer() : stopTimer();
}

const startTimer = () => {
    start();
    isTimerActivated.value = true
}

const stopTimer = () => {
    stop();
    isTimerActivated.value = false
}

const onDialogBeforeShow = () => {
    teamsOptions.value = props.teams
    selectedTeam.value = props.currentTeam
    teamsOptions.value = teamsOptions.value.filter(t => t != selectedTeam.value)
}

const onDialogBeforeHide = () => {
    stopTimer()
    emit('hide-dialog')
}

const animateBorder = (color) => {
    if (!dialogRef.value)
        return;
    dialogRef.value.style.borderColor = color;
    window.setTimeout(() => {
        dialogRef.value.style.borderColor = 'transparent';

    }, 1000);
}

onKeyStroke(' ', e => {
    e.preventDefault()
    toggleTimer()
}, { dedupe: true })

watch(remaining, (newRemaining) => {
    progressRemaining.value = newRemaining / answerTime.value;
})

const props = defineProps({
    question: Object,
    teams: Array,
    currentTeam: Object,
});

const emit = defineEmits(['answered-correctly', 'answered-incorrectly', 'hide-dialog'])

</script>

<style scoped lang="scss">
.dialog-main {
    height: 80%;
    width: 80% !important;
    background-color: $dark;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid 3px transparent;
    transition: border-color 200ms ease;
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
    padding: 10rem 5rem 5rem 5rem;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
</style>
