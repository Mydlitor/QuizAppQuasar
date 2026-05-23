<template>
    <q-dialog full-width>
        <div class="dialog-main">
            <q-linear-progress class="linear-progress" :value="progressRemaining" />
            <h5>{{ remaining }}</h5>
            <div class="dialog-content">
                <h4>{{ question.text }}</h4>
                <q-btn @click="toggleTimer" :label="timerLabel" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue';
import { useCountdown, onKeyStroke } from '@vueuse/core'

const answerTime = shallowRef(30);
const isTimerActivated = ref(false)
const timerLabel = ref('START')
const { remaining, start, stop } = useCountdown(answerTime, {})
const progressRemaining = ref(1.0)

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

onKeyStroke(' ', e => {
    e.preventDefault()
    toggleTimer()
}, { dedupe: true })

watch(remaining, (newRemaining) => {
    progressRemaining.value = newRemaining / answerTime.value;
    //console.log("remaining: ", newRemaining, " progressRem: ", progressRemaining.value);
})

defineProps({
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
</style>
