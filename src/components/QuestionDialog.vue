<template>
    <q-dialog
        full-width
        @before-hide="onDialogBeforeHide"
        @before-show="onDialogBeforeShow"
        no-backdrop-dismiss
        no-shake
        ref="qDialogRef"
    >
        <div class="dialog-main" ref="dialogDivRef">
            <q-linear-progress class="linear-progress" rounded :value="progressRemaining" />
            <h5>{{ remaining }}</h5>
            <div class="dialog-content">
                <div class="question-content">
                    <q-img
                        v-if="props.question.media"
                        :src="`media://${props.question.media}`"
                        fit="contain"
                        style="height: 30vh; width: 100%; margin-bottom: 1rem"
                    />
                    <h4>{{ props.question.text }}</h4>
                </div>
                <div class="buttons-container">
                    <q-btn @click="toggleTimer" :label="timerLabel" />
                    <div class="answer-buttons-container">
                        <q-btn label="CORRECT" @click="onAnsweredCorrectly" />
                        <q-btn label="INCORRECT" @click="onAnsweredIncorrectly" />
                    </div>
                    <q-btn label="STEAL" @click="onSteal">
                        <q-menu>
                            <q-list>
                                <q-item
                                    clickable
                                    v-close-popup
                                    v-for="team in teamsOptions"
                                    v-bind:key="team.name"
                                    @click="onTeamSelect(team)"
                                >
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
import { computed, ref, watch } from "vue";
import { useCountdown, onKeyStroke } from "@vueuse/core";

const answerTimeData = ref(0);
const isTimerActivated = ref(false);
const timerLabel = computed(() => {
    return isTimerActivated.value ? "STOP" : "START";
});
const { remaining, start, stop } = useCountdown(answerTimeData, {});
const progressRemaining = ref(1.0);
const isSteal = ref(false);
const teamsOptions = ref([]);
const selectedTeam = ref(null);
const dialogDivRef = ref(null);
const qDialogRef = ref(null);
const timeToCloseWindowInMs = 1500;

const onAnsweredCorrectly = () => {
    stopTimer();
    animateBorder("green");
    emit("answered-correctly", props.question, selectedTeam.value);
    window.setTimeout(() => {
        qDialogRef.value.hide();
    }, timeToCloseWindowInMs);
};

const onAnsweredIncorrectly = () => {
    stopTimer();
    animateBorder("red");
    emit("answered-incorrectly", props.question);
    teamsOptions.value = teamsOptions.value.filter((t) => t != selectedTeam.value);
};

const onTeamSelect = (team) => {
    selectedTeam.value = team;
};

const onSteal = () => {
    isSteal.value = true;
};

const toggleTimer = () => {
    !isTimerActivated.value ? startTimer() : stopTimer();
};

const startTimer = () => {
    start();
    isTimerActivated.value = true;
};

const stopTimer = () => {
    stop();
    isTimerActivated.value = false;
};

const onDialogBeforeShow = () => {
    teamsOptions.value = props.teams;
    selectedTeam.value = props.currentTeam;
    teamsOptions.value = teamsOptions.value.filter((t) => t != selectedTeam.value);
    answerTimeData.value = props.answerTime ? props.answerTime : 30;
    remaining.value = answerTimeData.value;
};

const onDialogBeforeHide = () => {
    stopTimer();
    emit("hide-dialog");
};

const animateBorder = (color) => {
    if (!dialogDivRef.value) return;
    const flashes = [
        { start: 0, end: 150 },
        { start: 300, end: 450 },
        { start: 600, end: 1050 },
    ];

    flashes.forEach(({ start, end }) => {
        window.setTimeout(() => {
            if (!dialogDivRef.value) return;
            dialogDivRef.value.style.borderColor = color;
        }, start);

        window.setTimeout(() => {
            if (!dialogDivRef.value) return;
            dialogDivRef.value.style.borderColor = "transparent";
        }, end);
    });
};

onKeyStroke(
    " ",
    (e) => {
        e.preventDefault();
        toggleTimer();
    },
    { dedupe: true },
);

watch(remaining, (newRemaining) => {
    if (newRemaining === answerTimeData.value) progressRemaining.value = 1.0;
    else
        progressRemaining.value = Number.parseFloat(
            ((newRemaining - 1) / answerTimeData.value).toPrecision(3),
        );
    if (newRemaining === 0) {
        animateBorder("white");
        stopTimer();
    }
});

const props = defineProps({
    question: Object,
    answerTime: Number,
    teams: Array,
    currentTeam: Object,
});

const emit = defineEmits(["answered-correctly", "answered-incorrectly", "hide-dialog"]);
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    // padding-top: 10rem;
    // padding-left: 5rem;
    // padding-right: 5rem;
    // padding-bottom: 10rem;
    padding: 0rem 5rem 2rem 5rem;
}

.question-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
</style>
